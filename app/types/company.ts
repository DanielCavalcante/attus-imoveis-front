import { CompanyFormData } from "../schemas/company";
import type { AnalysisStatus } from "./backoffice";

export type Company = CompanyFormData & {
  id: number;
  cnpj: string;
  dossieCompleto: boolean;
  /** Estado da análise de confiabilidade: desde a spec 28, é ele que libera anunciar. */
  analysisStatus: AnalysisStatus;
  rejectionReason: string | null;
};
