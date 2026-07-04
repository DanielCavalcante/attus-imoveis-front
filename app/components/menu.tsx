"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Building2, LogIn, Megaphone } from "lucide-react";
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
    <header className="border-b bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logotipo.png"
              alt="Encontrei"
              width={320}
              height={60}
              priority
              className="h-11 w-auto"
            />
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
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
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Imóveis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/anuncie"
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Megaphone className="mr-2 h-4 w-4" />
                    Anúncie
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
