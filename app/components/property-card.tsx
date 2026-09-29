"use client";

import Link from "next/link";

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
 *
 * Duas regras do mundo visual valem aqui e explicam o desenho:
 *
 * - A foto nunca entra dentro de caixa sombreada. Ela é a fonte de luz; sombra
 *   por cima dela apaga exatamente o que o card tem de bom. Sem sombra, sem
 *   canto arredondado na imagem e sem zoom no hover.
 * - Nada de caixa dentro de caixa: os números do imóvel ficam numa faixa
 *   separada por fio, não num bloco cinza afundado no card.
 */
export function PropertyCard({ announcement, priority = false }: Props) {
  const stats = hasRooms(announcement.propertyType)
    ? [
        { value: announcement.rooms, label: "Quartos" },
        { value: announcement.bathRooms, label: "Banheiros" },
        { value: formatArea(announcement.area), label: "Área" },
      ]
    : [
        { value: formatArea(announcement.area), label: "Área" },
        {
          value: propertyTypeLabel(announcement.propertyType),
          label: "Tipo",
        },
      ];

  return (
    <article className="group flex h-full flex-col bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={announcement.image}
          alt={`Foto de ${announcement.title}`}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />

        <span className="absolute bottom-0 left-0 bg-background/90 px-3 py-1.5 text-xs font-medium tracking-[0.06em] text-foreground">
          {reasonLabel(announcement.reason).toUpperCase()}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs tracking-[0.05em] text-muted-foreground">
          {announcement.city}
          {announcement.state ? ` · ${announcement.state}` : ""}
        </p>

        <h2 className="mt-2 line-clamp-2 font-display text-xl font-semibold leading-tight">
          <Link
            href={`/anuncie/detail/${announcement.id}`}
            className="transition-colors hover:text-primary"
          >
            {announcement.title}
            <span className="sr-only"> — ver detalhes</span>
          </Link>
        </h2>

        <p className="tabular mt-4 font-display text-2xl font-semibold">
          {formatPrice(announcement.price, announcement.reason)}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-4 text-sm">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-1.5">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="tabular font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
