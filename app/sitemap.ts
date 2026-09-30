import type { MetadataRoute } from "next";

import { SITE } from "./lib/site";

/**
 * O mapa do site, com os anúncios dentro.
 *
 * As páginas fixas seriam pouco: o que um portal de imóveis tem a oferecer ao
 * buscador são os anúncios, um por endereço. Por isso o acervo entra aqui.
 *
 * A API pode estar fora quando isto roda. Falha de terceiro não pode derrubar
 * o sitemap inteiro: sem as páginas fixas, o site sai do índice por um motivo
 * que nada tem a ver com ele.
 */
/**
 * Gerado a cada pedido, e nao no build.
 *
 * O build roda dentro do Docker, sem a API de pe: o mapa saia com as tres
 * paginas fixas e NENHUM anuncio, que e justamente o que ele existe para
 * oferecer. O custo fica com o `revalidate` da busca abaixo, nao com o
 * rastreador.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixas: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/imoveis`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/anuncie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...fixas, ...(await anuncios())];
}

async function anuncios(): Promise<MetadataRoute.Sitemap> {
  /**
   * O endereço da API visto DE DENTRO do servidor, que não é o do navegador.
   *
   * `NEXT_PUBLIC_API_URL` aponta para onde o navegador alcança a API. Este
   * código roda no servidor, e em contêiner `localhost` é o próprio contêiner
   * do web -- a busca falhava em silêncio e o sitemap saía sem nenhum anúncio,
   * que é justamente o que ele tem de oferecer.
   */
  const api =
    process.env.ATTUS_API_INTERNA ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8080/api/v1";

  try {
    const resposta = await fetch(`${api}/announcements?size=200`, {
      // Uma hora: acervo novo entra no mapa sem uma ida ao servidor por
      // rastreio, e sem esperar um novo deploy.
      next: { revalidate: 3600 },
    });

    if (!resposta.ok) return [];

    const pagina = (await resposta.json()) as {
      content?: { id: number }[];
    };

    return (pagina.content ?? []).map((anuncio) => ({
      url: `${SITE.url}/anuncie/detail/${anuncio.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // O acervo não entra no mapa desta vez; as páginas fixas continuam.
    return [];
  }
}
