import { z } from "zod";

export const announcementSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Título é obrigatório"),
  description: z.string().optional(),
  city: z.string().min(3, "Cidade é obrigatório"),
  state: z.string().min(3, "Estado é obrigatório"),
  image: z.string().min(3, "Imagem é obrigatório"),
  street: z.string().min(3, "Rua obrigatória"),
  streetNumber: z.number(),
  cep: z.string().min(8, "CEP obrigatório"),
  complement: z.string().optional(),
  propertyType: z.enum(["HOUSE", "APARTMENT", "CONDOMINIUM", "LAND"]),
  reason: z.enum(["SALE", "RENT"]),
  rooms: z.number(),
  bathRooms: z.number(),
  area: z.number(),
  price: z.number(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
