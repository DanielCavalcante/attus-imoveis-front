"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  temMais: boolean;
  carregando: boolean;
  carregarMais: () => void;
};

/**
 * Dispara a próxima página ao entrar em vista.
 *
 * O botão não é redundante: IntersectionObserver só dispara quando o elemento
 * aparece por rolagem, e quem navega por teclado chega ao fim da lista pelo
 * foco, sem rolar. Sem o botão, essa pessoa não alcança a página seguinte.
 */
export function InfiniteSentinel({ temMais, carregando, carregarMais }: Props) {
  const alvo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = alvo.current;

    if (!elemento || !temMais || carregando) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0]?.isIntersecting) {
          carregarMais();
        }
      },
      { rootMargin: "200px" },
    );

    observador.observe(elemento);

    return () => observador.disconnect();
  }, [temMais, carregando, carregarMais]);

  if (!temMais) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Você chegou ao fim da lista.
      </p>
    );
  }

  return (
    <div ref={alvo} className="flex justify-center py-10">
      <Button variant="outline" onClick={carregarMais} disabled={carregando}>
        {carregando ? "Carregando..." : "Carregar mais imóveis"}
      </Button>
    </div>
  );
}
