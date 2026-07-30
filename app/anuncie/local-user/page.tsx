"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Plus, Loader2 } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  neighborhood: string;
  rooms: number;
  area: number;
  transactionType: "sell" | "rent";
  completionPercentage: number;
  missingStep: string | null;
  lastEditedAt: string;
}

export default function Dashboard() {
 
  const userName = "User";

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        
        const data: Listing[] = [];
        setListings(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen flex flex-row font-sans bg-brand-white">
      <aside className="w-[400px] bg-slate-950 p-12 text-brand-white flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div className="w-20 h-20 bg-transparent flex items-center justify-center rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/logotipo-icon.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight max-w-sm">
            Olá {userName}, <br />
            continue de onde parou.
          </h1>
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <button className="flex items-center gap-2 hover:text-brand-white transition-colors">
            Precisa de ajuda?
          </button>
          <span>© 2026 Encontrei</span>
        </div>
      </aside>

      <main className="flex-1 p-16">
        <header className="flex justify-end mb-12">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 border-slate-700"
          >
            <Link href="/anuncie">Sair</Link>
          </Button>
        </header>

        <div className="max-w-3xl mx-auto space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {!isLoading && listings.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              Você ainda não tem nenhum anúncio. Comece criando o primeiro!
            </p>
          )}

          {!isLoading &&
            listings.map((listing) => (
              <div
                key={listing.id}
                className="border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    {listing.title}, {listing.neighborhood}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {listing.rooms} quartos · {listing.area} m² ·{" "}
                    {listing.transactionType === "rent" ? "Aluguel" : "Venda"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Editado {listing.lastEditedAt} · {listing.completionPercentage}%
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {listing.missingStep && (
                    <div className="flex justify-between text-sm font-medium">
                      <span>Faltam: {listing.missingStep}</span>
                    </div>
                  )}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${listing.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button className="p-2 text-slate-400 hover:text-brand transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <Link
                    href="/anuncie/register-info"
                    className="p-2 text-brand hover:text-brand-dark transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}

          <Button
            variant="outline"
            className="w-full h-14 border-2 border-dashed border-brand-light text-brand-light hover:bg-brand hover:text-brand-white rounded-xl font-medium"
          >
            <Plus className="w-5 h-5 mr-2" /> Novo anúncio
          </Button>
        </div>
      </main>
    </div>
  );
}