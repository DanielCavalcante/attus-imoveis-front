import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Menu } from "./components/menu";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth-context";
import { QueryProvider } from "./providers/query-provider";
import { Footer } from "./components/footer";

const inter = Inter({
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Encontrei",
  description: "Encontrei - melhor site de anúncios de imóveis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter} ${plusJakarta} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Menu />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
