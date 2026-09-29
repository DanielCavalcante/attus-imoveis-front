"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  LogIn,
  Megaphone,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "../contexts/auth-context";
import { UserMenu } from "./user-menu";

const ITEM =
  "flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground sm:px-4";

export function Menu() {
  const { user } = useAuth();

  return (
    <header className="bg-background">
      {/*
        flex-wrap + a nav em linha própria no mobile: logo, navegação e menu do
        usuário somavam 555px num viewport de 375 e o mx-auto centralizava o
        excesso, cortando o logo e criando scroll horizontal.
      */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-3">
          {/*
            Marca como texto, não como raster: o logotipo.png é escuro sobre
            fundo claro e desaparece neste chão. O gate liberou nome e logotipo.
          */}
          <span className="font-display text-2xl font-bold tracking-[-0.03em]">
            Encontrei
          </span>

          <span className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground">
            PARAÍBA
          </span>
        </Link>

        <NavigationMenu className="order-last w-full max-w-none justify-start sm:order-none sm:w-auto">
          <NavigationMenuList className="flex w-full gap-1 overflow-x-auto sm:w-auto sm:gap-2">
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/portal/dashboard" className={ITEM}>
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/imoveis" className={ITEM}>
                  <Building2 className="h-4 w-4" aria-hidden />
                  Imóveis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/anuncie" className={ITEM}>
                    <Megaphone className="h-4 w-4" aria-hidden />
                    Anuncie
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {user?.accountType === "PJ" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/portal/empresa" className={ITEM}>
                    <Briefcase className="h-4 w-4" aria-hidden />
                    Empresa
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {user?.role === "INTERNO" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/portal/backoffice" className={ITEM}>
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    Painel
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {user ? (
          <UserMenu />
        ) : (
          /*
            Sem âmbar aqui de propósito: a cor marca UMA ação comprometida por
            vista, e nas telas públicas essa ação é buscar ou anunciar.
          */
          <Link
            href="/portal/auth/login"
            className="flex min-h-11 items-center gap-2 border border-border px-4 text-sm font-medium transition-colors hover:border-foreground/40 hover:bg-card"
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
