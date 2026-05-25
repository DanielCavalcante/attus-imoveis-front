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

export default function CreateAnnouncementPage() {
  const createAnnouncementMutation = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),

    defaultValues: {
      propertyType: "HOUSE",
      reason: "SALE",
    },
  });

  async function onSubmit(data: AnnouncementFormData) {
    try {
      console.log(data);
      console.log("Xuxinha");
      await createAnnouncementMutation.mutateAsync(data);

      toast.success("Anúncio criado com sucesso!");
    } catch (error: any) {
      console.error(error);

      toast.error(error?.message || "Erro ao criar anúncio");
    }
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-muted/40 p-6">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Criar anúncio</CardTitle>

              <CardDescription>
                Preencha as informações do imóvel.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Título</Label>

                    <Input
                      id="title"
                      placeholder="Casa moderna em condomínio"
                      {...register("title")}
                    />

                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Imagem</Label>

                    <Input
                      id="description"
                      placeholder="Link da imagem do imóvel"
                      {...register("image")}
                    />

                    {errors.image && (
                      <p className="text-sm text-red-500">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>

                    <Input
                      id="city"
                      placeholder="João Pessoa"
                      {...register("city")}
                    />

                    {errors.city && (
                      <p className="text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>

                    <Input
                      id="state"
                      placeholder="Paraíba"
                      {...register("state")}
                    />

                    {errors.state && (
                      <p className="text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Rua</Label>

                    <Input
                      id="street"
                      placeholder="Rua das Flores"
                      {...register("street")}
                    />

                    {errors.street && (
                      <p className="text-sm text-red-500">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streetNumber">Número</Label>

                    <Input
                      id="streetNumber"
                      type="number"
                      placeholder="123"
                      {...register("streetNumber", {
                        valueAsNumber: true,
                      })}
                    />

                    {errors.streetNumber && (
                      <p className="text-sm text-red-500">
                        {errors.streetNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>

                    <Input
                      id="cep"
                      placeholder="58000-000"
                      {...register("cep")}
                    />

                    {errors.cep && (
                      <p className="text-sm text-red-500">
                        {errors.cep.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="complement">Complemento</Label>

                    <Input
                      id="complement"
                      placeholder="Apartamento, bloco..."
                      {...register("complement")}
                    />

                    {errors.complement && (
                      <p className="text-sm text-red-500">
                        {errors.complement.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo do imóvel</Label>

                    <Select
                      onValueChange={(value) =>
                        setValue(
                          "propertyType",
                          value as AnnouncementFormData["propertyType"],
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="HOUSE">Casa</SelectItem>
                        <SelectItem value="APARTMENT">Apartamento</SelectItem>
                        <SelectItem value="CONDOMINIUM">Condomínio</SelectItem>
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
                    <Label>Razão</Label>

                    <Select
                      onValueChange={(value) =>
                        setValue(
                          "reason",
                          value as AnnouncementFormData["reason"],
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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

                  <div className="space-y-2">
                    <Label htmlFor="rooms">Quartos</Label>

                    <Input
                      id="rooms"
                      type="number"
                      placeholder="3"
                      {...register("rooms", {
                        valueAsNumber: true,
                      })}
                    />

                    {errors.rooms && (
                      <p className="text-sm text-red-500">
                        {errors.rooms.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathRooms">Banheiros</Label>

                    <Input
                      id="bathRooms"
                      type="number"
                      placeholder="2"
                      {...register("bathRooms", {
                        valueAsNumber: true,
                      })}
                    />

                    {errors.bathRooms && (
                      <p className="text-sm text-red-500">
                        {errors.bathRooms.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área (m²)</Label>

                    <Input
                      id="area"
                      type="number"
                      placeholder="120"
                      {...register("area", {
                        valueAsNumber: true,
                      })}
                    />

                    {errors.area && (
                      <p className="text-sm text-red-500">
                        {errors.area.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço</Label>

                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="350000"
                      {...register("price", {
                        valueAsNumber: true,
                      })}
                    />

                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-black/90"
                >
                  {isSubmitting ? "Criando anúncio..." : "Criar anúncio"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PrivateRoute>
  );
}
