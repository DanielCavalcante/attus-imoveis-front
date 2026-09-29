"use client";

import type { ReactNode } from "react";

import { Announcement } from "../types/announcement";
import { PropertyCard } from "./property-card";

type Props = {
  announcements: Announcement[];
  isLoading: boolean;
  /** Exibido quando não há nada, carregando já terminou. */
  emptyState: ReactNode;
};

/** Só desenha. Filtro e ordenação são do servidor desde a spec 17. */
export function AnnouncementGrid({
  announcements,
  isLoading,
  emptyState,
}: Props) {
  if (isLoading) {
    return (
      <div
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Carregando imóveis"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-card">
            <div className="aspect-[4/3] animate-pulse bg-secondary" />

            <div className="space-y-4 p-5">
              <div className="h-4 w-1/3 animate-pulse bg-secondary" />
              <div className="h-5 w-3/4 animate-pulse bg-secondary" />
              <div className="h-7 w-1/2 animate-pulse bg-secondary" />
              <div className="h-5 w-2/3 animate-pulse bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!announcements.length) {
    return <>{emptyState}</>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {announcements.map((item, index) => (
        <PropertyCard key={item.id} announcement={item} priority={index < 3} />
      ))}
    </div>
  );
}
