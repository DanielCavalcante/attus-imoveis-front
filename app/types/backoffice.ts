export type AnalysisStatus =
  | "NAO_ENVIADO"
  | "EM_ANALISE"
  | "APROVADA"
  | "REPROVADA";

export type PendingCompany = {
  id: number;
  cnpj: string;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  creciNumero: string | null;
  creciUf: string | null;
  responsavelNome: string | null;
  emailComercial: string | null;
  analysisStatus: AnalysisStatus;
  reviewedAt: string | null;
};

export type Plan = {
  id: number;
  nome: string;
  descricao: string | null;
  precoMensal: number;
  limiteAnuncios: number | null;
  anunciosIlimitados: boolean;
  ativo: boolean;
};

/** Linha da tela de liberação de plano (spec 31). */
export type CompanyPlan = {
  companyId: number;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  cnpj: string;
  planoNome: string | null;
  limiteAnuncios: number | null;
  anunciosNoAr: number;
};

/** O que a troca de plano causaria, medido pelo servidor. */
export type ImpactoDoPlano = {
  anunciosNoAr: number;
  planoAtual: string | null;
  limiteAtual: number | null;
  planoDestino: string;
  limiteDestino: number | null;
  excede: boolean;
};
