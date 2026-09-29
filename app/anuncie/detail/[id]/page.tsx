"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, ShieldCheck } from "lucide-react";

import { useAnnouncementDetail } from "@/app/hooks/use-detail-announcement";
import {
  formatArea,
  formatPrice,
  hasRooms,
  propertyTypeLabel,
  reasonLabel,
} from "@/app/lib/property";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading, error } = useAnnouncementDetail(id);

  if (isLoading) {
    return (
      <div aria-busy="true">
        <div className="h-[46vh] animate-pulse bg-secondary" />

        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          <div className="h-5 w-40 animate-pulse bg-secondary" />
          <div className="mt-4 h-12 w-3/4 animate-pulse bg-secondary" />
          <div className="mt-6 h-10 w-52 animate-pulse bg-secondary" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-4xl font-semibold">
          Anúncio não encontrado
        </h1>

        <p className="mt-4 max-w-md text-muted-foreground">
          O imóvel que você procura pode ter sido removido, ou o link está
          incorreto.
        </p>

        <Link
          href="/imoveis"
          className="mt-9 flex min-h-13 items-center bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-brand-light"
        >
          Ver imóveis disponíveis
        </Link>
      </div>
    );
  }

  const showRooms = hasRooms(data.propertyType);

  const medidas = [
    ...(showRooms
      ? [
          { rotulo: "Quartos", valor: String(data.rooms) },
          { rotulo: "Banheiros", valor: String(data.bathRooms) },
        ]
      : []),
    { rotulo: "Área", valor: formatArea(data.area) },
    { rotulo: "Tipo", valor: propertyTypeLabel(data.propertyType) },
  ];

  return (
    <div>
      {/*
        A foto e o ceu desta pagina: sangria inteira, sem card e sem sombra por
        cima. O fio ambar abaixo dela e o horizonte, e tudo que vem depois e
        chao — interface sobre indigo.
      */}
      <div className="relative h-[46vh] min-h-72 overflow-hidden bg-secondary sm:h-[58vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.image}
          alt={`Foto de ${data.title}`}
          className="h-full w-full object-cover"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,18,32,0) 0%, rgba(12,18,32,0.9) 100%)",
          }}
        />
      </div>

      <div className="horizonte" />

      <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <div>
          <p className="text-xs tracking-[0.06em] text-muted-foreground">
            {reasonLabel(data.reason).toUpperCase()} · {data.city.toUpperCase()}
            {data.state ? ` · ${data.state.toUpperCase()}` : ""}
          </p>

          <h1 className="mt-3 max-w-[24ch] font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02]">
            {data.title}
          </h1>

          <p className="tabular mt-6 font-display text-4xl font-semibold">
            {formatPrice(data.price, data.reason)}
          </p>

          <dl className="mt-9 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">
            {medidas.map(({ rotulo, valor }) => (
              <div key={rotulo}>
                <dt className="text-xs tracking-[0.06em] text-muted-foreground">
                  {rotulo.toUpperCase()}
                </dt>

                <dd className="tabular mt-2 font-display text-2xl font-semibold">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 font-display text-2xl font-semibold">
            Sobre este imóvel
          </h2>

          <p className="mt-4 max-w-[68ch] leading-relaxed text-foreground/85">
            {data.description || "Este anúncio não tem descrição."}
          </p>

          <h2 className="mt-11 font-display text-2xl font-semibold">Onde fica</h2>

          <p className="mt-4 flex max-w-[68ch] items-start gap-3 leading-relaxed text-foreground/85">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />

            <span>
              {data.street}, {data.streetNumber}
              {data.complement ? ` — ${data.complement}` : ""}
              <br />
              {data.city} — {data.state}
              <br />
              <span className="tabular">CEP {data.cep}</span>
            </span>
          </p>
        </div>

        <aside className="flex flex-col gap-6">
          {/*
            Nao existe bloco de anunciante aqui, e isso e deliberado.
            O AnnouncementDetailDTO nao expoe o dono do anuncio, e a versao
            anterior desta tela preenchia a lacuna com o nome fixo
            "Daniel Cavalcante" mais dois botoes que nao faziam nada. Nome
            inventado ao lado de um selo de confianca e prova falsa — que e
            exatamente o que este produto vende como nao fazendo.

            Quando a API expuser dono, CRECI e data da analise, a marca de
            verificacao entra aqui.
          */}
          <section className="border border-border p-6">
            <h2 className="font-display text-xl font-semibold">
              Quem publicou este anúncio
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Ainda não mostramos o anunciante nesta tela: o dado não vem na
              resposta do anúncio. Falar com quem publicou também não está no ar.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Preferimos dizer isso a colocar um nome e um botão que não levam a
              ninguém.
            </p>
          </section>

          <section className="border border-verified p-6">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-verified">
              <ShieldCheck className="h-5 w-5" aria-hidden />
              Como a verificação funciona
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Nenhuma imobiliária publica antes de uma pessoa da equipe conferir
              CNPJ, razão social, CRECI com número e UF e o responsável legal.
              Reprovação vem com motivo escrito.
            </p>
          </section>

          <section className="border border-border p-6">
            <h2 className="font-display text-xl font-semibold">
              Vendendo o seu?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pessoa física publica três anúncios por mês sem pagar. Em cada um,
              pode pedir o contato da equipe de apoio à venda.
            </p>

            <Link
              href="/anuncie"
              className="mt-5 inline-block text-sm text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-brand-light"
            >
              Publicar um anúncio
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
