"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Building2, LogIn, Megaphone, Briefcase, ShieldCheck } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "../contexts/auth-context";
import { UserMenu } from "./user-menu";

export function Menu() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-4">
      {/*
        flex-wrap + a nav em linha própria no mobile: logo, navegação e menu do
        usuário somavam 555px num viewport de 375 e o mx-auto centralizava o
        excesso, cortando o logo e criando scroll horizontal.
      */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logotipo.png"
              alt="Encontrei"
              width={320}
              height={60}
              priority
              className="h-9 w-auto sm:h-11"
            />
          </Link>
        </div>

        <NavigationMenu className="order-last w-full max-w-none justify-start sm:order-none sm:w-auto">
          <NavigationMenuList className="flex w-full gap-1 overflow-x-auto sm:w-auto sm:gap-2">
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:px-4"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/imoveis"
                  className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:px-4"
                >
                  <Building2 className="h-4 w-4" />
                  Imóveis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/anuncie"
                    className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:px-4"
                  >
                    <Megaphone className="h-4 w-4" />
                    Anuncie
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {user?.accountType === "PJ" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/portal/empresa"
                    className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:px-4"
                  >
                    <Briefcase className="h-4 w-4" />
                    Empresa
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {user?.role === "INTERNO" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/portal/backoffice"
                    className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:px-4"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Painel
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {user ? (
          <div className="flex items-center gap-2">
            <UserMenu />
          </div>
        ) : (
          <Link href="/portal/auth/login" className="nav-link">
            <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted">
              <LogIn className="h-4 w-4" />
              Entrar
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
