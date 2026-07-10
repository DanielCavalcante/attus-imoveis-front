import { z } from "zod";

export const RESULTS_PATH = "/imoveis";

export const searchPayloadSchema = z.object({
  purpose: z.enum(["RENT", "BUY"], {
    message: "Selecione uma finalidade válida (alugar ou comprar).",
  }),
  propertyTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de imóvel."),
});

export type PropertySearchPayload = z.infer<typeof searchPayloadSchema>;


export function buildPropertySearchUrl(payload: PropertySearchPayload): string {
  const params = new URLSearchParams();
  params.set("purpose", payload.purpose);
  
  params.set("propertyTypes", payload.propertyTypes.join(","));

  return `${RESULTS_PATH}?${params.toString()}`;
}