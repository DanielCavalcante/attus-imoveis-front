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
import { useAuth } from "@/app/contexts/auth-context";
import { SignInFormData, signInSchema } from "@/app/schemas/sign-in";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLogin } from "@/app/hooks/use-login";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInFormData) {
    try {
      const result = await loginMutation.mutateAsync(data);

      login(result.token);
      toast.success("Login realizado com sucesso!");
      router.push("/portal/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("E-mail ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex">
        <img
          src="/login.jpg"
          alt="Imóveis"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold leading-tight text-brand">
            Encontre o imóvel
            <br />
            ideal para você
          </h1>

          <p className="mt-6 max-w-md text-lg text-zinc-200">
            Compre, venda ou alugue imóveis de forma simples, rápida e segura.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-8">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Entrar</CardTitle>

            <CardDescription>Faça login para acessar sua conta</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                />

                {errors.email && (
                  <p className="text-sm font-semibold text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>

                  <Link
                    href="/portal/auth/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="********"
                />

                {errors.password && (
                  <p className="text-sm font-semibold text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button disabled={loginMutation.isPending} className="w-full">
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Não possui uma conta?{" "}
                <Link
                  href="/portal/auth/register"
                  className="font-medium hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
