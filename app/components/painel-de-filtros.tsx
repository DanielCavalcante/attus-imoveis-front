"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { CampoComSugestoes } from "./campo-com-sugestoes";
import { useBairros, useCidades } from "../hooks/use-locations";
import { TIPOS_DE_IMOVEL, type PropertyType } from "../lib/property";

export type Filtros = {
  city: string;
  neighborhood: string;
  type: PropertyType | "";
  minPrice: string;
  maxPrice: string;
};

export const FILTROS_VAZIOS: Filtros = {
  city: "",
  neighborhood: "",
  type: "",
  minPrice: "",
  maxPrice: "",
};

type Props = {
  filtros: Filtros;
  onAplicar: (filtros: Filtros) => void;
};

const CAMPO =
  "min-h-13 w-full border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground";

const ROTULO = "mb-2 block text-xs tracking-[0.1em] text-muted-foreground";

/**
 * Os filtros da listagem.
 *
 * No desktop fica à esquerda, sempre à vista. No celular abre por um controle
 * próprio: empilhado, ele poria cinco controles entre a pessoa e o primeiro
 * imóvel, e a medição de 390px mostrou que altura é o recurso escasso ali.
 *
 * Quem guarda o estado é a URL, não este componente: o que está aqui é rascunho
 * até ser aplicado. É isso que mantém o resultado compartilhável por link.
 */
export function PainelDeFiltros({ filtros, onAplicar }: Props) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState<Filtros>(filtros);
  const [anterior, setAnterior] = useState(filtros);

  // A URL mudou por fora (voltar do navegador, link colado): o rascunho
  // acompanha. Ajuste na renderização, não por efeito.
  if (filtros !== anterior) {
    setAnterior(filtros);
    setRascunho(filtros);
  }

  const cidades = useCidades();
  const bairros = useBairros(rascunho.city);

  const faixaInvertida =
    Boolean(rascunho.minPrice) &&
    Boolean(rascunho.maxPrice) &&
    Number(rascunho.minPrice) > Number(rascunho.maxPrice);

  const temFiltro = Object.values(filtros).some(Boolean);

  function mudar(campo: keyof Filtros, valor: string) {
    setRascunho((atual) => {
      // Trocar a cidade invalida o bairro escolhido, como na home.
      if (campo === "city") {
        return { ...atual, city: valor, neighborhood: "" };
      }

      return { ...atual, [campo]: valor };
    });
  }

  function aplicar(evento: React.FormEvent) {
    evento.preventDefault();

    if (faixaInvertida) return;

    onAplicar(rascunho);
    setAberto(false);
  }

  function limparTudo() {
    setRascunho(FILTROS_VAZIOS);
    onAplicar(FILTROS_VAZIOS);
    setAberto(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto((estava) => !estava)}
        aria-expanded={aberto}
        aria-controls="painel-de-filtros"
        className="flex min-h-13 w-full items-center justify-center gap-2 border border-border px-6 text-sm font-medium transition-colors hover:border-foreground/40 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        {aberto ? "Fechar filtros" : "Filtrar"}
      </button>

      <form
        id="painel-de-filtros"
        onSubmit={aplicar}
        className={`border-border pt-6 lg:block lg:border-0 lg:pt-0 ${
          aberto ? "block border-t" : "hidden"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4 lg:border-b lg:border-border lg:pb-5">
          <h2 className="font-display text-xl font-semibold">Filtros</h2>

          {temFiltro && (
            <button
              type="button"
              onClick={limparTudo}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              {/*
                "Limpar filtros", e não só "Limpar": os campos de cidade e
                bairro têm cada um o seu "Limpar cidade" / "Limpar bairro", e
                três botões com nome parecido deixam quem usa leitor de tela
                sem saber qual apaga o quê.
              */}
              Limpar filtros
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <CampoComSugestoes
            id="filtro-cidade"
            rotulo="CIDADE"
            valor={rascunho.city}
            onChange={(valor) => mudar("city", valor)}
            sugestoes={cidades.data ?? []}
            placeholder="Qualquer cidade"
          />

          <CampoComSugestoes
            id="filtro-bairro"
            rotulo="BAIRRO"
            valor={rascunho.neighborhood}
            onChange={(valor) => mudar("neighborhood", valor)}
            sugestoes={bairros.data ?? []}
            placeholder="Qualquer bairro"
            estrito
            desabilitado={!rascunho.city.trim()}
            motivoDesabilitado="Escolha a cidade primeiro"
          />

          <div>
            <label htmlFor="filtro-tipo" className={ROTULO}>
              TIPO
            </label>

            <select
              id="filtro-tipo"
              value={rascunho.type}
              onChange={(evento) => mudar("type", evento.target.value)}
              className={CAMPO}
            >
              <option value="">Qualquer tipo</option>

              {TIPOS_DE_IMOVEL.map(({ valor, rotulo }) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="border-0 p-0">
            <legend className={ROTULO}>FAIXA DE PREÇO</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="filtro-preco-min" className="sr-only">
                  Preço mínimo
                </label>

                <input
                  id="filtro-preco-min"
                  type="number"
                  inputMode="numeric"
                  value={rascunho.minPrice}
                  onChange={(evento) => mudar("minPrice", evento.target.value)}
                  placeholder="Mínimo"
                  className={`${CAMPO} tabular`}
                />
              </div>

              <div>
                <label htmlFor="filtro-preco-max" className="sr-only">
                  Preço máximo
                </label>

                <input
                  id="filtro-preco-max"
                  type="number"
                  inputMode="numeric"
                  value={rascunho.maxPrice}
                  onChange={(evento) => mudar("maxPrice", evento.target.value)}
                  placeholder="Máximo"
                  className={`${CAMPO} tabular`}
                />
              </div>
            </div>

            {/*
              Impedir a inversão é trabalho da tela, e a spec 18 disse isso com
              todas as letras: o servidor responde página vazia para faixa
              invertida porque é consulta sem resultado, não pedido malformado.
            */}
            {faixaInvertida && (
              <p
                className="mt-2 text-sm font-medium text-destructive"
                role="alert"
              >
                O mínimo está acima do máximo.
              </p>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={faixaInvertida}
            className="flex min-h-13 items-center justify-center bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-brand-light disabled:pointer-events-none disabled:opacity-60"
          >
            Aplicar filtros
          </button>
        </div>
      </form>
    </>
  );
}
