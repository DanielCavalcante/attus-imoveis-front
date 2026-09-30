import type { MetadataRoute } from "next";

import { SITE } from "./lib/site";

/**
 * O que o buscador pode indexar.
 *
 * `/portal` fica de fora inteiro: são telas de sessão — painel, cadastro da
 * empresa, backoffice — que exigem login e não têm conteúdo para quem busca.
 * Indexá-las gastaria a cota de rastreio do site em páginas que devolvem
 * redirecionamento para o login.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal/", "/anuncie/edit/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
