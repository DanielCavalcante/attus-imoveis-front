"use client";

import { api } from "./api";
import { PendingCompany, Plan } from "../types/backoffice";
import { PlanFormData } from "../schemas/plan";

export async function getPendingCompanies() {
  return api<PendingCompany[]>("/backoffice/companies", {
    method: "GET",
    auth: true,
  });
}

export async function approveCompany(id: number) {
  return api<unknown>(`/backoffice/companies/${id}/aprovar`, {
    method: "POST",
    auth: true,
  });
}

export async function rejectCompany(id: number, motivo: string) {
  return api<unknown>(`/backoffice/companies/${id}/reprovar`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ motivo }),
  });
}

export async function getAllPlans() {
  return api<Plan[]>("/backoffice/plans", { method: "GET", auth: true });
}

/** Limite vazio vira nulo: é assim que o backend representa ilimitado. */
export function buildPlanPayload(data: PlanFormData) {
  return {
    nome: data.nome,
    descricao: data.descricao || null,
    precoMensal: data.precoMensal,
    limiteAnuncios: data.limiteAnuncios ?? null,
  };
}

export async function createPlan(data: PlanFormData) {
  return api<Plan>("/backoffice/plans", {
    method: "POST",
    auth: true,
    body: JSON.stringify(buildPlanPayload(data)),
  });
}

export async function deactivatePlan(id: number) {
  return api<Plan>(`/backoffice/plans/${id}/desativar`, {
    method: "POST",
    auth: true,
  });
}
