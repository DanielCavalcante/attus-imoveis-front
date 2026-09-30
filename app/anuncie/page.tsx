"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PrivateRoute } from "../components/private-route";
import {
  CadastroEmAprovacao,
  type MotivoDoBloqueio,
} from "../components/cadastro-em-aprovacao";
import { FormularioDeAnuncio } from "../components/formulario-de-anuncio";
import { useCompany } from "../hooks/use-company";
import { useMyQuota } from "../hooks/use-my-announcements";
import { useCreateAnnouncement } from "@/app/hooks/use-create-announcement";

export default function CreateAnnouncementPage() {
  return (
    <PrivateRoute>
      <PortaoDaAprovacao />
    </PrivateRoute>
  );
}

/**
 * Quem pode anunciar vê o formulário; quem não pode vê o porquê.
 *
 * O portão de verdade é o servidor -- esta tela existe para a pessoa não
 * preencher quinze campos antes de descobrir. Por isso ela pergunta à mesma
 * rota que o servidor consulta (`podePublicar` e `motivo`), em vez de refazer
 * a regra aqui e arriscar discordar dela.
 *
 * Quota cheia não entra: ali a conta PODE publicar, o que falta é vaga, e
 * esconder o formulário por isso trocaria um 409 explicável por uma porta
 * fechada sem explicação.
 */
function PortaoDaAprovacao() {
  const quota = useMyQuota();

  // Nada de formulário antes da resposta: mostrá-lo e recolhê-lo é pior que
  // esperar, porque quem já começou a digitar perde o que digitou.
  //
  // `isLoading` e não `isPending`: com a consulta em erro, `isPending` continua
  // verdadeiro enquanto houver tentativa em curso, e a tela ficava em esqueleto
  // os sete segundos das três tentativas. Sessão vencida agora nem chega aqui
  // -- ela é tratada no QueryProvider, que leva para o login.
  if (quota.isLoading) {
    return <Carregando />;
  }

  // A quota não respondeu. O formulário abre assim mesmo: quem decide se a
  // publicação passa é o servidor, e trancar a tela por uma leitura que falhou
  // impediria de anunciar quem tem todo o direito.
  if (quota.isError) {
    return <Criacao />;
  }

  const motivo = quota.data?.motivo;
  const bloqueado =
    !!motivo && (motivo.startsWith("EMPRESA_") || motivo === "SEM_PLANO");

  if (!bloqueado) {
    return <Criacao />;
  }

  return <TelaDoBloqueio motivo={motivo} />;
}

/**
 * O motivo da quota vira a tela, e o texto da reprovação vem junto.
 *
 * A empresa só é consultada quando o motivo é reprovação: é o único caso em
 * que há algo escrito para mostrar.
 */
function TelaDoBloqueio({ motivo }: { motivo: string }) {
  const reprovada = motivo === "EMPRESA_REPROVADA";
  const empresa = useCompany(reprovada);

  const status = (
    motivo === "SEM_PLANO" ? "SEM_PLANO" : motivo.replace("EMPRESA_", "")
  ) as MotivoDoBloqueio;

  return (
    <CadastroEmAprovacao
      status={status}
      motivo={empresa.data?.rejectionReason}
    />
  );
}

function Carregando() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6" aria-busy="true">
      <div className="h-10 w-10 animate-pulse bg-secondary" />
      <div className="mt-6 h-12 w-full animate-pulse bg-secondary" />
      <div className="mt-4 h-5 w-3/4 animate-pulse bg-secondary" />
    </div>
  );
}

/** A criação: o formulário compartilhado, com o que só vale aqui. */
function Criacao() {
  const criar = useCreateAnnouncement();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Criar anúncio
        </h1>

        <p className="mt-3 text-muted-foreground">
          O anúncio nasce no ar e ocupa uma vaga da sua quota. Você pode tirá-lo
          do ar depois, sem perdê-lo.
        </p>
      </div>

      <FormularioDeAnuncio
        rotuloDoBotao="Publicar anúncio"
        rotuloSalvando="Publicando…"
        rodape="Sem vaga na quota, a publicação é recusada e o anúncio não é gravado."
        aoSalvar={async (dados) => {
          await criar.mutateAsync(dados);

          toast.success("Anúncio publicado.");
          router.push("/portal/anuncios");
        }}
      />
    </div>
  );
}
