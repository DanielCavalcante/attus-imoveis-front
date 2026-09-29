import { describe, expect, it } from "vitest";

import { CIDADE_PADRAO } from "../cidade";

/**
 * A leitura da cidade a partir da URL, isolada da tela.
 *
 * Três estados e não dois, e é essa a parte que se perde numa releitura
 * distraída: ausente abre no padrão, vazio é o acervo inteiro, preenchido é a
 * cidade pedida.
 */
function cidadeDaUrl(query: string) {
  const cidade = new URLSearchParams(query).get("city");

  return cidade === null ? CIDADE_PADRAO : cidade;
}

describe("cidade padrao de /imoveis", () => {
  it("chegar sem filtro nenhum abre em Joao Pessoa", () => {
    expect(cidadeDaUrl("")).toBe("João Pessoa");
  });

  it("chegar por link de outra cidade respeita o link", () => {
    expect(cidadeDaUrl("city=Recife")).toBe("Recife");
  });

  it("cidade apagada de proposito nao volta para o padrao", () => {
    // É o que "Limpar filtros" produz. Sem esta distinção, o acervo inteiro
    // ficaria inalcançável.
    expect(cidadeDaUrl("city=")).toBe("");
  });

  it("outros filtros sem cidade ainda abrem no padrao", () => {
    expect(cidadeDaUrl("type=APARTMENT")).toBe("João Pessoa");
  });
});
