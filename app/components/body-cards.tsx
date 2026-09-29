"use client";

import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useAnnouncements } from "../hooks/use-announcements";
import { PropertyCard } from "./property-card";

export function FeaturedProperties() {
  const { data, isLoading } = useAnnouncements();

  // Primeira pagina da listagem publica: o carrossel e vitrine, nao acervo.
  const featured = data?.pages[0]?.content ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <h2 className="font-display text-3xl font-semibold">
          Publicados recentemente
        </h2>

        {featured.length > 0 && (
          <Link
            href="/imoveis"
            className="text-sm text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-brand-light"
          >
            Ver todos os imóveis
          </Link>
        )}
      </div>

      {isLoading && (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Carregando imóveis publicados recentemente"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card">
              <div className="aspect-[4/3] animate-pulse bg-secondary" />

              <div className="space-y-4 p-5">
                <div className="h-4 w-1/3 animate-pulse bg-secondary" />
                <div className="h-5 w-3/4 animate-pulse bg-secondary" />
                <div className="h-7 w-1/2 animate-pulse bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && featured.length === 0 && (
        <p className="border border-dashed border-border py-16 text-center text-muted-foreground">
          Nenhum imóvel publicado ainda. Seja o primeiro a anunciar.
        </p>
      )}

      {featured.length > 0 && (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {featured.map((announcement, index) => (
              <CarouselItem
                key={announcement.id}
                className="sm:basis-1/2 lg:basis-1/3"
              >
                <PropertyCard announcement={announcement} priority={index === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/*
            As setas nascem em -left-12/-right-12 no shadcn e vazavam a viewport
            no mobile, criando scroll horizontal. Ficam por dentro do trilho até
            haver margem para colocá-las fora.
          */}
          <CarouselPrevious className="left-2 lg:-left-12" />
          <CarouselNext className="right-2 lg:-right-12" />
        </Carousel>
      )}
    </section>
  );
}
