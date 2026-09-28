import { api } from "../services/api";
import { User } from "../types/user";
import { UserFormData } from "@/app/schemas/user";

/**
 * Pessoa física não manda `cnpj`, nem vazio: a coluna é única no banco e trata
 * string vazia como valor, então duas contas PF colidiriam.
 */
export function buildCreateUserPayload(data: UserFormData) {
  const { cnpj, ...rest } = data;

  if (data.accountType !== "PJ") {
    return rest;
  }

  return { ...rest, cnpj: cnpj?.trim() };
}

export async function createUser(data: UserFormData) {
  return api<User>("/users", {
    method: "POST",
    body: JSON.stringify(buildCreateUserPayload(data)),
  });
}
