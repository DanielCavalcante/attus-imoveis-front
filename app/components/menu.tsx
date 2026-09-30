"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LayoutList,
  Building2,
  LogIn,
  Megaphone,
  Briefcase,
  ShieldCheck,
  Menu as Hamburguer,
  X,
} from "lucide-react";

import { useAuth } from "../contexts/auth-context";
import { UserMenu } from "./user-menu";

type Item = {
  href: string;
  rotulo: string;
  Icone: typeof Building2;
};

export function Menu() {
  const { user } = useAuth();
  const [aberto, setAberto] = useState(false);

  const itens: Item[] = [
    ...(user
      ? [
          {
            href: "/portal/dashboard",
            rotulo: "Dashboard",
            Icone: LayoutDashboard,
          },
        ]
      : []),
    { href: "/imoveis", rotulo: "Imóveis", Icone: Building2 },
    ...(user
      ? [
          {
            href: "/portal/anuncios",
            rotulo: "Meus anúncios",
            Icone: LayoutList,
          },
          { href: "/anuncie", rotulo: "Anuncie", Icone: Megaphone },
        ]
      : []),
    ...(user?.accountType === "PJ"
      ? [{ href: "/portal/empresa", rotulo: "Empresa", Icone: Briefcase }]
      : []),
    ...(user?.role === "INTERNO"
      ? [{ href: "/portal/backoffice", rotulo: "Painel", Icone: ShieldCheck }]
      : []),
  ];

  return (
    /*
      Gaveta no celular, barra no desktop.

      A barra horizontal media 467px num viewport de 390 e empurrava a página
      inteira: o `overflow-x-auto` estava na lista, mas o invólucro do
      NavigationMenu não era contido, e TODAS as telas rolavam de lado. A
      gaveta resolve isso e o alvo de toque junto — os links tinham 36px de
      altura, abaixo do piso de 44.
    */
    <header className="relative z-40 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/*
          Marca e navegacao andam juntas, encostadas a esquerda.

          Soltas como irmas diretas de um `justify-between` de tres filhos, a
          navegacao era empurrada para o centro da barra -- longe da marca, a
          que ela pertence, e longe do canto por onde a leitura comeca.
        */}
        <div className="flex items-center gap-2 lg:gap-8">
          <Link href="/" className="flex shrink-0 items-baseline gap-3 py-2">
            <span className="font-display text-2xl font-bold tracking-[-0.03em]">
              Encontrei
            </span>

            <span className="hidden text-[11px] font-medium tracking-[0.14em] text-muted-foreground sm:inline">
              PARAÍBA
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {itens.map(({ href, rotulo, Icone }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex min-h-11 items-center gap-2 whitespace-nowrap px-3 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <Icone className="h-4 w-4" aria-hidden />
                    {rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            {user ? (
              <UserMenu />
            ) : (
              <Link
                href="/portal/auth/login"
                className="flex min-h-11 items-center gap-2 border border-border px-4 text-sm font-medium transition-colors hover:border-foreground/40 hover:bg-card"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                Entrar
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAberto((estava) => !estava)}
            aria-expanded={aberto}
            aria-controls="gaveta-de-navegacao"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="flex h-12 w-12 items-center justify-center border border-border transition-colors hover:border-foreground/40 lg:hidden"
          >
            {aberto ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Hamburguer className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {aberto && (
        <nav
          id="gaveta-de-navegacao"
          aria-label="Navegação principal"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {itens.map(({ href, rotulo, Icone }) => (
              <li key={href}>
                <Link
                  href={href}
                  /* Fecha ao navegar, no próprio clique: sincronizar isso por
                     efeito sobre a rota dispara renderização em cascata. */
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center gap-3 border-b border-border text-base transition-colors hover:text-primary"
                >
                  <Icone
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden
                  />
                  {rotulo}
                </Link>
              </li>
            ))}

            <li className="py-4">
              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/portal/auth/login"
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-center gap-2 bg-primary px-6 font-medium text-primary-foreground"
                >
                  <LogIn className="h-4 w-4" aria-hidden />
                  Entrar
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
