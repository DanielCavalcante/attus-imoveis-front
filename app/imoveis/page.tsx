"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, SearchX } from "lucide-react";

import { useAnnouncements } from "../hooks/use-announcements";
import { AnnouncementGrid } from "../components/announcement-grid";
import { InfiniteSentinel } from "../components/infinite-sentinel";
import {
  FILTROS_VAZIOS,
  PainelDeFiltros,
  type Filtros,
} from "../components/painel-de-filtros";
import { propertyTypeLabel, type PropertyType } from "../lib/property";
import { buildAnnouncementsQuery } from "../services/announcements.service";

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
 * A URL é a fonte dos filtros, e o painel escreve nela.
 *
 * Isso faz o link ser compartilhável e o botão de voltar do navegador
 * funcionar sem código a mais: ler e escrever são o mesmo mecanismo nos dois
 * sentidos.
 */
function Listagem() {
  const parametros = useSearchParams();
  const router = useRouter();

  const filtros: Filtros = useMemo(
    () => ({
      city: parametros.get("city") ?? "",
      neighborhood: parametros.get("neighborhood") ?? "",
      type: (parametros.get("type") as PropertyType | null) ?? "",
      minPrice: parametros.get("minPrice") ?? "",
      maxPrice: parametros.get("maxPrice") ?? "",
    }),
    [parametros],
  );

  const termoDaUrl = parametros.get("q") ?? "";

  const [termoDigitado, setTermoDigitado] = useState(termoDaUrl);
  const [sort, setSort] = useState<keyof typeof ORDENACOES>("");

  /**
   * Atraso de digitação: sem ele cada tecla vira uma requisição, e a busca
   * agora vai ao servidor.
   */
  const termo = useDebounced(termoDigitado, 350);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useAnnouncements({
      q: termo,
      sort,
      city: filtros.city || undefined,
      neighborhood: filtros.neighborhood || undefined,
      type: filtros.type || undefined,
      minPrice: filtros.minPrice || undefined,
      maxPrice: filtros.maxPrice || undefined,
    });

  const anuncios = useMemo(
    () => data?.pages.flatMap((pagina) => pagina.content) ?? [],
    [data],
  );

  const total = data?.pages[0]?.totalElements ?? 0;

  function aplicar(novos: Filtros) {
    const consulta = buildAnnouncementsQuery({
      q: termo,
      city: novos.city,
      neighborhood: novos.neighborhood,
      type: novos.type || undefined,
      minPrice: novos.minPrice,
      maxPrice: novos.maxPrice,
    });

    router.push(`/imoveis${consulta}`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
        {/*
          Fixo nos dois regimes, e nao so no desktop: abaixo de `lg` o painel
          vira um botao "Filtrar" e, sem isto, ele subia junto com a lista --
          quem rolasse tres cards ficava sem nenhum jeito de trocar o recorte.

          O teto de altura e o que mantem o `sticky` honesto: painel mais alto
          que a janela nao gruda, ele so para de rolar no fim. Com o teto, ele
          rola por dentro.
        */}
        <aside className="sticky top-0 z-30 max-h-[calc(100dvh-1rem)] overflow-y-auto bg-background py-2 lg:top-8 lg:max-h-[calc(100dvh-4rem)] lg:self-start lg:py-0">
          <PainelDeFiltros filtros={filtros} onAplicar={aplicar} />
        </aside>

        <div>
          <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
                {titulo({ termo: termo.trim(), ...filtros })}
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
                className="min-h-12 border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground sm:w-60"
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
                termo.trim() ? (
                  <SemResultado termo={termo.trim()} />
                ) : (
                  <SemAcervo />
                )
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
      </div>
    </div>
  );
}

/**
 * O título diz o que está sendo mostrado.
 *
 * Com filtro aplicado, "Todos os imóveis" seria mentira: a pessoa pediu um
 * recorte e a contagem abaixo se refere ao recorte, não ao acervo.
 */
function titulo({
  termo,
  city,
  neighborhood,
  type,
}: {
  termo: string;
  city?: string;
  neighborhood?: string;
  type?: PropertyType | "";
}) {
  if (termo) return `Imóveis para “${termo}”`;

  const oQue = type ? propertyTypeLabel(type) : "Imóveis";
  const onde = [neighborhood, city].filter(Boolean).join(", ");

  if (!onde) return type ? `${oQue}` : "Todos os imóveis";

  return `${oQue} em ${onde}`;
}

function Carregando() {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6"
      aria-busy="true"
    >
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
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <Building2 className="h-10 w-10 text-muted-foreground" aria-hidden />

      <h2 className="mt-6 font-display text-3xl font-semibold">
        Nenhum imóvel com esses filtros
      </h2>

      <p className="mt-3 max-w-lg text-muted-foreground">
        Tente afrouxar o recorte — outro bairro, outra faixa de preço, ou limpe
        os filtros para ver o acervo inteiro.
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
