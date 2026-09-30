import { describe, expect, it } from "vitest";

import { buildCreateUserPayload } from "../user.service";
import type { UserFormData } from "@/app/schemas/user";

const base: UserFormData = {
  accountType: "PF",
  fullname: "Marina Alves",
  email: "marina@t.dev",
  phone: "11988887777",
  password: "Senha123",
  confirmPassword: "Senha123",
};

describe("corpo do cadastro (spec 03)", () => {
  it("C4 - sempre envia accountType", () => {
    expect(buildCreateUserPayload(base)).toHaveProperty("accountType", "PF");

    expect(
      buildCreateUserPayload({ ...base, accountType: "PJ", cnpj: "123" }),
    ).toHaveProperty("accountType", "PJ");
  });

  it("C5 - pessoa juridica envia cnpj preenchido", () => {
    const payload = buildCreateUserPayload({
      ...base,
      accountType: "PJ",
      cnpj: "  12345678000190  ",
    });

    expect(payload).toHaveProperty("cnpj", "12345678000190");
  });

  it("C6 - pessoa fisica nao envia cnpj, nem string vazia", () => {
    const payload = buildCreateUserPayload({ ...base, cnpj: "" });

    expect(payload).not.toHaveProperty("cnpj");
  });
});
