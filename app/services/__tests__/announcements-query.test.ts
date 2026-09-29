import { describe, expect, it } from "vitest";

import { buildAnnouncementsQuery } from "../announcements.service";
import { TIPOS_DE_IMOVEL } from "../../lib/property";

describe("consulta da listagem (spec 17)", () => {
  it("C5 - o termo vai para a API", () => {
    expect(buildAnnouncementsQuery({ q: "cobertura" })).toContain("q=cobertura");
  });

  it("C5 - termo em branco nao e enviado", () => {
    expect(buildAnnouncementsQuery({ q: "   " })).toBe("");
  });

  it("C5 - o termo e aparado antes de ir", () => {
    expect(buildAnnouncementsQuery({ q: "  praia  " })).toContain("q=praia");
  });

  it("C8 - a ordenacao vai como sort", () => {
    expect(buildAnnouncementsQuery({ sort: "price,asc" })).toContain(
      "sort=price%2Casc",
    );
  });

  it("C6 - a pagina vai como page", () => {
    expect(buildAnnouncementsQuery({ page: 2 })).toContain("page=2");
  });

  it("sem nada, nao ha consulta", () => {
    expect(buildAnnouncementsQuery()).toBe("");
  });

  it("pagina zero e enviada, e nao confundida com ausencia", () => {
    expect(buildAnnouncementsQuery({ page: 0 })).toContain("page=0");
  });
});

describe("consulta da home (spec 20)", () => {
  it("C6 - cidade, bairro e tipo vao juntos para a consulta", () => {
    const consulta = buildAnnouncementsQuery({
      city: "João Pessoa",
      neighborhood: "Manaíra",
      type: "APARTMENT",
    });

    expect(consulta).toContain("city=Jo%C3%A3o+Pessoa");
    expect(consulta).toContain("neighborhood=Mana%C3%ADra");
    expect(consulta).toContain("type=APARTMENT");
  });

  it("C7 - so a cidade: bairro e tipo nao entram", () => {
    const consulta = buildAnnouncementsQuery({ city: "João Pessoa" });

    expect(consulta).toContain("city=Jo%C3%A3o+Pessoa");
    expect(consulta).not.toContain("neighborhood");
    expect(consulta).not.toContain("type");
  });

  it("C8 - qualquer tipo nao envia tipo", () => {
    const consulta = buildAnnouncementsQuery({
      city: "João Pessoa",
      type: undefined,
    });

    expect(consulta).not.toContain("type");
  });

  it("C9 - campos vazios nao viram filtro", () => {
    expect(buildAnnouncementsQuery({ city: "", neighborhood: "   " })).toBe("");
  });

  it("C10 - o valor do enum vai na consulta, nunca o rotulo", () => {
    const consulta = buildAnnouncementsQuery({ type: "CONDOMINIUM" });

    expect(consulta).toContain("type=CONDOMINIUM");
    expect(consulta).not.toContain("Condom");
  });
});

describe("os tipos oferecidos (spec 20)", () => {
  it("C5 - o seletor oferece apartamento, casa, condominio e terreno", () => {
    expect(TIPOS_DE_IMOVEL.map((t) => t.valor)).toEqual([
      "APARTMENT",
      "HOUSE",
      "CONDOMINIUM",
      "LAND",
    ]);
  });

  it("C10 - cada tipo carrega o rotulo separado do valor", () => {
    const apartamento = TIPOS_DE_IMOVEL.find((t) => t.valor === "APARTMENT");

    expect(apartamento?.rotulo).toBe("Apartamento");
  });
});
