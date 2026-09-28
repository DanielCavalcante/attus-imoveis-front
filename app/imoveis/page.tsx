"use client";

import { Building2 } from "lucide-react";

import { useAnnouncements } from "../hooks/use-announcements";
import { AnnouncementList } from "../components/announcement-list";

export default function PropertiesPage() {
  const { data, isLoading } = useAnnouncements();

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <AnnouncementList
          title="Anúncios de Imóveis"
          description="Explore os imóveis disponíveis na plataforma."
          data={data}
          isLoading={isLoading}
          emptyState={
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-12 w-12 text-muted-foreground" aria-hidden />
              </div>

              <h1 className="mt-8 text-3xl font-bold">
                Ainda não há imóveis publicados
              </h1>

              <p className="mt-3 max-w-lg text-muted-foreground">
                Assim que o primeiro anúncio for criado, ele aparece aqui.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
