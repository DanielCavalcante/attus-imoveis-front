"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ClipboardList, Infinity as InfinityIcon } from "lucide-react";

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

import { InternalRoute } from "@/app/components/internal-route";
import { PlanFormData, planSchema } from "@/app/schemas/plan";
import { usePlanMutations, usePlans } from "@/app/hooks/use-backoffice";

export default function BackofficePlansPage() {
  return (
    <InternalRoute>
      <Plans />
    </InternalRoute>
  );
}

function Plans() {
  const { data, isLoading } = usePlans();
  const { create, deactivate } = usePlanMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormData>({ resolver: zodResolver(planSchema) });

  async function onSubmit(form: PlanFormData) {
    try {
      await create.mutateAsync(form);
      toast.success("Plano criado.");
      reset({ nome: "", descricao: "", precoMensal: 0, limiteAnuncios: undefined });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar.");
    }
  }

  async function onDeactivate(id: number, nome: string) {
    try {
      await deactivate.mutateAsync(id);
      toast.success(`${nome} desativado.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível desativar.");
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planos</h1>

            <p className="text-muted-foreground">
              Pacotes oferecidos às imobiliárias.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/portal/backoffice">
              <ClipboardList className="h-4 w-4" aria-hidden />
              Fila de análise
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
              ))}

            {!isLoading && !data?.length && (
              <p className="rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
                Nenhum plano cadastrado ainda.
              </p>
            )}

            {data?.map((plan) => (
              <Card key={plan.id} className={plan.ativo ? "" : "opacity-70"}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">{plan.nome}</h2>

                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                          plan.ativo
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {plan.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.descricao || "Sem descrição"}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm">
                      <strong className="text-base">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(plan.precoMensal)}
                        /mês
                      </strong>

                      <span className="text-muted-foreground">·</span>

                      {plan.anunciosIlimitados ? (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <InfinityIcon className="h-4 w-4" aria-hidden />
                          Anúncios ilimitados
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {plan.limiteAnuncios} anúncios
                        </span>
                      )}
                    </p>
                  </div>

                  {plan.ativo && (
                    <Button
                      variant="outline"
                      onClick={() => onDeactivate(plan.id, plan.nome)}
                      disabled={deactivate.isPending}
                    >
                      Desativar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Novo plano</CardTitle>

              <CardDescription>
                Limite vazio significa anúncios ilimitados.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>

                  <Input id="nome" placeholder="Básico" {...register("nome")} />

                  {errors.nome && (
                    <p className="text-sm font-semibold text-red-500">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>

                  <Input
                    id="descricao"
                    placeholder="Para quem está começando"
                    {...register("descricao")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precoMensal">Preço mensal (R$)</Label>

                  <Input
                    id="precoMensal"
                    type="number"
                    step="0.01"
                    placeholder="99.90"
                    {...register("precoMensal", { valueAsNumber: true })}
                  />

                  {errors.precoMensal && (
                    <p className="text-sm font-semibold text-red-500">
                      {errors.precoMensal.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limiteAnuncios">Limite de anúncios</Label>

                  <Input
                    id="limiteAnuncios"
                    type="number"
                    placeholder="Vazio = ilimitado"
                    {...register("limiteAnuncios", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar plano"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
