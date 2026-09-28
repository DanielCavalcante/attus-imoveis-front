"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveCompany,
  createPlan,
  deactivatePlan,
  getAllPlans,
  getPendingCompanies,
  rejectCompany,
} from "../services/backoffice.service";
import { PlanFormData } from "../schemas/plan";

const FILA = ["backoffice", "companies"];
const PLANOS = ["backoffice", "plans"];

export function usePendingCompanies(enabled = true) {
  return useQuery({
    queryKey: FILA,
    queryFn: getPendingCompanies,
    enabled,
    retry: false,
  });
}

/** Invalida a fila: a empresa decidida some sem recarregar a página. */
export function useReviewCompany() {
  const queryClient = useQueryClient();
  const invalidar = () => queryClient.invalidateQueries({ queryKey: FILA });

  const approve = useMutation({
    mutationFn: approveCompany,
    onSuccess: invalidar,
  });

  const reject = useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      rejectCompany(id, motivo),
    onSuccess: invalidar,
  });

  return { approve, reject };
}

export function usePlans(enabled = true) {
  return useQuery({
    queryKey: PLANOS,
    queryFn: getAllPlans,
    enabled,
    retry: false,
  });
}

export function usePlanMutations() {
  const queryClient = useQueryClient();
  const invalidar = () => queryClient.invalidateQueries({ queryKey: PLANOS });

  const create = useMutation({
    mutationFn: (data: PlanFormData) => createPlan(data),
    onSuccess: invalidar,
  });

  const deactivate = useMutation({
    mutationFn: deactivatePlan,
    onSuccess: invalidar,
  });

  return { create, deactivate };
}
