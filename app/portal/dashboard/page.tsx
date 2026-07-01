"use client";

import { useMyAnnouncements } from "@/app/hooks/use-my-announcements";
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrivateRoute } from "@/components/private-route";

export default function DashboardPage() {
  const { data, isLoading } = useMyAnnouncements();
  const router = useRouter();

  if (isLoading) {
    return <p>Carregando imóveis...</p>;
  }

  const goToDetail = (id: number) => {
    router.push(`/anuncie/detail/${id}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
      <PrivateRoute>
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        {!data?.length && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>

            <h1 className="mt-8 text-3xl font-bold">
              Seu portfólio está vazio
            </h1>

            <p className="mt-3 max-w-lg text-center text-muted-foreground">
              Você ainda não cadastrou nenhum imóvel. Crie seu primeiro anúncio
              e comece a receber contatos de interessados.
            </p>

            <Button asChild className="mt-8 " size="lg">
              <Link href="/anuncie">Criar anúncio</Link>
            </Button>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
              <div>✓ Publique gratuitamente</div>
              <div>✓ Fotos ilimitadas</div>
              <div>✓ Gerencie seus imóveis em um único lugar</div>
              <div>✓ Receba contatos de interessados</div>
            </div>
          </div>
        )}

        {data?.length && (
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Meus anúncios
              </h1>

              <p className="text-muted-foreground">
                Veja sua lista de anúncios
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                placeholder="Buscar imóvel..."
                className="h-10 rounded-md border bg-background px-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />

              <select className="h-10 rounded-md border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Mais recentes</option>
                <option>Maior preço</option>
                <option>Menor preço</option>
              </select>
            </div>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {item.reason == "RENT" ? "Alugar" : "Vender"}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-1 text-xl font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-sm text-muted-foreground">{item.city}</p>
                </div>

                <div>
                  <span className="text-2xl font-bold">{formatCurrency(item.price)}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-3 text-center text-sm">
                  <div>
                    <p className="font-semibold">{item.rooms}</p>

                    <span className="text-muted-foreground">Quartos</span>
                  </div>

                  <div>
                    <p className="font-semibold">{item.bathRooms}</p>

                    <span className="text-muted-foreground">Banheiros</span>
                  </div>

                  <div>
                    <p className="font-semibold">{item.area}</p>

                    <span className="text-muted-foreground">Área</span>
                  </div>
                </div>
                <Button
                  onClick={() => goToDetail(item.id)}
                  className="w-full"
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      </PrivateRoute>
  );
}
