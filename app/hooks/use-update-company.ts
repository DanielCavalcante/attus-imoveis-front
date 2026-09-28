"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyCompany } from "../services/company.service";

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "me"] });
    },
  });
}
