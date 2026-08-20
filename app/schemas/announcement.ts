import { z } from "zod";

export const announcementSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Título é obrigatório"),
  description: z.string().optional(),
  city: z.string().min(3, "Cidade é obrigatório"),
  state: z.string().min(2, "Estado é obrigatório"),
  images: z.array(z.string()).min(1, "Imagem é obrigatório"),
  street: z.string().min(3, "Rua obrigatória"),
  streetNumber: z.number(),
  cep: z.string().min(8, "CEP obrigatório"),
  complement: z.string().optional(),
  propertyType: z.enum(["HOUSE", "APARTMENT", "CONDOMINIUM", "LAND"]),
  reason: z.enum(["SALE", "RENT"]),
  rooms: z.number(),
  bathRooms: z.number(),
  suites: z.number(),
  garageSpaces: z.number(),
  area: z.number(),
  totalArea: z.number(),
  price: z.number(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;

export const propertyTypeLabels: Record<
  AnnouncementFormData["propertyType"],
  string
> = {
  HOUSE: "Casa",
  APARTMENT: "Apartamento",
  CONDOMINIUM: "Condomínio",
  LAND: "Terreno",
};

export const reasonLabels: Record<AnnouncementFormData["reason"], string> = {
  SALE: "Venda",
  RENT: "Aluguel",
};
