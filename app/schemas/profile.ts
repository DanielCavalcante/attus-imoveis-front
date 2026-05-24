import z from "zod";

export const profileSchema = z.object({
  id: z.int(),
  fullname: z.string().min(3, "Nome obrigatório"),
  email: z.email("E-mail inválido"),
  phone: z.string().min(8, "Telefone obrigatório"),
  photo: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
