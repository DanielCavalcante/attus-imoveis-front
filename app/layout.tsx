import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Menu } from "./components/menu";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth-context";
import { QueryProvider } from "./providers/query-provider";
import { Footer } from "./components/footer";
import { SITE } from "./lib/site";
import { DadosEstruturados } from "./components/dados-estruturados";

/**
 * Bricolage Grotesque no display, Archivo no texto.
 *
 * As duas entram como CSS variable e sao consumidas por --font-display e
 * --font-body em globals.css. Antes daqui o layout interpolava `${inter}`, que
 * serializa o objeto da fonte em vez da classe: nenhuma das duas familias
 * chegava ao documento e tudo renderizava na fonte do sistema.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/**
 * O que o buscador e as redes sociais leem.
 *
 * `metadataBase` não é enfeite: sem ele o Next não consegue montar os
 * endereços absolutos que Open Graph e canonical exigem, e o compartilhamento
 * sai sem imagem.
 *
 * O `template` do título faz cada tela dizer do que ela trata antes de dizer
 * o nome do site — "Imóveis em João Pessoa | Encontrei" ganha da repetição de
 * "Encontrei" em toda aba aberta.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} — imóveis em João Pessoa e na Paraíba`,
    template: `%s | ${SITE.nome}`,
  },
  description: SITE.descricao,
  applicationName: SITE.nome,
  // Só o que o produto realmente faz: palavra-chave inventada não traz
  // ninguém e gasta a confiança de quem chega.
  keywords: [
    "imóveis João Pessoa",
    "apartamentos João Pessoa",
    "casas à venda Paraíba",
    "aluguel João Pessoa",
    "imobiliária com CRECI",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.nome,
    title: `${SITE.nome} — imóveis em João Pessoa e na Paraíba`,
    description: SITE.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.nome} — imóveis em João Pessoa e na Paraíba`,
    description: SITE.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/**
 * A cor da barra do navegador no celular.
 *
 * Fora de `metadata` porque o Next 16 pede `viewport` separado; deixá-la lá
 * dentro só produz um aviso e nenhuma cor.
 */
export const viewport: Viewport = {
  themeColor: "#0c1220",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${bricolage.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background">
        <DadosEstruturados />

        <QueryProvider>
          <AuthProvider>
            <Menu />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors closeButton theme="dark" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
