"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { FotoEmTelaCheia } from "./foto-em-tela-cheia";
import { urlDaImagem } from "../lib/imagem";

type Props = {
  /** As fotos que não são a capa: ela já é o herói do topo da página. */
  fotos: string[];
  titulo: string;
};

/**
 * As outras fotos do imóvel.
 *
 * Rolagem horizontal nativa com `scroll-snap`, não biblioteca: arrasto no
 * celular, roda no desktop e teclado vêm do navegador de graça. Biblioteca de
 * carrossel traria peso e um modelo de foco próprio para depois brigar com o
 * diálogo de tela cheia.
 */
export function CarrosselDeFotos({ fotos, titulo }: Props) {
  const trilho = useRef<HTMLUListElement>(null);
  const [ampliada, setAmpliada] = useState<number | null>(null);

  if (fotos.length === 0) return null;

  const sozinha = fotos.length === 1;

  function deslizar(direcao: 1 | -1) {
    const caixa = trilho.current;

    if (!caixa) return;

    // Uma "página" é a largura visível: o passo acompanha o tamanho da tela
    // em vez de um número fixo que erraria no celular.
    caixa.scrollBy({ left: direcao * caixa.clientWidth, behavior: "smooth" });
  }

  return (
    <section aria-labelledby="titulo-das-fotos" className="mt-11">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="titulo-das-fotos" className="font-display text-2xl font-semibold">
          Mais fotos
        </h2>

        {!sozinha && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => deslizar(-1)}
              aria-label="Fotos anteriores"
              className="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-foreground/40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => deslizar(1)}
              aria-label="Próximas fotos"
              className="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-foreground/40"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}
      </div>

      <ul
        ref={trilho}
        className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {fotos.map((foto, indice) => (
          <li key={foto} className="w-64 shrink-0 snap-start sm:w-80">
            {/*
              O nome do botao vem de `aria-label`, e nao de um `sr-only` dentro
              dele: `sr-only` e `position: absolute`, e sem ancestral
              posicionado o bloco de contencao dele e o proprio documento --
              entao ele escapava do clip do carrossel e esticava a pagina para
              688px numa tela de 390.
            */}
            <button
              type="button"
              onClick={() => setAmpliada(indice)}
              aria-label={`Ver foto ${indice + 2} em tela cheia`}
              className="block w-full overflow-hidden border border-border transition-colors hover:border-foreground/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlDaImagem(foto)}
                alt={`Foto ${indice + 2} de ${titulo}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {ampliada !== null && (
        <FotoEmTelaCheia
          fotos={fotos}
          atual={ampliada}
          onTrocar={setAmpliada}
          onFechar={() => setAmpliada(null)}
          titulo={titulo}
        />
      )}
    </section>
  );
}
