"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getAnnouncements } from "../services/announcements.service";

type Filtros = {
  q?: string;
  sort?: string;
};

/**
 * Listagem pública com rolagem infinita.
 *
 * O termo e a ordenação entram na chave da consulta: trocar qualquer um dos
 * dois recomeça da primeira página, em vez de misturar resultados de filtros
 * diferentes nas páginas já acumuladas.
 */
export function useAnnouncements({ q, sort }: Filtros = {}) {
  return useInfiniteQuery({
    queryKey: ["announcements", { q: q?.trim() ?? "", sort: sort ?? "" }],
    queryFn: ({ pageParam }) => getAnnouncements({ page: pageParam, q, sort }),
    initialPageParam: 0,
    getNextPageParam: (ultima) =>
      ultima.last ? undefined : ultima.number + 1,
  });
}
