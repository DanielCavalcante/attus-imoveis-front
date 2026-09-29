import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { FeaturedProperties } from "./components/body-cards";
import HomeBusc from "@/app/components/home-busc";

export default function Home() {
  return (
    <>
      <HomeBusc />

      <Posicionamento />

      <FeaturedProperties />

      <ChamadaParaAnunciar />
    </>
  );
}

/**
 * As duas afirmacoes que sustentam o produto, e que o gate confirmou serem
 * indissociaveis: em quem o comprador pode confiar, e quem segura a mao de quem
 * nunca vendeu. Separadas, viram commodity.
 */
function Posicionamento() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-20">
      <div>
        <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
          A verificação é um fato com data
        </h2>

        <p className="mt-5 max-w-[58ch] leading-relaxed text-muted-foreground">
          Não é selo comprado nem estrela de avaliação. É o número do CRECI, a UF
          do conselho e o dia em que alguém da equipe conferiu — visível no
          anúncio, não escondido numa página institucional.
        </p>

        {/*
          Legenda do que a marca carrega, nao um registro. Nenhum CRECI de
          exemplo aqui: numero inventado ao lado de "verificado" e prova falsa.
        */}
        <p className="mt-7 inline-flex items-center gap-3 border border-verified px-4 py-3 text-sm text-verified">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          CRECI · UF do conselho · data da análise
        </p>
      </div>

      <div>
        <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Você não vende sozinho
        </h2>

        <p className="mt-5 max-w-[58ch] leading-relaxed text-muted-foreground">
          Em qualquer anúncio seu, você pede o contato de uma equipe que já fez
          isso muitas vezes — e alguém liga para você. Publicar são três por
          mês, de graça.
        </p>

        <p className="mt-7 max-w-[52ch] border-l border-border pl-5 leading-relaxed text-foreground/80">
          O pedido entra numa fila interna com o seu telefone e o seu e-mail.
          Quem atende é gente da casa, não um robô de disparo.
        </p>
      </div>
    </section>
  );
}

function ChamadaParaAnunciar() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
      <div className="h-px bg-primary/40" />

      <div className="flex flex-col gap-8 pt-11 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="max-w-[24ch] font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Tem um imóvel para vender?
          </h2>

          <p className="mt-4 max-w-[56ch] leading-relaxed text-muted-foreground">
            Pessoa física publica três por mês, de graça. Imobiliária passa pela
            análise antes da primeira publicação.
          </p>
        </div>

        <Link
          href="/portal/auth/register"
          className="flex min-h-14 shrink-0 items-center justify-center bg-primary px-9 font-medium text-primary-foreground transition-colors hover:bg-brand-light"
        >
          Começar a anunciar
        </Link>
      </div>
    </section>
  );
}
