"use client";

import { useState } from "react";

import { ImagePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function RealEstatePages() {
  const router = useRouter();

  const goToDetail = (id: number) => {
    router.push(`/anuncie/detail/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-7xl space-y-12">
        <AnnouncementEditPage />

        <Separator />
      </div>
    </div>
  );
}

function AnnouncementEditPage() {
  const [gallery] = useState([
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar anúncio</h1>

        <p className="text-muted-foreground">
          Atualize as informações do imóvel.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Informações principais</CardTitle>
              <CardDescription>Dados principais do imóvel.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Título do anúncio</Label>
                <Input defaultValue="Casa moderna com piscina" />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  rows={6}
                  defaultValue="Linda casa moderna localizada em condomínio fechado."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo do imóvel</Label>

                  <Select defaultValue="HOUSE">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="HOUSE">Casa</SelectItem>
                      <SelectItem value="APARTMENT">Apartamento</SelectItem>
                      <SelectItem value="CONDOMINIUM">Condomínio</SelectItem>
                      <SelectItem value="LAND">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Finalidade</Label>

                  <Select defaultValue="SALE">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="SALE">Venda</SelectItem>
                      <SelectItem value="RENT">Aluguel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Quartos</Label>
                  <Input type="number" defaultValue={3} />
                </div>

                <div className="space-y-2">
                  <Label>Banheiros</Label>
                  <Input type="number" defaultValue={2} />
                </div>

                <div className="space-y-2">
                  <Label>Área</Label>
                  <Input type="number" defaultValue={180} />
                </div>

                <div className="space-y-2">
                  <Label>Preço</Label>
                  <Input type="number" defaultValue={850000} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input defaultValue="01010-000" />
                </div>

                <div className="space-y-2">
                  <Label>Rua</Label>
                  <Input defaultValue="Rua das Palmeiras" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input defaultValue={120} />
                </div>

                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input defaultValue="São Paulo" />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input defaultValue="SP" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input defaultValue="Apartamento 203" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
              <CardDescription>
                Faça upload das fotos do imóvel.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {gallery.map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border"
                  >
                    <img
                      src={image}
                      alt="Imóvel"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ))}

                <button className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted transition hover:bg-zinc-200">
                  <ImagePlus className="mb-2 h-8 w-8" />
                  <span className="text-sm font-medium">Adicionar imagem</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button className="w-full gap-2 rounded-2xl">
                <Save className="h-4 w-4" />
                Salvar alterações
              </Button>

              <Button variant="outline" className="w-full rounded-2xl">
                Visualizar anúncio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
