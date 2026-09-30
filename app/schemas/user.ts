import { z } from "zod";

/** Literais idênticos ao enum Java com.example.demo.enums.AccountType. */
export const ACCOUNT_TYPES = ["PF", "PJ"] as const;

export const userSchema = z
  .object({
    accountType: z.enum(ACCOUNT_TYPES, "Escolha o tipo de conta"),
    fullname: z.string().min(3, "Nome obrigatório"),
    email: z.email("Email inválido"),
    phone: z.string().min(11, "Telefone inválido"),
    cnpj: z.string().optional(),
    password: z.string().min(6, "Senha muito curta"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => data.accountType !== "PJ" || !!data.cnpj?.trim(),
    {
      message: "CNPJ obrigatório para pessoa jurídica",
      path: ["cnpj"],
    },
  );

export type UserFormData = z.infer<typeof userSchema>;
export type AccountType = (typeof ACCOUNT_TYPES)[number];
