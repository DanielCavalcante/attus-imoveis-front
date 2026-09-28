import { z } from "zod";

/**
 * Números chegam do input via valueAsNumber/setValueAs no register, como já
 * acontece no formulário de anúncio. z.coerce quebraria o tipo de entrada que
 * o resolver do react-hook-form espera.
 */
export const planSchema = z.object({
  nome: z.string().min(1, "Nome do plano é obrigatório"),
  descricao: z.string().optional(),
  precoMensal: z
    .number("Informe um preço")
    .nonnegative("Preço não pode ser negativo"),
  /** Ausente significa ilimitado — o backend guarda nulo. */
  limiteAnuncios: z
    .number()
    .int("Limite deve ser inteiro")
    .nonnegative("Limite não pode ser negativo")
    .optional(),
});

export type PlanFormData = z.infer<typeof planSchema>;
