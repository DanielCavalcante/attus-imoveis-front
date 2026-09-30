import { describe, expect, it } from "vitest";

import { announcementSchema } from "../announcement";

/** Um anúncio válido, para cada teste mexer só no campo que investiga. */
const VALIDO = {
  title: "Apartamento no Bessa",
  description: "Três quartos",
  city: "João Pessoa",
  state: "PB",
  image: "/api/v1/imagens/abc.png",
  street: "Av. Gov. Flávio Ribeiro",
  streetNumber: 100,
  cep: "58036-000",
  propertyType: "APARTMENT" as const,
  reason: "SALE" as const,
  rooms: 3,
  bathRooms: 2,
  area: 95,
  price: 520000,
};

function erroDe(campo: string, valor: unknown) {
  const r = announcementSchema.safeParse({ ...VALIDO, [campo]: valor });

  if (r.success) return null;

  return r.error.issues.find((i) => i.path[0] === campo)?.message ?? null;
}

describe("regras do formulário de anúncio", () => {
  it("a sigla de duas letras do estado é aceita", () => {
    // O placeholder do campo pede exatamente isto. Com `min(3)`, "PB" era
    // recusado com a mensagem de campo vazio.
    expect(erroDe("state", "PB")).toBeNull();
    expect(erroDe("state", "SP")).toBeNull();
  });

  it("o nome do estado por extenso também é aceito", () => {
    expect(erroDe("state", "Paraíba")).toBeNull();
  });

  it("estado vazio é recusado, e aí a mensagem é verdadeira", () => {
    expect(erroDe("state", "")).toBe("Estado é obrigatório");
    expect(erroDe("state", "   ")).toBe("Estado é obrigatório");
  });

  it("os limites são os do servidor, não mais apertados", () => {
    expect(erroDe("state", "x".repeat(21))).toMatch(/no máximo 20/);
    expect(erroDe("city", "x".repeat(41))).toMatch(/no máximo 40/);
    expect(erroDe("title", "x".repeat(121))).toMatch(/no máximo 120/);
  });

  it("CEP incompleto diz que está incompleto, não que falta", () => {
    expect(erroDe("cep", "5803")).toMatch(/8 dígitos/);
    expect(erroDe("cep", "")).toBe("CEP é obrigatório");
  });

  it("CEP com e sem hífen valem, como no servidor", () => {
    expect(erroDe("cep", "58036-000")).toBeNull();
    expect(erroDe("cep", "58036000")).toBeNull();
  });

  it("anúncio sem foto é recusado", () => {
    expect(erroDe("image", "")).toBe("A foto do imóvel é obrigatória");
  });
});
