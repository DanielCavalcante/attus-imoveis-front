"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Primeiro viewport da home.
 *
 * A fotografia e a unica fonte de luz da tela e por isso ocupa a sangria
 * inteira, sem card por cima: o mundo visual proibe foto dentro de caixa
 * sombreada. O fio ambar no pe da foto e o horizonte — o corte entre o ceu
 * (fotografia) e o chao (interface).
 *
 * O que saiu daqui, e por que:
 *
 * - A manchete "Milhoes de anuncios de imoveis, carros e motos" era falsa em
 *   tres frentes: nao ha milhoes, nao ha carros e nao ha motos.
 * - Os dois seletores ("O que voce deseja" e "Tipo de Imovel") nunca filtraram
 *   nada e faziam POST para /api/properties/search, rota que nao existe. Controle
 *   morto ensina o visitante a nao confiar no resto da tela.
 *
 * O campo abaixo faz o que diz: leva o termo para a listagem, que busca no
 * servidor por titulo, cidade e estado desde a spec 16.
 */
export default function BuscaHero() {
  const router = useRouter();
  const [termo, setTermo] = useState("");

  function buscar(evento: React.FormEvent) {
    evento.preventDefault();

    const limpo = termo.trim();

    router.push(limpo ? `/imoveis?q=${encodeURIComponent(limpo)}` : "/imoveis");
  }

  return (
    <section className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/register.jpg"
          alt=""
          className="revelar-luz h-full w-full object-cover object-[50%_42%]"
        />

        {/*
          Dois veus, e cada um resolve um problema diferente.

          O vertical assenta a foto no chao indigo. O lateral existe porque a
          manchete caia direto sobre o assunto da foto: sem ele o texto disputa
          o mesmo espaco que os rostos e nenhum dos dois ganha. Com ele a luz
          passa a vir da direita e a tipografia ganha chao proprio a esquerda.
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,18,32,0.86) 0%, rgba(12,18,32,0.28) 38%, rgba(12,18,32,0.58) 66%, #0C1220 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(12,18,32,0.88) 0%, rgba(12,18,32,0.62) 34%, rgba(12,18,32,0) 68%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <h1 className="max-w-[22ch] font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.94]">
          Toda imobiliária aqui passou por uma pessoa antes de passar por você.
        </h1>

        <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-foreground/85">
          CRECI conferido, razão social conferida, responsável legal conferido.
          Quem não passa, não publica. E quem vende o próprio imóvel tem uma
          equipe do lado.
        </p>
      </div>

      <div className="relative">
        <div className="horizonte" />

        <form
          onSubmit={buscar}
          className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-stretch sm:gap-0 sm:px-6 sm:py-0"
        >
          <label htmlFor="busca-home" className="sr-only">
            Buscar imóvel por cidade, bairro ou título
          </label>

          <input
            id="busca-home"
            name="q"
            type="search"
            value={termo}
            onChange={(evento) => setTermo(evento.target.value)}
            placeholder="Cidade, bairro ou o que você procura"
            className="min-h-14 flex-1 border border-border bg-card px-4 text-lg outline-none placeholder:text-muted-foreground sm:min-h-[5.5rem] sm:border-0 sm:border-b sm:bg-transparent sm:px-0 sm:text-2xl"
          />

          <button
            type="submit"
            className="flex min-h-14 items-center justify-center gap-2 bg-primary px-10 font-medium text-primary-foreground transition-colors hover:bg-brand-light sm:min-h-[5.5rem]"
          >
            <Search className="h-5 w-5" aria-hidden />
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
