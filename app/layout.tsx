import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Menu } from "./components/menu";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth-context";
import { QueryProvider } from "./providers/query-provider";
import { Footer } from "./components/footer";

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

export const metadata: Metadata = {
  title: "Encontrei",
  description:
    "Imóveis anunciados por imobiliária verificada ou por quem vende o próprio imóvel, em João Pessoa e na Paraíba.",
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
