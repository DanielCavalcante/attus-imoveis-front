"use client";

import { TriangleAlert } from "lucide-react";

import type { CompanyPlan, ImpactoDoPlano, Plan } from "../types/backoffice";

type Props = {
  empresa: CompanyPlan;
  destino: Plan;
  impacto?: ImpactoDoPlano;
  carregandoImpacto: boolean;
  confirmando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

function nomeDe(empresa: CompanyPlan) {
  return empresa.nomeFantasia || empresa.razaoSocial || empresa.cnpj;
}

/**
 * Confirmação da troca de plano, com o aviso do downgrade.
 *
 * O aviso não desabilita nada: a decisão foi explícita — avisar, não
 * bloquear. Nenhum anúncio sai do ar por causa da troca, e é isso que o texto
 * precisa dizer, senão quem libera fica imaginando o pior.
 */
export function ConfirmarLiberacaoDePlano({
  empresa,
  destino,
  impacto,
  carregandoImpacto,
  confirmando,
  onConfirmar,
  onCancelar,
}: Props) {
  const excede = impacto?.excede ?? false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-liberacao"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
    >
      <div className="w-full max-w-lg border border-border bg-card p-6 sm:p-8">
        <h2 id="titulo-liberacao" className="font-display text-2xl font-semibold">
          Liberar {destino.nome}
        </h2>

        <p className="mt-3 leading-relaxed text-muted-foreground">
          {nomeDe(empresa)} passa a ter{" "}
          {destino.limiteAnuncios === null
            ? "anúncios ilimitados"
            : `${destino.limiteAnuncios} anúncios no ar`}
          .
        </p>

        {carregandoImpacto && (
          <p className="tabular mt-6 text-sm text-muted-foreground">
            Conferindo o acervo da empresa…
          </p>
        )}

        {excede && impacto && (
          <div
            role="alert"
            className="mt-6 border-l-2 border-brand bg-secondary px-5 py-4"
          >
            <p className="flex items-center gap-2 font-medium">
              <TriangleAlert className="h-4 w-4 text-brand" aria-hidden />
              A empresa fica acima do novo limite
            </p>

            <p className="tabular mt-2 leading-relaxed text-muted-foreground">
              São {impacto.anunciosNoAr} anúncios no ar para um limite de{" "}
              {impacto.limiteDestino}.{" "}
              <strong className="font-medium text-foreground">
                Nenhum anúncio será tirado do ar.
              </strong>{" "}
              A empresa só sente o novo teto na próxima publicação.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            className="min-h-13 border border-border px-6 font-medium transition-colors hover:border-foreground/40"
          >
            Cancelar
          </button>

          {/*
            Habilitado mesmo com o aviso na tela: o downgrade é liberado do
            mesmo jeito, e desabilitar aqui seria bloquear pelas costas o que
            a spec disse para só avisar.
          */}
          <button
            type="button"
            onClick={onConfirmar}
            disabled={confirmando}
            className="min-h-13 bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-brand-light disabled:pointer-events-none disabled:opacity-60"
          >
            {confirmando ? "Liberando…" : "Liberar plano"}
          </button>
        </div>
      </div>
    </div>
  );
}
