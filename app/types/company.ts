import { CompanyFormData } from "../schemas/company";

export type Company = CompanyFormData & {
  id: number;
  cnpj: string;
  dossieCompleto: boolean;
};
