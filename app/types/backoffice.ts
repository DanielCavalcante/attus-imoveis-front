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
