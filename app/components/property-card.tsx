"use client";

import Link from "next/link";
import { Bath, BedDouble, Maximize } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Announcement } from "../types/announcement";
import {
  formatArea,
  formatPrice,
  hasRooms,
  propertyTypeLabel,
  reasonLabel,
} from "../lib/property";

type Props = {
  announcement: Announcement;
  priority?: boolean;
};

/**
 * Card único de imóvel. A home, a listagem e o dashboard usavam três marcações
 * diferentes para o mesmo objeto; tudo que mudar aqui vale para as três.
 *
 * Usa <img> e não next/image de propósito: a URL da imagem é digitada pelo
 * usuário no formulário de anúncio e next/image derruba host fora do
 * remotePatterns do next.config.ts.
 */
export function PropertyCard({ announcement, priority = false }: Props) {
  const stats = hasRooms(announcement.propertyType)
    ? [
        { icon: BedDouble, value: announcement.rooms, label: "Quartos" },
        { icon: Bath, value: announcement.bathRooms, label: "Banheiros" },
        { icon: Maximize, value: formatArea(announcement.area), label: "Área" },
      ]
    : [
        { icon: Maximize, value: formatArea(announcement.area), label: "Área" },
        {
          icon: BedDouble,
          value: propertyTypeLabel(announcement.propertyType),
          label: "Tipo",
        },
      ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={announcement.image}
          alt={`Foto de ${announcement.title}`}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {reasonLabel(announcement.reason)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h2 className="line-clamp-1 text-xl font-semibold">
            {announcement.title}
          </h2>

          <p className="text-sm text-muted-foreground">
            {announcement.city}
            {announcement.state ? ` - ${announcement.state}` : ""}
          </p>
        </div>

        <p className="text-2xl font-bold">
          {formatPrice(announcement.price, announcement.reason)}
        </p>

        <dl
          className="grid gap-3 rounded-xl bg-muted/50 p-3 text-center text-sm"
          style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <dt className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </dt>

              <dd className="mt-0.5 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <Button asChild className="mt-auto w-full">
          <Link href={`/anuncie/detail/${announcement.id}`}>
            Ver detalhes
            <span className="sr-only"> de {announcement.title}</span>
          </Link>
        </Button>
      </div>
    </article>
  );
}
