import type { Metadata } from "next";

import { SITE } from "@/app/lib/site";

type Props = { params: Promise<{ id: string }> };

/**
 * Cada imóvel se apresenta como ele mesmo.
 *
 * Sem isto, toda página de imóvel herdava o título do layout de `/anuncie` e
 * dizia "Anuncie seu imóvel" -- o resultado da busca anunciaria o formulário,
 * não o apartamento. E é aqui que está o valor de SEO de um portal: são as
 * páginas dos imóveis que alguém procura, uma por endereço.
 *
 * Roda no servidor, então busca pelo endereço interno da API: `localhost` em
 * contêiner é o próprio contêiner do web.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const anuncio = await buscar(id);

  if (!anuncio) {
    return {
      title: "Imóvel não encontrado",
      // Página sem conteúdo não deve entrar no índice: ela gastaria a cota de
      // rastreio e apareceria vazia para quem clicasse.
      robots: { index: false, follow: true },
    };
  }

  const onde = [anuncio.neighborhood, anuncio.city, anuncio.state]
    .filter(Boolean)
    .join(", ");

  const titulo = onde ? `${anuncio.title} — ${onde}` : anuncio.title;

  const descricao =
    anuncio.description?.trim() ||
    `${anuncio.title} em ${onde || "João Pessoa"}. Veja fotos, endereço e detalhes no ${SITE.nome}.`;

  return {
    title: titulo,
    description: descricao.slice(0, 200),
    alternates: { canonical: `/anuncie/detail/${id}` },
    openGraph: {
      type: "article",
      title: titulo,
      description: descricao.slice(0, 200),
      url: `/anuncie/detail/${id}`,
      // A foto do imóvel é o que faz alguém clicar num link compartilhado.
      images: anuncio.image ? [{ url: absoluta(anuncio.image) }] : undefined,
    },
  };
}

/** Endereço externo continua absoluto; caminho de imagem enviada ganha o host. */
function absoluta(image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

  return `${api.replace(/\/api\/v1\/?$/, "")}${image}`;
}

async function buscar(id: string) {
  const api =
    process.env.ATTUS_API_INTERNA ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8080/api/v1";

  try {
    const resposta = await fetch(`${api}/announcements/${id}`, {
      next: { revalidate: 300 },
    });

    if (!resposta.ok) return null;

    return (await resposta.json()) as {
      title: string;
      description?: string | null;
      city?: string | null;
      neighborhood?: string | null;
      state?: string | null;
      image?: string | null;
    };
  } catch {
    // API fora do ar não derruba a página: ela renderiza, só sem o título
    // próprio.
    return null;
  }
}

export default function DetalheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
