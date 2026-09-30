"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnnouncement } from "../services/announcement-create.service";

/**
 * Publicar um anúncio invalida as listas que passaram a estar erradas.
 *
 * Sem isto, o anúncio recém-criado demorava até um minuto para aparecer: o
 * `staleTime` do QueryProvider é de 60s, e a tela de gerenciamento — para onde
 * publicar leva — servia a lista que já tinha em cache. Quem acabou de
 * publicar via a página sem o próprio anúncio e concluía que a publicação
 * falhou.
 *
 * As ações de inativar, reativar e excluir já faziam isso desde a spec 23;
 * criar era a única que não fazia.
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      // A chave da quota (`["announcements", "me", "quota"]`) cai junto pelo
      // prefixo: o anúncio novo ocupa uma vaga, e o saldo de antes virou
      // mentira no mesmo instante.
      queryClient.invalidateQueries({ queryKey: ["announcements", "me"] });
      // E o acervo público, onde ele nasce no ar.
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
