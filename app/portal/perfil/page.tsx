"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "@/app/hooks/use-update-user";
import { ProfileFormData, profileSchema } from "@/app/schemas/profile";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/auth-context";
import { useEffect } from "react";
import { PrivateRoute } from "@/app/components/private-route";

export default function ProfilePage() {
  const { user, updateUserSession } = useAuth();
  const updateUserMutation = useUpdateUser();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  async function onSubmit(data: ProfileFormData) {
    if (!user?.id) return;
    try {
      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        data,
      });
      updateUserSession(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Erro ao atualizar perfil");
    }
  }

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      });
    }
  }, [user, reset]);

  return (
    <PrivateRoute>
      <div className="container mx-auto flex justify-center py-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>

            <CardDescription>
              Atualize suas informações pessoais.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-28 w-28 border">
                    <AvatarImage src={watch("photo")} />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="photo"
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-background shadow-sm transition hover:bg-muted"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="photo">URL da Foto</Label>

                  <Input
                    id="photo"
                    placeholder="https://..."
                    {...register("photo")}
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nome completo</Label>

                  <Input
                    id="fullname"
                    placeholder="Seu nome"
                    {...register("fullname")}
                  />

                  {errors.fullname && (
                    <p className="text-sm text-red-500">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>

                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...register("phone")}
                />

                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
}
