"use client";

import Link from "next/link";
import { Megaphone, LayoutList } from "lucide-react";

import { useMyAnnouncements, useMyQuota } from "@/app/hooks/use-my-announcements";
import { PrivateRoute } from "@/app/components/private-route";

/**
 * O dashboard deixou de listar anúncios.
 *
 * A grade que morava aqui era a mesma do acervo público, sem as ações de quem
 * é dono. Duas telas listando os mesmos anúncios com poderes diferentes é como
 * alguém edita no lugar errado e não acha a ação que procura. Quem gerencia é
 * /portal/anuncios; aqui ficam os caminhos.
 */
export default function DashboardPage() {
  return (
    <PrivateRoute>
      <Painel />
    </PrivateRoute>
  );
}

function Painel() {
  const { data } = useMyAnnouncements();
  const quota = useMyQuota();

  const total = data?.totalElements ?? 0;
  const noAr = quota.data?.usados ?? 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
        Sua conta
      </h1>

      <p className="tabular mt-3 text-muted-foreground">
        {total === 0
          ? "Nenhum anúncio publicado ainda."
          : `${total} ${total === 1 ? "anúncio" : "anúncios"} · ${noAr} no ar.`}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Link
          href="/portal/anuncios"
          className="flex flex-col border border-border p-7 transition-colors hover:border-foreground/40 hover:bg-card"
        >
          <LayoutList className="h-6 w-6 text-primary" aria-hidden />

          <h2 className="mt-5 font-display text-2xl font-semibold">
            Meus anúncios
          </h2>

          <p className="mt-2 leading-relaxed text-muted-foreground">
            Editar, tirar do ar, voltar ao ar ou excluir.
          </p>
        </Link>

        <Link
          href="/anuncie"
          className="flex flex-col border border-border p-7 transition-colors hover:border-foreground/40 hover:bg-card"
        >
          <Megaphone className="h-6 w-6 text-primary" aria-hidden />

          <h2 className="mt-5 font-display text-2xl font-semibold">
            Criar anúncio
          </h2>

          <p className="mt-2 leading-relaxed text-muted-foreground">
            Publicar um imóvel novo.
          </p>
        </Link>
      </div>
    </div>
  );
}
