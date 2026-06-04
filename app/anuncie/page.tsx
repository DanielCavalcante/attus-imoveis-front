"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAnnouncement } from "@/app/hooks/use-create-announcement";
import {
  announcementSchema,
  AnnouncementFormData,
} from "../schemas/announcement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PrivateRoute } from "../components/private-route";
import { ImagePlus, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAnnouncementPage() {
  const createAnnouncementMutation = useCreateAnnouncement();
  const router = useRouter();

  const [gallery] = useState([
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
  });

  async function onSubmit(data: AnnouncementFormData) {
    try {
      await createAnnouncementMutation.mutateAsync(data);

      toast.success("Anúncio criado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Erro ao criar anúncio");
    }
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-zinc-100 p-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Criar anúncio
              </h1>

              <p className="text-muted-foreground">
                Preencha as informações do imóvel.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-6 lg:grid-cols-3"
            >
              <div className="space-y-6 lg:col-span-2">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Informações principais</CardTitle>
                    <CardDescription>
                      Dados principais do imóvel.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label>Título do anúncio</Label>
                      <Input
                        {...register("title")}
                        placeholder="Casa moderna com piscina"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        {...register("description")}
                        rows={6}
                        placeholder="Linda casa moderna localizada em condomínio fechado."
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tipo do imóvel</Label>

                        <Select
                          defaultValue="HOUSE"
                          onValueChange={(value) =>
                            setValue(
                              "propertyType",
                              value as AnnouncementFormData["propertyType"],
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="HOUSE">Casa</SelectItem>
                            <SelectItem value="APARTMENT">
                              Apartamento
                            </SelectItem>
                            <SelectItem value="CONDOMINIUM">
                              Condomínio
                            </SelectItem>
                            <SelectItem value="LAND">Terreno</SelectItem>
                          </SelectContent>
                        </Select>

                        {errors.propertyType && (
                          <p className="text-sm text-red-500">
                            {errors.propertyType.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Finalidade</Label>

                        <Select
                          defaultValue="SALE"
                          onValueChange={(value) =>
                            setValue(
                              "reason",
                              value as AnnouncementFormData["reason"],
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="SALE">Venda</SelectItem>
                            <SelectItem value="RENT">Aluguel</SelectItem>
                          </SelectContent>
                        </Select>

                        {errors.reason && (
                          <p className="text-sm text-red-500">
                            {errors.reason.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Quartos</Label>
                        <Input
                          {...register("rooms", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          placeholder="2"
                        />

                        {errors.rooms && (
                          <p className="text-sm text-red-500">
                            {errors.rooms.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Banheiros</Label>
                        <Input
                          {...register("bathRooms", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          placeholder="2"
                        />

                        {errors.bathRooms && (
                          <p className="text-sm text-red-500">
                            {errors.bathRooms.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Área</Label>
                        <Input
                          {...register("area", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          placeholder="60"
                        />

                        {errors.area && (
                          <p className="text-sm text-red-500">
                            {errors.area.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Preço</Label>
                        <Input
                          {...register("price", {
                            valueAsNumber: true,
                          })}
                          step="0.01"
                          type="number"
                          placeholder="1.200,000"
                        />

                        {errors.price && (
                          <p className="text-sm text-red-500">
                            {errors.price.message}
                          </p>
                        )}
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
                        <Input {...register("cep")} placeholder="01010-000" />

                        {errors.cep && (
                          <p className="text-sm text-red-500">
                            {errors.cep.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Rua</Label>
                        <Input
                          {...register("street")}
                          placeholder="Rua das Palmeiras"
                        />

                        {errors.street && (
                          <p className="text-sm text-red-500">
                            {errors.street.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Número</Label>
                        <Input
                          {...register("streetNumber", {
                            valueAsNumber: true,
                          })}
                          placeholder="120"
                        />

                        {errors.streetNumber && (
                          <p className="text-sm text-red-500">
                            {errors.streetNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input
                          {...register("city")}
                          placeholder="João Pessoa"
                        />

                        {errors.city && (
                          <p className="text-sm text-red-500">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Estado</Label>
                        <Input {...register("state")} placeholder="PB" />

                        {errors.state && (
                          <p className="text-sm text-red-500">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Complemento</Label>
                        <Input
                          {...register("complement")}
                          placeholder="Apartamento 203"
                        />
                        {errors.complement && (
                          <p className="text-sm text-red-500">
                            {errors.complement.message}
                          </p>
                        )}
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
                    <div className="space-y-2">
                      <Label>Link da imagem</Label>
                      <Input
                        {...register("image")}
                        placeholder="Insira o link da imagem aqui"
                      />

                      {errors.image && (
                        <p className="text-sm text-red-500">
                          {errors.image.message}
                        </p>
                      )}
                    </div>
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
                        <span className="text-sm font-medium">
                          Adicionar imagem
                        </span>
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
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 rounded-2xl"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? "Criando anúncio..." : "Criar anúncio"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
