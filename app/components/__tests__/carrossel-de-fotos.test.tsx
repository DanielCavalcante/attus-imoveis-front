import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CarrosselDeFotos } from "../carrossel-de-fotos";

const FOTOS = [
  "/api/v1/imagens/a.png",
  "/api/v1/imagens/b.png",
  "/api/v1/imagens/c.png",
];

function montar(fotos = FOTOS) {
  render(<CarrosselDeFotos fotos={fotos} titulo="Apartamento no Bessa" />);
}

describe("carrossel e tela cheia (spec 35)", () => {
  // ---------- C7 e C11: navegar, e quando nao ha o que navegar ----------

  it("C7 - o carrossel tem controles de avancar e voltar", () => {
    montar();

    expect(
      screen.getByRole("button", { name: /próximas fotos/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /fotos anteriores/i }),
    ).toBeInTheDocument();
  });

  it("C11 - com uma foto so, nao ha controles de navegacao", () => {
    montar(["/api/v1/imagens/unica.png"]);

    expect(
      screen.queryByRole("button", { name: /próximas fotos/i }),
    ).not.toBeInTheDocument();
  });

  it("C13 - sem fotos alem da capa, o carrossel nao aparece", () => {
    montar([]);

    expect(screen.queryByRole("heading", { name: /mais fotos/i })).toBeNull();
  });

  // ---------- C8 a C10, C12: a tela cheia ----------

  it("C8 - clicar numa foto abre a tela cheia", async () => {
    montar();

    await userEvent.click(screen.getAllByRole("button", { name: /ver foto \d+ em tela cheia/i })[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("C12 - a tela cheia e um dialogo com nome", async () => {
    montar();

    await userEvent.click(screen.getAllByRole("button", { name: /ver foto \d+ em tela cheia/i })[0]);

    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      /fotos de apartamento no bessa/i,
    );
  });

  it("C12 - o foco entra no dialogo ao abrir", async () => {
    montar();

    await userEvent.click(screen.getAllByRole("button", { name: /ver foto \d+ em tela cheia/i })[0]);

    // Sem isto, quem navega por teclado abre a foto e continua com o foco na
    // página atrás dela, sem saber onde está.
    expect(screen.getByRole("button", { name: /fechar fotos/i })).toHaveFocus();
  });

  it("C9 - Esc fecha a tela cheia", async () => {
    montar();

    await userEvent.click(screen.getAllByRole("button", { name: /ver foto \d+ em tela cheia/i })[0]);
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("C10 - as setas do teclado trocam de foto", async () => {
    montar();

    await userEvent.click(screen.getAllByRole("button", { name: /ver foto \d+ em tela cheia/i })[0]);

    expect(screen.getByText("1 de 3")).toBeInTheDocument();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("2 de 3")).toBeInTheDocument();

    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByText("1 de 3")).toBeInTheDocument();
  });

  it("C10 - a navegacao da a volta no fim da lista", async () => {
    montar();

    await userEvent.click(screen.getAllByRole("button", { name: /ver foto \d+ em tela cheia/i })[0]);

    await userEvent.keyboard("{ArrowLeft}");

    // Voltar da primeira leva à última, em vez de travar.
    expect(screen.getByText("3 de 3")).toBeInTheDocument();
  });

  // ---------- acessibilidade das fotos ----------

  it("cada foto tem texto alternativo que a situa", () => {
    montar();

    // A numeracao comeca em 2 porque a capa e a foto 1, e ela vive no topo da
    // pagina, fora do carrossel.
    expect(
      screen.getByAltText("Foto 2 de Apartamento no Bessa"),
    ).toBeInTheDocument();
  });
});
