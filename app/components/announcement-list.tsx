"use client";

import { useMemo, useState, type ReactNode } from "react";
import { SearchX } from "lucide-react";

import { Announcement } from "../types/announcement";
import { PropertyCard } from "./property-card";

type SortOption = "recent" | "price-desc" | "price-asc";

const SORT_LABEL: Record<SortOption, string> = {
  recent: "Mais recentes",
  "price-desc": "Maior preço",
  "price-asc": "Menor preço",
};

type Props = {
  title: string;
  description: string;
  data?: Announcement[];
  isLoading: boolean;
  /** Renderizado no lugar da lista quando o usuário ainda não tem anúncios. */
  emptyState?: ReactNode;
};

export function AnnouncementList({
  title,
  description,
  data,
  isLoading,
  emptyState,
}: Props) {
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");

  const visible = useMemo(() => {
    const search = term.trim().toLowerCase();

    const filtered = (data ?? []).filter((item) =>
      search
        ? `${item.title} ${item.city} ${item.state}`.toLowerCase().includes(search)
        : true,
    );

    if (sort === "recent") return filtered;

    return [...filtered].sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : b.price - a.price,
    );
  }, [data, term, sort]);

  if (isLoading) {
    return (
      <div
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Carregando imóveis"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border bg-background shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-7 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-9 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.length) return <>{emptyState}</>;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="announcement-search">
            Buscar imóvel
          </label>

          <input
            id="announcement-search"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Buscar por título ou cidade"
            className="h-10 rounded-md border bg-background px-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />

          <label className="sr-only" htmlFor="announcement-sort">
            Ordenar por
          </label>

          <select
            id="announcement-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-10 rounded-md border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Object.entries(SORT_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visible.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item, index) => (
            <PropertyCard
              key={item.id}
              announcement={item}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />

          <p className="mt-4 text-lg font-semibold">
            Nenhum imóvel para “{term}”
          </p>

          <p className="mt-1 text-muted-foreground">
            Tente outro título ou cidade.
          </p>
        </div>
      )}
    </>
  );
}
