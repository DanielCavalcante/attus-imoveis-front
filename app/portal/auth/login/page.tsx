"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/contexts/auth-context";
import { SignInFormData, signInSchema } from "@/app/schemas/sign-in";
import { useLogin } from "@/app/hooks/use-login";

const CAMPO =
  "min-h-13 w-full border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground";

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
    /*
      Mesma composicao do cadastro, e isso nao e estetica: as duas telas sao o
      mesmo momento do produto e trocar o lado da foto entre elas faz a segunda
      parecer outro site. Foto a esquerda, formulario a direita, nas duas.

      A coluna da foto nao leva min-h-screen: dentro da grade ela ja estica ate
      a altura da linha, e o 100vh somado ao cabecalho jogava a legenda do pe
      para fora da janela.
    */
    <div className="grid lg:grid-cols-[34rem_minmax(0,1fr)]">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/login.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[50%_45%]"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,18,32,0.7) 0%, rgba(12,18,32,0.14) 44%, rgba(12,18,32,0.9) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 px-11 pb-11">
          <p className="max-w-[20ch] font-display text-3xl font-semibold leading-tight">
            Quem vende o próprio imóvel não vende sozinho.
          </p>

          <div className="horizonte mt-6" />

          <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-foreground/80">
            Três anúncios por mês, de graça, e uma equipe que atende quando você
            pede ajuda para vender.
          </p>
        </div>
      </div>

      {/*
        O formulario se centra na propria coluna. Ancorado a esquerda de uma
        coluna 1fr, num monitor cheio ele ficava a ~1400px da borda direita: o
        conteudo lia como encostado num canto, nao como composto na tela.
      */}
      <div className="flex items-center justify-center px-4 py-14 sm:px-10 lg:min-h-[42rem] lg:py-24">
        <div className="w-full max-w-md">
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.02]">
            Entrar
          </h1>

          <p className="mt-4 leading-relaxed text-muted-foreground">
            Sua conta guarda seus anúncios, seus favoritos e os pedidos de apoio à
            venda.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-foreground/85">
                E-mail
              </label>

              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                className={CAMPO}
              />

              {errors.email && (
                <p className="mt-2 text-sm font-medium text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              {/*
                Nao ha link de "esqueceu a senha": /portal/auth/forgot-password
                nao e rota deste app e dava 404. Recuperacao de senha depende de
                envio de e-mail, que o produto ainda nao tem.
              */}
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-foreground/85"
              >
                Senha
              </label>

              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="current-password"
                className={CAMPO}
              />

              {errors.password && (
                <p className="mt-2 text-sm font-medium text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-9 flex min-h-14 w-full items-center justify-center bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-brand-light disabled:pointer-events-none disabled:opacity-60"
            >
              {loginMutation.isPending ? "Entrando…" : "Entrar"}
            </button>

            <p className="mt-6 text-muted-foreground">
              Não possui uma conta?{" "}
              <Link
                href="/portal/auth/register"
                className="text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-brand-light"
              >
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}
