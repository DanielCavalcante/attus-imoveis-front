"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, SearchX } from "lucide-react";

import { useAnnouncements } from "../hooks/use-announcements";
import { AnnouncementGrid } from "../components/announcement-grid";
import { InfiniteSentinel } from "../components/infinite-sentinel";

const ORDENACOES = {
  "": "Mais recentes",
  "price,desc": "Maior preço",
  "price,asc": "Menor preço",
} as const;

export default function PropertiesPage() {
  const [termoDigitado, setTermoDigitado] = useState("");
  const [sort, setSort] = useState<keyof typeof ORDENACOES>("");

  /**
   * Atraso de digitação: sem ele cada tecla vira uma requisição, e a busca
   * agora vai ao servidor.
   */
  const termo = useDebounced(termoDigitado, 350);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAnnouncements({ q: termo, sort });

  const anuncios = useMemo(
    () => data?.pages.flatMap((pagina) => pagina.content) ?? [],
    [data],
  );

  const total = data?.pages[0]?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Anúncios de Imóveis
            </h1>

            <p className="text-muted-foreground">
              {isLoading
                ? "Buscando imóveis disponíveis..."
                : `${total} ${total === 1 ? "imóvel disponível" : "imóveis disponíveis"}.`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="announcement-search">
              Buscar imóvel
            </label>

            <input
              id="announcement-search"
              type="search"
              value={termoDigitado}
              onChange={(event) => setTermoDigitado(event.target.value)}
              placeholder="Buscar por título ou cidade"
              className="h-10 rounded-md border bg-background px-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
              className="h-10 rounded-md border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Object.entries(ORDENACOES).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AnnouncementGrid
          announcements={anuncios}
          isLoading={isLoading}
          emptyState={termo.trim() ? <SemResultado termo={termo} /> : <SemAcervo />}
        />

        {anuncios.length > 0 && (
          <InfiniteSentinel
            temMais={!!hasNextPage}
            carregando={isFetchingNextPage}
            carregarMais={fetchNextPage}
          />
        )}
      </div>
    </div>
  );
}

function SemResultado({ termo }: { termo: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />

      <p className="mt-4 text-lg font-semibold">
        Nenhum imóvel para “{termo}”
      </p>

      <p className="mt-1 text-muted-foreground">
        Tente outro título ou cidade.
      </p>
    </div>
  );
}

function SemAcervo() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <Building2 className="h-12 w-12 text-muted-foreground" aria-hidden />
      </div>

      <h2 className="mt-8 text-3xl font-bold">
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
