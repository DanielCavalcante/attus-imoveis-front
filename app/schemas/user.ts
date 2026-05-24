import { z } from "zod";

export const userSchema = z
  .object({
    fullname: z.string().min(3, "Nome obrigatório"),
    email: z.email("Email inválido"),
    phone: z.string().min(11, "Telefone inválido"),
    password: z.string().min(6, "Senha muito curta"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;
