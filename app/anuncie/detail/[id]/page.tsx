"use client";

import { Bath, BedDouble, Building2, MapPin, Maximize, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnouncementDetail } from "@/app/hooks/use-detail-announcement";
import {
  formatArea,
  formatPrice,
  hasRooms,
  initials,
  propertyTypeLabel,
  reasonLabel,
} from "@/app/lib/property";

/**
 * O backend ainda nao expoe o dono no AnnouncementDetailDTO; ate la o bloco do
 * anunciante e placeholder. As iniciais saem do proprio nome para nao divergirem.
 */
const ADVERTISER_PLACEHOLDER = "Daniel Cavalcante";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading, error } = useAnnouncementDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto space-y-6 px-4 py-8" aria-busy="true">
          <div className="h-9 w-72 animate-pulse rounded bg-muted" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="aspect-[16/10] animate-pulse rounded-3xl bg-muted" />

              <div className="h-64 animate-pulse rounded-3xl bg-muted" />
            </div>

            <div className="h-72 animate-pulse rounded-3xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Anúncio não encontrado</h1>

        <p className="mt-3 max-w-md text-muted-foreground">
          O imóvel que você procura pode ter sido removido, ou o link está
          incorreto.
        </p>

        <Button asChild className="mt-8">
          <Link href="/imoveis">Ver imóveis disponíveis</Link>
        </Button>
      </div>
    );
  }

  const showRooms = hasRooms(data.propertyType);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 pb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detalhes do anúncio
            </h1>

            <p className="text-muted-foreground">
              Visualização completa do imóvel.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="overflow-hidden rounded-3xl border-0 p-0 shadow-sm">
                <img
                  src={data.image}
                  alt={`Foto de ${data.title}`}
                  className="aspect-[16/10] w-full object-cover"
                />
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="space-y-8 p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4">
                      <Badge className="rounded-full px-4 py-1 text-sm">
                        {reasonLabel(data.reason)}
                      </Badge>

                      <div>
                        <h2 className="text-3xl font-bold">{data.title}</h2>

                        <div className="mt-2 flex items-start gap-2 text-muted-foreground">
                          <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />

                          <span>
                            {data.street}, {data.streetNumber} - {data.city}/
                            {data.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-3xl font-bold whitespace-nowrap">
                      {formatPrice(data.price, data.reason)}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {showRooms && (
                      <>
                        <InfoCard
                          icon={<BedDouble className="h-5 w-5" aria-hidden />}
                          label="Quartos"
                          value={data.rooms}
                        />

                        <InfoCard
                          icon={<Bath className="h-5 w-5" aria-hidden />}
                          label="Banheiros"
                          value={data.bathRooms}
                        />
                      </>
                    )}

                    <InfoCard
                      icon={<Maximize className="h-5 w-5" aria-hidden />}
                      label="Área"
                      value={formatArea(data.area)}
                    />

                    <InfoCard
                      icon={<Building2 className="h-5 w-5" aria-hidden />}
                      label="Tipo"
                      value={propertyTypeLabel(data.propertyType)}
                    />
                  </div>

                  {/*
                    flex-col explicito: o Tabs gerado usa data-horizontal:flex-col,
                    mas o componente seta data-orientation. O seletor nao casa e a
                    lista de abas ficava ao lado do conteudo.
                  */}
                  <Tabs defaultValue="description" className="flex-col">
                    <TabsList className="rounded-2xl">
                      <TabsTrigger value="description">Descrição</TabsTrigger>

                      <TabsTrigger value="location">Localização</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                      <p className="max-w-[70ch] leading-8 text-muted-foreground">
                        {data.description || "Este anúncio não tem descrição."}
                      </p>
                    </TabsContent>

                    <TabsContent value="location" className="mt-6">
                      <div className="rounded-2xl bg-muted p-5">
                        <p className="text-muted-foreground">
                          {data.street}, {data.streetNumber}
                          {data.complement ? ` - ${data.complement}` : ""}
                          <br />
                          {data.city} - {data.state}
                          <br />
                          CEP {data.cep}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24 rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Anunciante</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage alt="" />

                      <AvatarFallback>
                        {initials(ADVERTISER_PLACEHOLDER)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">{ADVERTISER_PLACEHOLDER}</h3>

                      <p className="text-sm text-muted-foreground">
                        Proprietário
                      </p>
                    </div>
                  </div>

                  <Button className="w-full gap-2 rounded-2xl">
                    <Phone className="h-4 w-4" aria-hidden />
                    Entrar em contato
                  </Button>

                  <Button variant="outline" className="w-full rounded-2xl">
                    WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-xl bg-muted p-3">{icon}</div>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>

          <strong className="block truncate">{value}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
