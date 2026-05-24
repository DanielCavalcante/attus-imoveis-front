"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "../contexts/auth-context";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { UserMenu } from "./user-menu";

export function Menu() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    queryClient.clear();
    router.push("/portal/auth/login");
  }

  return (
    <header className="border-b bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />

          <span className="text-lg font-bold">Imobiliária</span>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
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

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/portal"
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Imóveis
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
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
