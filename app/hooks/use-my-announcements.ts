"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  excluirAnuncio,
  getMyAnnouncements,
  getMyQuota,
  inativarAnuncio,
  reativarAnuncio,
} from "../services/announcements-me.service";

/** Página única: a lista da conta não cresce como o acervo. */
export function useMyAnnouncements() {
  return useQuery({
    queryKey: ["announcements", "me"],
    queryFn: () => getMyAnnouncements(),
  });
}

export function useMyQuota() {
  return useQuery({
    queryKey: ["announcements", "me", "quota"],
    queryFn: getMyQuota,
  });
}

/**
 * As três ações da página de gerenciamento.
 *
 * Todas invalidam a lista e o saldo juntos: inativar e excluir devolvem vaga,
 * e mostrar a lista nova ao lado de um saldo velho seria pior que não mostrar
 * saldo nenhum.
 */
function useAcaoSobreAnuncio(acao: (id: number) => Promise<void>) {
  const cliente = useQueryClient();

  return useMutation({
    mutationFn: acao,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ["announcements", "me"] });
      cliente.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useInativarAnuncio() {
  return useAcaoSobreAnuncio(inativarAnuncio);
}

export function useReativarAnuncio() {
  return useAcaoSobreAnuncio(reativarAnuncio);
}

export function useExcluirAnuncio() {
  return useAcaoSobreAnuncio(excluirAnuncio);
}
