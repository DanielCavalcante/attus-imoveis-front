"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
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

  const featured = data?.slice(0, 8) ?? [];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Imóveis em destaque</h2>

          <p className="text-muted-foreground">
            Uma amostra do que está publicado na plataforma.
          </p>
        </div>

        {featured.length > 0 && (
          <Button asChild variant="outline">
            <Link href="/imoveis">Ver todos</Link>
          </Button>
        )}
      </div>

      {isLoading && (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-busy="true"
          aria-label="Carregando imóveis em destaque"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border">
              <div className="aspect-[4/3] animate-pulse bg-muted" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-7 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && featured.length === 0 && (
        <p className="rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
          Nenhum imóvel publicado ainda. Seja o primeiro a anunciar.
        </p>
      )}

      {featured.length > 0 && (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {featured.map((announcement, index) => (
              <CarouselItem
                key={announcement.id}
                className="sm:basis-1/2 lg:basis-1/4"
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
