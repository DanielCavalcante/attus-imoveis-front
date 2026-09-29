"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveCompany,
  getCompanyPlans,
  getImpactoDoPlano,
  liberarPlano,
  createPlan,
  deactivatePlan,
  getAllPlans,
  getPendingCompanies,
  rejectCompany,
} from "../services/backoffice.service";
import { PlanFormData } from "../schemas/plan";

const FILA = ["backoffice", "companies"];
const PLANOS = ["backoffice", "plans"];
const EMPRESAS_COM_PLANO = ["backoffice", "company-plans"];

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

export function useCompanyPlans(enabled = true) {
  return useQuery({
    queryKey: EMPRESAS_COM_PLANO,
    queryFn: getCompanyPlans,
    enabled,
    retry: false,
  });
}

/**
 * O aviso do downgrade, medido pelo servidor.
 *
 * Só busca quando há empresa e plano escolhidos: perguntar o impacto de uma
 * troca que ninguém montou ainda é requisição sem pergunta.
 */
export function useImpactoDoPlano(companyId?: number, planId?: number) {
  return useQuery({
    queryKey: ["backoffice", "plano-impacto", companyId, planId],
    queryFn: () => getImpactoDoPlano(companyId!, planId!),
    enabled: Boolean(companyId) && Boolean(planId),
    retry: false,
  });
}

/** Liberada a troca, a lista mostra o plano novo sem recarregar a página. */
export function useLiberarPlano() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, planId }: { companyId: number; planId: number }) =>
      liberarPlano(companyId, planId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: EMPRESAS_COM_PLANO }),
  });
}
