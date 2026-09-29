"use client";

import Link from "next/link";
import { CircleAlert, Clock, FileText, Mail } from "lucide-react";

import { CONTATO, mailtoDoContato } from "../lib/contato";
import type { AnalysisStatus } from "../types/backoffice";

type Props = {
  status: AnalysisStatus;
  /** O motivo que o backoffice registrou ao reprovar. */
  motivo?: string | null;
};

type Conteudo = {
  titulo: string;
  texto: string;
  Icone: typeof Clock;
  acao?: { rotulo: string; href: string };
};

/**
 * O que cada estado da análise significa para quem queria anunciar.
 *
 * Três telas seriam três lugares para a mesma estrutura divergir; o que muda
 * entre os estados é texto e o caminho de saída, não o desenho.
 */
function conteudoDe(status: AnalysisStatus): Conteudo {
  if (status === "NAO_ENVIADO") {
    return {
      titulo: "Falta enviar seu cadastro",
      texto:
        "Para anunciar, a gente precisa conferir os dados da imobiliária — CRECI, responsável legal e endereço. Assim que o cadastro estiver completo, ele entra na fila de análise.",
      Icone: FileText,
      acao: { rotulo: "Completar cadastro", href: "/portal/empresa" },
    };
  }

  if (status === "REPROVADA") {
    return {
      titulo: "Seu cadastro não foi aprovado",
      texto:
        "A análise encontrou algo que precisa ser corrigido. Ajuste os dados e fale com a gente para uma nova conferência.",
      Icone: CircleAlert,
      acao: { rotulo: "Revisar cadastro", href: "/portal/empresa" },
    };
  }

  return {
    titulo: "Seu cadastro está em aprovação",
    texto:
      "A equipe está conferindo os dados da imobiliária. Assim que a análise terminar, a publicação de imóveis é liberada nesta mesma tela.",
    Icone: Clock,
  };
}

/**
 * A tela que aparece no lugar do formulário de anúncio.
 *
 * Existe porque a alternativa é pior: sem ela, a pessoa preenche quinze campos
 * e leva um 403 no fim, sem saber que o problema nunca esteve no imóvel.
 */
export function CadastroEmAprovacao({ status, motivo }: Props) {
  const { titulo, texto, Icone, acao } = conteudoDe(status);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6">
      <Icone className="h-10 w-10 text-brand" aria-hidden />

      <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
        {titulo}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {texto}
      </p>

      {status === "REPROVADA" && motivo && (
        <div className="mt-8 border-l-2 border-destructive bg-card px-5 py-4">
          <p className="text-xs tracking-[0.1em] text-muted-foreground">
            O QUE A ANÁLISE APONTOU
          </p>

          <p className="mt-2 leading-relaxed">{motivo}</p>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {acao && (
          <Link
            href={acao.href}
            className="flex min-h-13 items-center justify-center bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-brand-light"
          >
            {acao.rotulo}
          </Link>
        )}

        <a
          href={mailtoDoContato("Cadastro da imobiliária")}
          className="flex min-h-13 items-center justify-center gap-2 border border-border px-6 font-medium transition-colors hover:border-foreground/40"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {CONTATO.email}
        </a>
      </div>

      {CONTATO.telefone && (
        <p className="mt-6 text-sm text-muted-foreground">
          Ou pelo telefone{" "}
          <a
            href={`tel:${CONTATO.telefone.replace(/\D/g, "")}`}
            className="text-foreground underline underline-offset-4"
          >
            {CONTATO.telefone}
          </a>
          .
        </p>
      )}
    </div>
  );
}
