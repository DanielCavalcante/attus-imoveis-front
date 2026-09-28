"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import { useMyAnnouncements } from "@/app/hooks/use-my-announcements";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/app/components/private-route";
import { AnnouncementGrid } from "@/app/components/announcement-grid";

export default function DashboardPage() {
  const { data, isLoading } = useMyAnnouncements();

  const anuncios = data?.content ?? [];

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          {anuncios.length > 0 && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Meus anúncios
              </h1>

              <p className="text-muted-foreground">
                {data?.totalElements} publicado
                {data?.totalElements === 1 ? "" : "s"}.
              </p>
            </div>
          )}

          <AnnouncementGrid
            announcements={anuncios}
            isLoading={isLoading}
            emptyState={
              <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Home className="h-12 w-12 text-muted-foreground" aria-hidden />
                </div>

                <h1 className="mt-8 text-3xl font-bold">
                  Seu portfólio está vazio
                </h1>

                <p className="mt-3 max-w-lg text-center text-muted-foreground">
                  Você ainda não cadastrou nenhum imóvel. Crie seu primeiro
                  anúncio e comece a receber contatos de interessados.
                </p>

                <Button asChild className="mt-8" size="lg">
                  <Link href="/anuncie">Criar anúncio</Link>
                </Button>

                <ul className="mt-8 grid gap-3 text-sm text-muted-foreground">
                  <li>Publique gratuitamente</li>
                  <li>Fotos ilimitadas</li>
                  <li>Gerencie seus imóveis em um único lugar</li>
                  <li>Receba contatos de interessados</li>
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </PrivateRoute>
  );
}
