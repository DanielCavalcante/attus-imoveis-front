"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactNode, useState } from "react";

import { ehSessaoExpirada } from "../services/api";
import { encerrarSessao } from "../lib/session";

type Props = {
  children: ReactNode;
};

/**
 * Onde a sessão vencida é tratada — em um lugar só.
 *
 * Sem isto, o JWT vencia (1h, sem refresh) e cada tela reagia por conta
 * própria: a de anunciar ficava 7 segundos em esqueleto antes de desistir, e
 * a de gerenciar mostrava "Você ainda não anunciou" para quem tinha 18
 * anúncios. Nenhuma das duas dizia a única coisa verdadeira, que é que a
 * sessão acabou.
 */
export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: tratarSessao }),
        mutationCache: new MutationCache({ onError: tratarSessao }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            /**
             * Sessão vencida não se resolve insistindo.
             *
             * O padrão são três tentativas com espera exponencial: 1s, 2s, 4s.
             * Contra um 403 de token vencido isso é sete segundos de espera
             * por uma resposta que não vai mudar.
             */
            retry: (tentativas, erro) =>
              !ehSessaoExpirada(erro) && tentativas < 3,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Apaga a sessão e leva para o login, uma vez só.
 *
 * O guarda contra repetição importa porque a tela dispara várias consultas ao
 * mesmo tempo: sem ele, quatro respostas 403 virariam quatro navegações.
 */
let redirecionando = false;

function tratarSessao(erro: unknown) {
  if (!ehSessaoExpirada(erro) || redirecionando) return;

  redirecionando = true;
  encerrarSessao();

  const destino = window.location.pathname + window.location.search;

  // `assign` e não `replace`: o botão de voltar continua funcionando, e a
  // pessoa volta para onde estava depois de entrar de novo.
  window.location.assign(
    `/portal/auth/login?expirou=1&voltar=${encodeURIComponent(destino)}`,
  );
}
