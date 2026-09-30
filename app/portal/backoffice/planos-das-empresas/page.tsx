"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

import { InternalRoute } from "@/app/components/internal-route";
import { ConfirmarLiberacaoDePlano } from "@/app/components/confirmar-liberacao-de-plano";
import {
  useCompanyPlans,
  useImpactoDoPlano,
  useLiberarPlano,
  usePlans,
} from "@/app/hooks/use-backoffice";
import type { CompanyPlan, Plan } from "@/app/types/backoffice";

export default function PlanosDasEmpresasPage() {
  return (
    <InternalRoute>
      <PlanosDasEmpresas />
    </InternalRoute>
  );
}

function nomeDe(empresa: CompanyPlan) {
  return empresa.nomeFantasia || empresa.razaoSocial || empresa.cnpj;
}

function tetoDe(empresa: CompanyPlan) {
  if (!empresa.planoNome) return "Sem plano";

  return empresa.limiteAnuncios === null
    ? `${empresa.planoNome} · ilimitado`
    : `${empresa.planoNome} · ${empresa.limiteAnuncios} no ar`;
}

/**
 * A liberação manual de plano, enquanto não há gateway.
 *
 * A escolha do plano não libera nada sozinha: ela monta a confirmação, e é lá
 * que o aviso do downgrade aparece — com os números que o servidor mediu, não
 * com conta feita aqui, que erraria se alguém publicasse no meio.
 */
function PlanosDasEmpresas() {
  const empresas = useCompanyPlans();
  const planos = usePlans();
  const liberar = useLiberarPlano();

  const [escolha, setEscolha] = useState<{
    empresa: CompanyPlan;
    destino: Plan;
  } | null>(null);

  const impacto = useImpactoDoPlano(
    escolha?.empresa.companyId,
    escolha?.destino.id,
  );

  const ativos = (planos.data ?? []).filter((plano) => plano.ativo);

  async function confirmar() {
    if (!escolha) return;

    try {
      await liberar.mutateAsync({
        companyId: escolha.empresa.companyId,
        planId: escolha.destino.id,
      });

      toast.success(`${escolha.destino.nome} liberado para ${nomeDe(escolha.empresa)}.`);
      setEscolha(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível liberar.",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Planos das empresas
        </h1>

        <p className="mt-3 text-muted-foreground">
          Enquanto não há cobrança automática, o plano é liberado aqui. Empresa
          aprovada e sem plano não consegue anunciar.
        </p>
      </div>

      {empresas.isLoading && (
        <p className="pt-10 text-muted-foreground">Carregando empresas…</p>
      )}

      {empresas.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center border border-dashed border-border py-24 text-center">
          <Building2 className="h-9 w-9 text-muted-foreground" aria-hidden />

          <p className="mt-5 font-display text-2xl font-semibold">
            Nenhuma empresa aprovada ainda
          </p>

          <p className="mt-2 text-muted-foreground">
            A liberação de plano acontece depois da análise do cadastro.
          </p>
        </div>
      )}

      <ul className="divide-y divide-border">
        {(empresas.data ?? []).map((empresa) => (
          <li
            key={empresa.companyId}
            className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{nomeDe(empresa)}</p>

              <p className="tabular mt-1 text-sm text-muted-foreground">
                {tetoDe(empresa)} · {empresa.anunciosNoAr}{" "}
                {empresa.anunciosNoAr === 1 ? "anúncio no ar" : "anúncios no ar"}
              </p>
            </div>

            <div>
              <label
                htmlFor={`plano-${empresa.companyId}`}
                className="mb-2 block text-xs tracking-[0.1em] text-muted-foreground sm:sr-only"
              >
                LIBERAR PLANO PARA {nomeDe(empresa).toUpperCase()}
              </label>

              <select
                id={`plano-${empresa.companyId}`}
                value=""
                onChange={(evento) => {
                  const destino = ativos.find(
                    (plano) => String(plano.id) === evento.target.value,
                  );

                  if (destino) setEscolha({ empresa, destino });
                }}
                className="min-h-12 w-full border border-input bg-card px-4 text-sm outline-none sm:w-64"
              >
                <option value="">Escolher plano…</option>

                {/* Só plano ativo: desativado não se vende nem se dá. */}
                {ativos.map((plano) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.nome}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>

      {escolha && (
        <ConfirmarLiberacaoDePlano
          empresa={escolha.empresa}
          destino={escolha.destino}
          impacto={impacto.data}
          carregandoImpacto={impacto.isLoading}
          confirmando={liberar.isPending}
          onConfirmar={confirmar}
          onCancelar={() => setEscolha(null)}
        />
      )}
    </div>
  );
}
