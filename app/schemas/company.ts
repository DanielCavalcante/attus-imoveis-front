import { z } from "zod";

/**
 * Todo campo obrigatório aqui é campo que a análise de confiabilidade consulta.
 * Complemento é o único dispensável — endereço sem complemento existe.
 */
export const companySchema = z.object({
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  nomeFantasia: z.string().min(1, "Nome fantasia é obrigatório"),
  creciNumero: z.string().min(1, "Número do CRECI é obrigatório"),
  creciUf: z.string().length(2, "UF do CRECI deve ter 2 letras"),
  responsavelNome: z.string().min(1, "Nome do responsável é obrigatório"),
  responsavelCpf: z.string().min(1, "CPF do responsável é obrigatório"),
  telefoneComercial: z.string().min(1, "Telefone comercial é obrigatório"),
  emailComercial: z.email("E-mail comercial inválido"),
  cep: z.string().min(1, "CEP é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 letras"),
});

export type CompanyFormData = z.infer<typeof companySchema>;
