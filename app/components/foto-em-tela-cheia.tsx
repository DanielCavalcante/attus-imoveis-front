"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { urlDaImagem } from "../lib/imagem";

type Props = {
  fotos: string[];
  atual: number;
  onTrocar: (indice: number) => void;
  onFechar: () => void;
  titulo: string;
};

/**
 * A foto ampliada, como diálogo de verdade.
 *
 * Foto ampliada que deixa o foco correr atrás dela é armadilha para quem
 * navega por teclado: some a imagem e a pessoa não sabe onde está. Por isso o
 * foco entra aqui e não sai enquanto estiver aberta.
 *
 * `Esc` e as setas são atalhos deste diálogo, não da página: presos aqui, eles
 * não roubam a seta de quem está rolando a lista.
 */
export function FotoEmTelaCheia({
  fotos,
  atual,
  onTrocar,
  onFechar,
  titulo,
}: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);

  const sozinha = fotos.length <= 1;

  useEffect(() => {
    fechar.current?.focus();
  }, []);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onFechar();
        return;
      }

      if (evento.key === "ArrowRight") {
        evento.preventDefault();
        onTrocar((atual + 1) % fotos.length);
        return;
      }

      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        onTrocar((atual - 1 + fotos.length) % fotos.length);
        return;
      }

      if (evento.key !== "Tab") return;

      // O foco dá a volta dentro do diálogo em vez de escapar para a página
      // que continua atrás.
      const focaveis = caixa.current?.querySelectorAll<HTMLElement>("button");

      if (!focaveis || focaveis.length === 0) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoTeclar);

    return () => document.removeEventListener("keydown", aoTeclar);
  }, [atual, fotos.length, onFechar, onTrocar]);

  return (
    <div
      ref={caixa}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${titulo}`}
      /*
        Fundo praticamente opaco: a pagina atras competindo com a foto e
        exatamente o que a tela cheia existe para eliminar.
      */
      className="fixed inset-0 z-50 flex flex-col bg-[#0c1220]"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="tabular text-sm text-muted-foreground">
          {atual + 1} de {fotos.length}
        </p>

        <button
          ref={fechar}
          type="button"
          onClick={onFechar}
          aria-label="Fechar fotos"
          className="flex min-h-11 items-center gap-2 border border-border px-4 text-sm transition-colors hover:border-foreground/40"
        >
          <X className="h-4 w-4" aria-hidden />
          Fechar
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden px-4 pb-6 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlDaImagem(fotos[atual])}
          alt={`Foto ${atual + 1} de ${titulo}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {!sozinha && (
        <div className="flex items-center justify-center gap-3 px-4 pb-8">
          <button
            type="button"
            onClick={() => onTrocar((atual - 1 + fotos.length) % fotos.length)}
            aria-label="Foto anterior"
            className="flex h-12 w-12 items-center justify-center border border-border transition-colors hover:border-foreground/40"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => onTrocar((atual + 1) % fotos.length)}
            aria-label="Próxima foto"
            className="flex h-12 w-12 items-center justify-center border border-border transition-colors hover:border-foreground/40"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
