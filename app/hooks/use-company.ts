"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyCompany } from "../services/company.service";

export function useCompany(enabled = true) {
  return useQuery({
    queryKey: ["company", "me"],
    queryFn: getMyCompany,
    enabled,
    retry: false,
  });
}
