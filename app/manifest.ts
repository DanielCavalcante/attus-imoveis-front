import type { MetadataRoute } from "next";

import { SITE } from "./lib/site";

/**
 * O manifesto, para quem instala o site como aplicativo.
 *
 * As cores são as do produto: a barra do sistema continua a mesma do site, em
 * vez do branco padrão que cortaria a tela ao meio.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.nome} — imóveis na Paraíba`,
    short_name: SITE.nome,
    description: SITE.descricao,
    start_url: "/",
    display: "standalone",
    background_color: "#0c1220",
    theme_color: "#0c1220",
    lang: "pt-BR",
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icone-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
