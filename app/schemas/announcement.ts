import { z } from "zod";

/**
 * As regras do formulário de anúncio, espelhando o contrato do servidor.
 *
 * Todo campo de texto aqui era `min(N, "… é obrigatório")`, e isso junta duas
 * coisas diferentes numa mensagem só: campo vazio e valor curto demais liam
 * igual. Foi assim que `state`, com `min(3)`, disse "Estado é obrigatório"
 * para quem tinha digitado `PB` — a sigla de duas letras que o próprio
 * placeholder do campo pede.
 *
 * Os limites vêm do backend (`AnnouncementCreateDTO`), e não de um palpite
 * mais apertado: front que inventa regra própria recusa o que o servidor
 * aceitaria, e quem preenche não tem como descobrir por quê.
 */
export const announcementSchema = z.object({
  id: z.number().optional(),

  title: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .max(120, "Título deve ter no máximo 120 caracteres"),

  description: z.string().optional(),

  city: z
    .string()
    .trim()
    .min(1, "Cidade é obrigatória")
    .max(40, "Cidade deve ter no máximo 40 caracteres"),

  /**
   * O bairro que quem anuncia informa.
   *
   * Opcional porque a spec 19 decidiu que bairro é recorte de busca, não dado
   * essencial do imóvel, e não bloqueia publicação. O servidor deriva do CEP
   * quando vem vazio -- mas derivar depende de serviço de terceiro, e é por
   * isso que o campo existe.
   */
  neighborhood: z
    .string()
    .trim()
    .max(60, "Bairro deve ter no máximo 60 caracteres")
    .optional(),

  /** Duas letras bastam: é a sigla, e é o que o card imprime. */
  state: z
    .string()
    .trim()
    .min(1, "Estado é obrigatório")
    .max(20, "Estado deve ter no máximo 20 caracteres"),

  /** A capa, espelhada pelo servidor. Continua aqui para a listagem e o card. */
  image: z.string().min(1, "A foto do imóvel é obrigatória"),

  /** As fotos, na ordem em que aparecem. */
  imagens: z.array(z.string()).optional(),

  /** Qual das fotos é a capa. Ausente significa a primeira. */
  capa: z.number().optional(),

  street: z
    .string()
    .trim()
    .min(1, "Rua é obrigatória")
    .max(80, "Rua deve ter no máximo 80 caracteres"),

  streetNumber: z.number(),

  /** Mesmo formato do servidor: 8 dígitos, com ou sem o hífen. */
  cep: z
    .string()
    .trim()
    .min(1, "CEP é obrigatório")
    .regex(/^\d{5}-?\d{3}$/, "CEP deve ter 8 dígitos, como 58038-000"),

  complement: z.string().optional(),
  propertyType: z.enum(["HOUSE", "APARTMENT", "CONDOMINIUM", "LAND"]),
  reason: z.enum(["SALE", "RENT"]),
  rooms: z.number(),
  bathRooms: z.number(),
  area: z.number(),
  price: z.number(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
