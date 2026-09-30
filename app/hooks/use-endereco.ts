"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { getEndereco, type Endereco } from "../services/enderecos.service";

/** Oito dígitos, com ou sem hífen. Antes disso não há o que perguntar. */
export function cepCompleto(valor?: string) {
  return /^\d{5}-?\d{3}$/.test((valor ?? "").trim());
}

function somenteDigitos(valor?: string) {
  return (valor ?? "").replace(/\D/g, "");
}

/**
 * Busca o endereço de um CEP, no evento que completa o CEP.
 *
 * Disparado por evento e não por efeito: preencher campos é efeito colateral,
 * e o lugar dele é o manipulador do evento que o causou. Fazer isso num
 * `useEffect` já custou três correções nesta base, com a regra
 * `react-hooks/set-state-in-effect` do React Compiler apontando o mesmo
 * problema.
 */
export function useEnderecoPorCep(aoEncontrar: (endereco: Endereco) => void) {
  /** O último CEP perguntado, para não perguntar de novo o mesmo. */
  const ultimo = useRef("");
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  const consulta = useMutation({
    mutationFn: (cep: string) => getEndereco(cep),
    onSuccess: (endereco) => {
      setNaoEncontrado(false);
      aoEncontrar(endereco);
    },
    onError: () => setNaoEncontrado(true),
  });

  /**
   * Chamar com o valor do campo a cada digitação; ela decide se pergunta.
   *
   * `ultimo` guarda o último CEP COMPLETO perguntado, e digitação incompleta
   * não o apaga. Apagar faria "limpar o campo e digitar o mesmo CEP" perguntar
   * de novo — e a resposta seria a mesma, porque CEP não muda de bairro.
   *
   * CEP diferente difere de `ultimo` de qualquer jeito, então corrigir um
   * dígito errado continua buscando.
   */
  function aoDigitar(valor: string) {
    if (!cepCompleto(valor)) {
      setNaoEncontrado(false);
      return;
    }

    const limpo = somenteDigitos(valor);

    if (limpo === ultimo.current) return;

    ultimo.current = limpo;
    consulta.mutate(limpo);
  }

  return {
    aoDigitar,
    buscando: consulta.isPending,
    naoEncontrado,
  };
}
