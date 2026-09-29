"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, SearchX } from "lucide-react";

import { useAnnouncements } from "../hooks/use-announcements";
import { AnnouncementGrid } from "../components/announcement-grid";
import { InfiniteSentinel } from "../components/infinite-sentinel";

const ORDENACOES = {
  "": "Publicados recentemente",
  "price,asc": "Menor preço",
  "price,desc": "Maior preço",
} as const;

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Carregando />}>
      <Listagem />
    </Suspense>
  );
}

/**
 * A busca da home chega por `?q=`. Sem ler o parametro aqui, aquele botao
 * levaria para a listagem inteira e o termo digitado se perderia no caminho.
 */
function Listagem() {
  const parametros = useSearchParams();
  const termoDaUrl = parametros.get("q") ?? "";

  const [termoDigitado, setTermoDigitado] = useState(termoDaUrl);
  const [sort, setSort] = useState<keyof typeof ORDENACOES>("");

  /**
   * Atraso de digitação: sem ele cada tecla vira uma requisição, e a busca
   * agora vai ao servidor.
   */
  const termo = useDebounced(termoDigitado, 350);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useAnnouncements({ q: termo, sort });

  const anuncios = useMemo(
    () => data?.pages.flatMap((pagina) => pagina.content) ?? [],
    [data],
  );

  const total = data?.pages[0]?.totalElements ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            {termo.trim() ? `Imóveis para “${termo.trim()}”` : "Todos os imóveis"}
          </h1>

          <p className="tabular mt-3 text-muted-foreground">
            {isLoading
              ? "Buscando imóveis disponíveis…"
              : `${total} ${total === 1 ? "anúncio publicado" : "anúncios publicados"}.`}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="announcement-search">
            Buscar imóvel por título, cidade ou estado
          </label>

          <input
            id="announcement-search"
            type="search"
            value={termoDigitado}
            onChange={(event) => setTermoDigitado(event.target.value)}
            placeholder="Título, cidade ou estado"
            className="min-h-12 border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground sm:w-72"
          />

          <label className="sr-only" htmlFor="announcement-sort">
            Ordenar por
          </label>

          <select
            id="announcement-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as keyof typeof ORDENACOES)
            }
            className="min-h-12 border border-input bg-card px-4 text-sm outline-none"
          >
            {Object.entries(ORDENACOES).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-8">
        <AnnouncementGrid
          announcements={anuncios}
          isLoading={isLoading}
          emptyState={
            termo.trim() ? <SemResultado termo={termo.trim()} /> : <SemAcervo />
          }
        />
      </div>

      {anuncios.length > 0 && (
        <InfiniteSentinel
          temMais={!!hasNextPage}
          carregando={isFetchingNextPage}
          carregarMais={fetchNextPage}
        />
      )}
    </div>
  );
}

function Carregando() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6" aria-busy="true">
      <div className="h-12 w-80 animate-pulse bg-secondary" />
      <div className="mt-4 h-5 w-52 animate-pulse bg-secondary" />
    </div>
  );
}

function SemResultado({ termo }: { termo: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border py-24 text-center">
      <SearchX className="h-9 w-9 text-muted-foreground" aria-hidden />

      <p className="mt-5 font-display text-2xl font-semibold">
        Nenhum imóvel para “{termo}”
      </p>

      <p className="mt-2 text-muted-foreground">
        A busca cobre título, cidade e estado. Tente outro termo.
      </p>
    </div>
  );
}

function SemAcervo() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <Building2 className="h-10 w-10 text-muted-foreground" aria-hidden />

      <h2 className="mt-6 font-display text-3xl font-semibold">
        Ainda não há imóveis publicados
      </h2>

      <p className="mt-3 max-w-lg text-muted-foreground">
        Assim que o primeiro anúncio for criado, ele aparece aqui.
      </p>
    </div>
  );
}

function useDebounced(valor: string, atraso: number) {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), atraso);

    return () => clearTimeout(id);
  }, [valor, atraso]);

  return atrasado;
}
