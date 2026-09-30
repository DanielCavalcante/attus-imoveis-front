"use client";

import { api } from "./api";
import {
  CompanyPlan,
  ImpactoDoPlano,
  PendingCompany,
  Plan,
} from "../types/backoffice";
import { Page } from "../types/pagination";
import { PlanFormData } from "../schemas/plan";

export async function getPendingCompanies() {
  const pagina = await api<Page<PendingCompany>>("/backoffice/companies", {
    method: "GET",
    auth: true,
  });

  // A fila e de pagina unica no painel: o tamanho padrao da API basta, e
  // paginar aqui viria com a spec que trouxer volume para a fila.
  return pagina.content;
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

/**
 * Array, nao pagina: a spec 14 paginou as duas filas -- empresas e apoio --,
 * nao o catalogo de planos. O numero de pacotes nao cresce como fila.
 */
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

/** Empresas aprovadas, com o plano vigente de cada uma. */
export async function getCompanyPlans() {
  const pagina = await api<Page<CompanyPlan>>("/backoffice/companies/planos", {
    method: "GET",
    auth: true,
  });

  return pagina.content;
}

/**
 * O impacto vem do servidor, não de conta feita aqui.
 *
 * A tela que calcula o próprio aviso erra quando alguém publica entre o
 * carregamento da lista e a confirmação.
 */
export async function getImpactoDoPlano(companyId: number, planId: number) {
  return api<ImpactoDoPlano>(
    `/backoffice/companies/${companyId}/plano/impacto?planId=${planId}`,
    { method: "GET", auth: true },
  );
}

export async function liberarPlano(companyId: number, planId: number) {
  return api<unknown>(`/backoffice/companies/${companyId}/plano`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ planId }),
  });
}
