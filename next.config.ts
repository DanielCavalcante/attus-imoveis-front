import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { NextConfig } from "next";

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

/**
 * Em produção, sem o endereço público, o build para aqui.
 *
 * A alternativa silenciosa é pior: o build embute o padrão de desenvolvimento
 * e o site anuncia ao buscador, em canonical, Open Graph e sitemap, que mora
 * em `localhost` -- ou seja, na máquina de quem fez o deploy.
 *
 * A guarda vale **só na fase de build**, e isso não é detalhe: este arquivo é
 * lido de novo quando o `next start` sobe, e `NEXT_PUBLIC_*` não existe mais lá
 * -- é embutido no bundle e sai do ambiente. Sem a distinção de fase, a guarda
 * que protege o build derruba o contêiner que o build produziu, e foi isso que
 * fez o primeiro deploy no Cloud Run reprovar a sonda de partida.
 */
export default function configuracao(fase: string): NextConfig {
  const construindo =
    fase === PHASE_PRODUCTION_BUILD && process.env.NODE_ENV === "production";

  if (construindo && !process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL é obrigatório no build de produção: sem ele o site " +
        "anuncia endereços de desenvolvimento ao buscador.",
    );
  }

  return nextConfig;
}
