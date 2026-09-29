"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BadgeCheck, Building2, Inbox, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { InternalRoute } from "@/app/components/internal-route";
import {
  usePendingCompanies,
  useReviewCompany,
} from "@/app/hooks/use-backoffice";
import type { PendingCompany } from "@/app/types/backoffice";

export default function BackofficeQueuePage() {
  return (
    <InternalRoute>
      <Queue />
    </InternalRoute>
  );
}

function Queue() {
  const { data, isLoading } = usePendingCompanies();
  const { approve, reject } = useReviewCompany();

  /** Motivo por empresa: duas recusas em aberto não podem compartilhar o texto. */
  const [motivos, setMotivos] = useState<Record<number, string>>({});

  async function onApprove(company: PendingCompany) {
    try {
      await approve.mutateAsync(company.id);
      toast.success(`${company.nomeFantasia ?? company.cnpj} aprovada.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível aprovar.");
    }
  }

  async function onReject(company: PendingCompany) {
    const motivo = (motivos[company.id] ?? "").trim();

    if (!motivo) {
      toast.error("Informe o motivo da reprovação.");
      return;
    }

    try {
      await reject.mutateAsync({ id: company.id, motivo });
      toast.success(`${company.nomeFantasia ?? company.cnpj} reprovada.`);
      setMotivos((atual) => ({ ...atual, [company.id]: "" }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível reprovar.");
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Análise de imobiliárias
            </h1>

            <p className="text-muted-foreground">
              Empresas aguardando decisão da equipe.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/portal/backoffice/planos">
                <Layers className="h-4 w-4" aria-hidden />
                Planos
              </Link>
            </Button>

            {/*
              Sem este link a tela existiria sem porta: aprovar a empresa e
              liberar o plano dela sao dois passos do mesmo atendimento.
            */}
            <Button asChild variant="outline">
              <Link href="/portal/backoffice/planos-das-empresas">
                <Building2 className="h-4 w-4" aria-hidden />
                Planos das empresas
              </Link>
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        )}

        {!isLoading && !data?.length && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
            </div>

            <h2 className="mt-8 text-2xl font-bold">Nada na fila</h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Nenhuma imobiliária aguardando análise no momento.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {data?.map((company) => (
            <Card key={company.id}>
              <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto]">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {company.nomeFantasia ?? "Sem nome fantasia"}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {company.razaoSocial ?? "Sem razão social"}
                    </p>
                  </div>

                  <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
                    <Field label="CNPJ" value={company.cnpj} />

                    <Field
                      label="CRECI"
                      value={
                        company.creciNumero
                          ? `${company.creciNumero} / ${company.creciUf ?? "--"}`
                          : "Não informado"
                      }
                    />

                    <Field
                      label="Responsável"
                      value={company.responsavelNome ?? "Não informado"}
                    />

                    <Field
                      label="E-mail comercial"
                      value={company.emailComercial ?? "Não informado"}
                    />
                  </dl>

                  <div className="space-y-2">
                    <label
                      htmlFor={`motivo-${company.id}`}
                      className="text-sm font-medium"
                    >
                      Motivo da reprovação
                    </label>

                    <Textarea
                      id={`motivo-${company.id}`}
                      rows={2}
                      placeholder="Obrigatório para reprovar. Ex: CRECI não confere com o conselho."
                      value={motivos[company.id] ?? ""}
                      onChange={(event) =>
                        setMotivos((atual) => ({
                          ...atual,
                          [company.id]: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-3 lg:flex-col lg:justify-start">
                  <Button
                    onClick={() => onApprove(company)}
                    disabled={approve.isPending}
                    className="flex-1 lg:flex-none"
                  >
                    <BadgeCheck className="h-4 w-4" aria-hidden />
                    Aprovar
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onReject(company)}
                    disabled={reject.isPending}
                    className="flex-1 lg:flex-none"
                  >
                    Reprovar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>

      <dd className="font-medium">{value}</dd>
    </div>
  );
}
