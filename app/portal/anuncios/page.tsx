"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { PrivateRoute } from "@/app/components/private-route";
import { LinhaDeAnuncio } from "@/app/components/linha-de-anuncio";
import {
  useExcluirAnuncio,
  useInativarAnuncio,
  useMyAnnouncements,
  useMyQuota,
  useReativarAnuncio,
} from "@/app/hooks/use-my-announcements";
import { Announcement } from "@/app/types/announcement";

export default function MeusAnunciosPage() {
  return (
    <PrivateRoute>
      <Gerenciamento />
    </PrivateRoute>
  );
}

function Gerenciamento() {
  const { data, isLoading } = useMyAnnouncements();
  const quota = useMyQuota();

  const inativar = useInativarAnuncio();
  const reativar = useReativarAnuncio();
  const excluir = useExcluirAnuncio();

  const [aExcluir, setAExcluir] = useState<Announcement | null>(null);

  const anuncios = data?.content ?? [];
  const ocupado =
    inativar.isPending || reativar.isPending || excluir.isPending;

  /*
    Toda ação trata erro. Sem isso a mutação falha em silêncio e a pessoa fica
    olhando para uma tela que não mudou, sem saber se clicou errado ou se o
    sistema quebrou — foi exatamente o que aconteceu aqui antes de o cliente
    HTTP aprender a lidar com 204.
  */
  function aoInativar(id: number) {
    inativar.mutate(id, {
      onError: () => toast.error("Não foi possível tirar o anúncio do ar."),
    });
  }

  function aoReativar(id: number) {
    reativar.mutate(id, {
      onError: (erro) => {
        /*
          O backend devolve 409 quando não há vaga. Traduzir isso em "erro ao
          reativar" esconderia a única informação útil: o que fazer a seguir.
        */
        const mensagem =
          erro instanceof Error && erro.message
            ? erro.message
            : "Não foi possível voltar o anúncio ao ar.";

        toast.error(mensagem);
      },
    });
  }

  function confirmarExclusao() {
    if (!aExcluir) return;

    const alvo = aExcluir;

    setAExcluir(null);

    excluir.mutate(alvo.id, {
      onSuccess: () => toast.success(`"${alvo.title}" foi excluído.`),
      onError: () => toast.error("Não foi possível excluir o anúncio."),
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Meus anúncios
          </h1>

          <p className="mt-3 text-muted-foreground">
            Edite, tire do ar ou exclua. Tirar do ar devolve a vaga e guarda o
            anúncio para depois.
          </p>
        </div>

        <Saldo quota={quota.data} carregando={quota.isLoading} />
      </div>

      {isLoading && (
        <div className="space-y-4 pt-8" aria-busy="true">
          {Array.from({ length: 3 }).map((_, indice) => (
            <div key={indice} className="h-24 animate-pulse bg-secondary" />
          ))}
        </div>
      )}

      {!isLoading && anuncios.length === 0 && <SemAnuncios />}

      {anuncios.length > 0 && (
        <div className="pt-2">
          {anuncios.map((anuncio) => (
            <LinhaDeAnuncio
              key={anuncio.id}
              announcement={anuncio}
              ocupado={ocupado}
              onInativar={aoInativar}
              onReativar={aoReativar}
              onExcluir={setAExcluir}
            />
          ))}
        </div>
      )}

      {aExcluir && (
        <ConfirmacaoDeExclusao
          anuncio={aExcluir}
          onCancelar={() => setAExcluir(null)}
          onConfirmar={confirmarExclusao}
        />
      )}
    </div>
  );
}

/**
 * O saldo aparece antes de faltar.
 *
 * Conta sem teto vê o que tem no ar e não um restante inventado: a spec 22
 * conta ativos para qualquer tipo de conta, mas só a pessoa física tem limite
 * hoje.
 */
function Saldo({
  quota,
  carregando,
}: {
  quota?: { ilimitado: boolean; limite: number | null; usados: number | null };
  carregando: boolean;
}) {
  if (carregando || !quota) {
    return <div className="h-14 w-48 animate-pulse bg-secondary" />;
  }

  if (quota.ilimitado) {
    return (
      <p className="tabular text-sm text-muted-foreground">
        <span className="font-display text-2xl font-semibold text-foreground">
          {quota.usados ?? 0}
        </span>{" "}
        no ar · sem limite
      </p>
    );
  }

  const usados = quota.usados ?? 0;
  const limite = quota.limite ?? 0;
  const restantes = Math.max(0, limite - usados);

  return (
    <p className="tabular text-sm text-muted-foreground">
      <span className="font-display text-2xl font-semibold text-foreground">
        {usados} de {limite}
      </span>{" "}
      no ar ·{" "}
      {restantes === 0
        ? "sem vaga — tire um do ar para publicar outro"
        : `${restantes} ${restantes === 1 ? "vaga livre" : "vagas livres"}`}
    </p>
  );
}

function SemAnuncios() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <h2 className="font-display text-3xl font-semibold">
        Você ainda não anunciou
      </h2>

      <p className="mt-3 max-w-md text-muted-foreground">
        Publique o primeiro imóvel e ele aparece aqui, com as ações para
        gerenciá-lo.
      </p>

      <Link
        href="/anuncie"
        className="mt-8 flex min-h-13 items-center bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-brand-light"
      >
        Criar anúncio
      </Link>
    </div>
  );
}

/**
 * Excluir confirma; inativar não.
 *
 * A assimetria é o ponto: exclusão é irreversível e a confirmação precisa
 * dizer o que vai sumir. Pedir confirmação para o que se desfaz num clique
 * ensina a pessoa a clicar em "sim" sem ler.
 */
function ConfirmacaoDeExclusao({
  anuncio,
  onCancelar,
  onConfirmar,
}: {
  anuncio: Announcement;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-exclusao"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4"
    >
      <div className="w-full max-w-md border border-border bg-card p-7">
        <h2
          id="titulo-exclusao"
          className="font-display text-2xl font-semibold"
        >
          Excluir “{anuncio.title}”?
        </h2>

        <p className="mt-4 leading-relaxed text-muted-foreground">
          A exclusão é definitiva: o anúncio não volta. Se você só quer tirá-lo
          do ar por enquanto, use “Tirar do ar”.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancelar}
            className="min-h-12 border border-border px-6 text-sm transition-colors hover:border-foreground/40"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            className="min-h-12 border border-destructive px-6 text-sm text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            Excluir definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
