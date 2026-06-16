"use client";

import { Button } from "@/components/ui/button";
import { useAnnouncements } from "../hooks/use-announcements";
import { useRouter } from "next/navigation";

export default function PropertiesPage() {
  const { data, isLoading } = useAnnouncements();
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
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Anúncios de Imóveis
            </h1>

            <p className="text-muted-foreground">
              Explore os imóveis disponíveis na plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-+3 sm:flex-row">
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
  );
}
