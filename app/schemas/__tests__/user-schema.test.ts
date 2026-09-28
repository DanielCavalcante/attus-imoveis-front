import { describe, expect, it } from "vitest";

import { userSchema } from "../user";

const base = {
  accountType: "PJ" as const,
  fullname: "Horizonte Imoveis",
  email: "contato@horizonte.dev",
  phone: "81933334444",
  password: "Senha123",
  confirmPassword: "Senha123",
};

describe("schema de cadastro (spec 03)", () => {
  it("C7 - pessoa juridica sem cnpj e reprovada, apontando o campo", () => {
    const result = userSchema.safeParse(base);

    expect(result.success).toBe(false);

    const caminhos = result.success
      ? []
      : result.error.issues.map((issue) => issue.path.join("."));

    expect(caminhos).toContain("cnpj");
  });

  it("C7 - pessoa juridica com cnpj em branco tambem e reprovada", () => {
    const result = userSchema.safeParse({ ...base, cnpj: "   " });

    expect(result.success).toBe(false);
  });

  it("C8 - pessoa fisica sem cnpj e aprovada", () => {
    const result = userSchema.safeParse({ ...base, accountType: "PF" });

    expect(result.success).toBe(true);
  });
});
