"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAnnouncement } from "../services/announcement-update.service";
import { AnnouncementFormData } from "../schemas/announcement";

/**
 * Salvar alterações invalida o que passou a estar errado.
 *
 * Pelo mesmo motivo de publicar: sem isto, a lista de "Meus anúncios" — para
 * onde salvar leva — mostraria o valor antigo por até um minuto, que é o
 * `staleTime` do QueryProvider.
 */
export function useUpdateAnnouncement(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: AnnouncementFormData) => updateAnnouncement(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements", "me"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement-detail", id] });
    },
  });
}
