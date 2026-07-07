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
    <header className="px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logotipo.png"
              alt="Encontrei"
              width={320}
              height={60}
              priority
              className="w-auto h-11"
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
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/imoveis"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Imóveis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/anuncie"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
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
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition border rounded-md hover:bg-muted">
              <LogIn className="w-4 h-4" />
              Entrar
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}