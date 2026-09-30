import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel",
  description:
    "Publique seu imóvel em João Pessoa. Imobiliária passa por conferência de CRECI antes de anunciar; quem vende o próprio imóvel também pode publicar.",
  alternates: { canonical: "/anuncie" },
};

export default function AnuncieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
