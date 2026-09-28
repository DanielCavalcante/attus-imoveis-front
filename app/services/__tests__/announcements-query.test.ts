import { describe, expect, it } from "vitest";

import { buildAnnouncementsQuery } from "../announcements.service";

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
