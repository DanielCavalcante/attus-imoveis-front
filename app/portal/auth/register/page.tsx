"use client";
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
import Link from "next/link";
import { UserFormData, userSchema } from "@/app/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateUser } from "@/app/hooks/use-create-user";
import { toast } from "sonner";

export default function RegisterPage() {
  const createUserMutation = useCreateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  async function onSubmit(data: UserFormData) {
    try {
      await createUserMutation.mutateAsync(data);
      toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Erro ao criar conta");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>

          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullname">Nome completo</Label>

              <Input
                {...register("fullname")}
                id="fullname"
                type="text"
                placeholder="Digite seu nome completo"
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm font-semibold mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm font-semibold mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>

              <Input
                {...register("phone")}
                id="phone"
                type="tel"
                placeholder="(83) 99999-9999"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm font-semibold mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>

              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="********"
              />
              {errors.password && (
                <p className="text-red-500 text-sm font-semibold mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>

              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="********"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm font-semibold mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={createUserMutation.isPending}
              className="w-full bg-black text-white hover:bg-black/90"
            >
              {createUserMutation.isPending
                ? "Criando conta..."
                : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já possui uma conta?{" "}
              <Link
                href="/portal/auth/login"
                className="font-medium hover:underline"
              >
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
