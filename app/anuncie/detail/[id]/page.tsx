"use client";

import {
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Maximize,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnouncementDetail } from "@/app/hooks/use-detail-announcement";
import { useParams } from "next/navigation";

export default function dataDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading, error } = useAnnouncementDetail(id);

  if (isLoading) return <p>Carregando...</p>;
  console.log(error);
  if (error) return <p>Erro ao carregar anúncio.</p>;

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
              <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
                <img
                  src={data?.image}
                  alt={data?.title}
                  className="h-[450px] w-full object-cover"
                />
              </Card>

              {/* <div className="grid gap-4 md:grid-cols-3">
                {data?.gallery.map((image, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden rounded-2xl border-0 shadow-sm"
                  >
                    <img
                      src={image}
                      alt="Galeria"
                      className="h-40 w-full object-cover"
                    />
                  </Card>
                ))}
              </div> */}

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="space-y-8 p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4">
                      <Badge className="rounded-full px-4 py-1 text-sm">
                        {data?.reason}
                      </Badge>

                      <div>
                        <h2 className="text-3xl font-bold">{data?.title}</h2>

                        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />

                          <span>
                            {data?.street}, {data?.streetNumber} - {data?.city}/
                            {data?.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold">{data?.price}</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <InfoCard
                      icon={<BedDouble className="h-5 w-5" />}
                      label="Quartos"
                      value={data?.rooms}
                    />

                    <InfoCard
                      icon={<Bath className="h-5 w-5" />}
                      label="Banheiros"
                      value={data?.bathRooms}
                    />

                    <InfoCard
                      icon={<Maximize className="h-5 w-5" />}
                      label="Área"
                      value={`${data?.area}m²`}
                    />

                    <InfoCard
                      icon={<Building2 className="h-5 w-5" />}
                      label="Tipo"
                      value={data?.propertyType}
                    />
                  </div>

                  <Tabs defaultValue="description">
                    <TabsList className="rounded-2xl">
                      <TabsTrigger value="description">Descrição</TabsTrigger>

                      <TabsTrigger value="location">Localização</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                      <p className="leading-8 text-muted-foreground">
                        {data?.description}
                      </p>
                    </TabsContent>

                    <TabsContent value="location" className="mt-6">
                      <div className="rounded-2xl bg-muted p-5">
                        <p className="text-muted-foreground">
                          {data?.street}, {data?.streetNumber}
                          <br />
                          {data?.city} - {data?.state}
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
                      <AvatarImage src={""} />
                      <AvatarFallback>DC</AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">{"Daniel Cavalcante"}</h3>

                      <p className="text-sm text-muted-foreground">
                        Proprietário
                      </p>
                    </div>
                  </div>

                  <Button className="w-full gap-2 rounded-2xl">
                    <Phone className="h-4 w-4" />
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
        <div className="rounded-xl bg-zinc-100 p-3">{icon}</div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <strong>{value}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
