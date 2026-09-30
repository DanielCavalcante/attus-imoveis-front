import type { NextConfig } from "next";

/**
 * Em produção, sem o endereço público, o build para aqui.
 *
 * A alternativa silenciosa é pior: o build embute o padrão de desenvolvimento
 * e o site anuncia ao buscador, em canonical, Open Graph e sitemap, que mora
 * em `localhost` -- ou seja, na máquina de quem fez o deploy.
 */
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL é obrigatório no build de produção: sem ele o site " +
      "anuncia endereços de desenvolvimento ao buscador.",
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
