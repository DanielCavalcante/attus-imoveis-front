"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getBairros, getCidades } from "../services/locations.service";

/** Sem ele cada tecla vira requisicao, que e o motivo de a listagem ja usar um. */
export function useDebounced<T>(valor: T, atraso = 300) {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), atraso);

    return () => clearTimeout(id);
  }, [valor, atraso]);

  return atrasado;
}

export function useCidades() {
  return useQuery({
    queryKey: ["localidades", "cidades"],
    queryFn: getCidades,
  });
}

/**
 * Bairros da cidade escolhida.
 *
 * Sem cidade nao ha o que pedir: `enabled` evita a requisicao em vez de
 * mandar uma consulta que o servidor responderia com lista vazia.
 */
export function useBairros(cidade: string) {
  const cidadeEstavel = useDebounced(cidade.trim());

  return useQuery({
    queryKey: ["localidades", "bairros", cidadeEstavel],
    queryFn: () => getBairros(cidadeEstavel),
    enabled: cidadeEstavel.length > 0,
  });
}
