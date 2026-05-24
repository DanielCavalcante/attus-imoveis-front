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
    formState: { errors, isSubmitting },
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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl">
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
                <p className="text-red-500 text-sm font-semibold mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

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

            <Button
              disabled={loginMutation.isPending}
              className="w-full bg-black text-white hover:bg-black/90"
            >
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
  );
}
