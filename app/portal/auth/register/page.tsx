"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UserFormData, userSchema } from "@/app/schemas/user";
import { useCreateUser } from "@/app/hooks/use-create-user";

const CAMPO =
  "min-h-13 w-full border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground";

const ROTULO = "mb-2 block text-sm text-foreground/85";

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

  function escolher(valor: UserFormData["accountType"]) {
    setValue("accountType", valor, { shouldValidate: true });
  }

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
    <div className="grid lg:grid-cols-[34rem_minmax(0,1fr)]">
      {/*
        No celular este painel vira faixa de texto no topo, sem a foto — as
        duas frases que são a posição do produto sumiam no aparelho onde mais
        gente cria conta. Sem `priority`, a imagem só é buscada quando o painel
        de fato aparece, em vez de ser baixada e descartada.
      */}
      <div className="border-b border-border px-4 py-6 sm:px-10 lg:relative lg:overflow-hidden lg:border-0 lg:p-0">
        <div className="hidden lg:block">
          <Image
            src="/register.jpg"
            alt=""
            fill
            className="object-cover object-[54%_46%]"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,18,32,0.74) 0%, rgba(12,18,32,0.16) 42%, rgba(12,18,32,0.88) 100%)",
            }}
          />
        </div>

        <div className="lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-11 lg:pb-11">
          <p className="max-w-[26ch] font-display text-xl font-semibold leading-tight sm:text-2xl lg:max-w-[22ch] lg:text-3xl">
            Imobiliária passa pela análise. Pessoa física publica hoje.
          </p>

          <div className="horizonte mt-4 lg:mt-6" />

          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-foreground/80 lg:mt-5">
            Nenhuma imobiliária publica antes de alguém da equipe conferir
            CRECI, razão social e responsável legal. É por isso que quem busca
            confia no que vê aqui.
          </p>
        </div>
      </div>

      {/* Mesma regra do login: o formulario se centra na propria coluna. */}
      <div className="flex items-center justify-center px-4 py-14 sm:px-10 lg:py-20">
        <div className="w-full max-w-2xl">
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.02]">
            Criar conta
          </h1>

          <p className="mt-4 max-w-[54ch] leading-relaxed text-muted-foreground">
            O tipo de conta muda a regra do anúncio, nunca o que você pode
            fazer. Qualquer conta busca, favorita e anuncia.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
            <fieldset className="border-0 p-0">
              <legend className="mb-4 text-xs font-medium tracking-[0.1em] text-muted-foreground">
                SOU
              </legend>

              {/*
                Radio nativo dentro de <label>: o cartão inteiro é a área de
                clique e o Tab chega nele sem truque de div com onClick.
              */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Escolha
                  id="accountType-pf"
                  valor="PF"
                  marcado={accountType === "PF"}
                  titulo="Pessoa física"
                  descricao="Três anúncios por mês, de graça. Publica hoje mesmo e pode pedir apoio da equipe de venda em cada anúncio."
                  onEscolher={escolher}
                />

                <Escolha
                  id="accountType-pj"
                  valor="PJ"
                  marcado={accountType === "PJ"}
                  titulo="Imobiliária"
                  descricao="CNPJ e um contato criam a conta agora. O dossiê completo e a análise vêm depois, na área da empresa."
                  onEscolher={escolher}
                />
              </div>

              {errors.accountType && <Erro>{errors.accountType.message}</Erro>}
            </fieldset>

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullname" className={ROTULO}>
                  {accountType === "PJ" ? "Nome do contato" : "Nome completo"}
                </label>

                <input
                  {...register("fullname")}
                  id="fullname"
                  type="text"
                  className={CAMPO}
                />

                {errors.fullname && <Erro>{errors.fullname.message}</Erro>}
              </div>

              <div>
                <label htmlFor="email" className={ROTULO}>
                  E-mail
                </label>

                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={CAMPO}
                />

                {errors.email && <Erro>{errors.email.message}</Erro>}
              </div>

              <div>
                <label htmlFor="phone" className={ROTULO}>
                  Telefone
                </label>

                <input
                  {...register("phone")}
                  id="phone"
                  type="tel"
                  className={CAMPO}
                />

                {errors.phone && <Erro>{errors.phone.message}</Erro>}
              </div>

              {accountType === "PJ" && (
                <div>
                  <label htmlFor="cnpj" className={ROTULO}>
                    CNPJ
                  </label>

                  <input
                    {...register("cnpj")}
                    id="cnpj"
                    type="text"
                    className={CAMPO}
                  />

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Os demais dados da empresa você completa depois, na área da
                    empresa.
                  </p>

                  {errors.cnpj && <Erro>{errors.cnpj.message}</Erro>}
                </div>
              )}

              <div>
                <label htmlFor="password" className={ROTULO}>
                  Senha
                </label>

                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  className={CAMPO}
                />

                {errors.password && <Erro>{errors.password.message}</Erro>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={ROTULO}>
                  Confirmar senha
                </label>

                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  className={CAMPO}
                />

                {errors.confirmPassword && (
                  <Erro>{errors.confirmPassword.message}</Erro>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex min-h-14 items-center bg-primary px-9 font-medium text-primary-foreground transition-colors hover:bg-brand-light disabled:pointer-events-none disabled:opacity-60"
              >
                {createUserMutation.isPending
                  ? "Criando conta…"
                  : "Criar conta"}
              </button>

              <p className="text-muted-foreground">
                Já tem conta?{" "}
                <Link
                  href="/portal/auth/login"
                  className="text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-brand-light"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </form>

          {/*
            O produto nao envia e-mail: nenhum provedor foi escolhido. Dizer isso
            aqui evita a espera por uma confirmacao que nunca chega.
          */}
          <p className="mt-12 max-w-2xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
            Confirmação por e-mail ainda não existe no sistema: a conta nasce
            ativa. Quando o envio existir, este passo entra aqui.
          </p>
        </div>
      </div>
    </div>
  );
}

type EscolhaProps = {
  id: string;
  valor: UserFormData["accountType"];
  marcado: boolean;
  titulo: string;
  descricao: string;
  onEscolher: (valor: UserFormData["accountType"]) => void;
};

function Escolha({
  id,
  valor,
  marcado,
  titulo,
  descricao,
  onEscolher,
}: EscolhaProps) {
  return (
    <label
      htmlFor={id}
      className={`block cursor-pointer bg-card p-6 transition-colors ${
        marcado
          ? "border border-primary"
          : "border border-border hover:border-input"
      }`}
    >
      <span className="flex items-center gap-3">
        <input
          id={id}
          type="radio"
          name="accountType"
          value={valor}
          checked={marcado}
          onChange={() => onEscolher(valor)}
          className="h-4 w-4 accent-[var(--primary)]"
        />

        <span className="font-display text-xl font-semibold">{titulo}</span>
      </span>

      <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
        {descricao}
      </span>
    </label>
  );
}

function Erro({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mt-2 text-sm font-medium text-destructive" role="alert">
      {children}
    </p>
  );
}
