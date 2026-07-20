import { AnuncioFormProvider } from "./_context/anuncio-form-context";

export default function AnuncieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnuncioFormProvider>{children}</AnuncioFormProvider>;
}