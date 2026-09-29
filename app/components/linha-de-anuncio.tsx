"use client";

import Link from "next/link";

import { Announcement } from "../types/announcement";
import { formatArea, formatPrice, propertyTypeLabel } from "../lib/property";

type Props = {
  announcement: Announcement;
  ocupado: boolean;
  onInativar: (id: number) => void;
  onReativar: (id: number) => void;
  onExcluir: (anuncio: Announcement) => void;
};

/**
 * Um anúncio na página de gerenciamento.
 *
 * Não usa `PropertyCard`: aquele card foi desenhado para seduzir quem procura
 * imóvel, e aqui quem olha já é dono do que vê. Esta é tela de operação — linha
 * com estado, medidas e ações, não vitrine.
 */
export function LinhaDeAnuncio({
  announcement,
  ocupado,
  onInativar,
  onReativar,
  onExcluir,
}: Props) {
  const noAr = announcement.active !== false;

  return (
    <article className="flex flex-col gap-5 border-b border-border py-6 sm:flex-row sm:items-center">
      <div className="h-24 w-full shrink-0 overflow-hidden bg-secondary sm:w-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={announcement.image}
          alt=""
          className={`h-full w-full object-cover ${noAr ? "" : "opacity-40"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-semibold leading-tight">
            {announcement.title}
          </h2>

          {/*
            Estado por texto, não só por opacidade da foto: cor e contraste
            sozinhos não dizem o que está acontecendo.
          */}
          {noAr ? (
            <span className="border border-verified px-2 py-0.5 text-xs tracking-[0.06em] text-verified">
              NO AR
            </span>
          ) : (
            <span className="border border-border px-2 py-0.5 text-xs tracking-[0.06em] text-muted-foreground">
              FORA DO AR
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {announcement.city}
          {announcement.neighborhood ? ` · ${announcement.neighborhood}` : ""}
          {" · "}
          {propertyTypeLabel(announcement.propertyType)}
          {" · "}
          {formatArea(announcement.area)}
        </p>

        <p className="tabular mt-2 font-display text-xl font-semibold">
          {formatPrice(announcement.price, announcement.reason)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:shrink-0">
        <Link
          href={`/anuncie/edit/${announcement.id}`}
          className="flex min-h-11 items-center border border-border px-4 text-sm transition-colors hover:border-foreground/40 hover:bg-card"
        >
          Editar
        </Link>

        {noAr ? (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => onInativar(announcement.id)}
            className="min-h-11 border border-border px-4 text-sm transition-colors hover:border-foreground/40 hover:bg-card disabled:pointer-events-none disabled:opacity-60"
          >
            Tirar do ar
          </button>
        ) : (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => onReativar(announcement.id)}
            className="min-h-11 border border-primary px-4 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-60"
          >
            Voltar ao ar
          </button>
        )}

        <button
          type="button"
          disabled={ocupado}
          onClick={() => onExcluir(announcement)}
          className="min-h-11 border border-border px-4 text-sm text-destructive transition-colors hover:border-destructive disabled:pointer-events-none disabled:opacity-60"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
