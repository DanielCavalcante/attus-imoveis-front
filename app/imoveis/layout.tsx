import type { Metadata } from "next";

/**
 * A listagem tem título próprio.
 *
 * A página é componente de cliente e não pode exportar `metadata` ela mesma;
 * o layout é onde isso cabe. Sem ele, toda tela do site chegaria ao buscador
 * com o mesmo título, e a listagem — que é a página que alguém procura ao
 * buscar por imóvel — não diria do que trata.
 */
export const metadata: Metadata = {
  title: "Imóveis em João Pessoa",
  description:
    "Apartamentos, casas, condomínios e terrenos em João Pessoa e na Paraíba. Filtre por bairro, faixa de preço e tipo de imóvel.",
  alternates: { canonical: "/imoveis" },
  openGraph: {
    title: "Imóveis em João Pessoa | Encontrei",
    description:
      "Apartamentos, casas, condomínios e terrenos em João Pessoa e na Paraíba.",
    url: "/imoveis",
  },
};

export default function ImoveisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
