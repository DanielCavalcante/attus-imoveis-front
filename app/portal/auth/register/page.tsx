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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateUser } from "@/app/hooks/use-create-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { accountType: "PF" },
  });

  const accountType = watch("accountType");

  async function onSubmit(data: UserFormData) {
    try {
      await createUserMutation.mutateAsync(data);
      toast.success("Conta criada com sucesso!");
      router.push("/portal/auth/login");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Erro ao criar conta";

      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex">
        <Image
          src="/register.jpg"
          alt="Imóveis"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold leading-tight">
            Crie anúncios e
            <br />
            venda de forma rápida
          </h1>

          <p className="mt-6 max-w-md text-lg text-zinc-200">
            Compre, venda ou alugue imóveis de forma simples, rápida e segura.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>

            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Tipo de conta</legend>

                <RadioGroup
                  value={accountType}
                  onValueChange={(value) =>
                    setValue("accountType", value as UserFormData["accountType"], {
                      shouldValidate: true,
                    })
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="accountType-pf"
                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-data-[state=checked]:border-primary"
                  >
                    <RadioGroupItem value="PF" id="accountType-pf" />
                    Pessoa física
                  </Label>

                  <Label
                    htmlFor="accountType-pj"
                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-data-[state=checked]:border-primary"
                  >
                    <RadioGroupItem value="PJ" id="accountType-pj" />
                    Pessoa jurídica
                  </Label>
                </RadioGroup>

                {errors.accountType && (
                  <p className="text-red-500 text-sm font-semibold mt-1">
                    {errors.accountType.message}
                  </p>
                )}
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="fullname">
                  {accountType === "PJ" ? "Nome do contato" : "Nome completo"}
                </Label>

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

              {accountType === "PJ" && (
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>

                  <Input
                    {...register("cnpj")}
                    id="cnpj"
                    type="text"
                    placeholder="00.000.000/0001-00"
                  />

                  <p className="text-xs text-muted-foreground">
                    Os demais dados da empresa você completa depois, na área da
                    empresa.
                  </p>

                  {errors.cnpj && (
                    <p className="text-red-500 text-sm font-semibold mt-1">
                      {errors.cnpj.message}
                    </p>
                  )}
                </div>
              )}

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
                className="w-full"
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
    </div>
  );
}
