import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CampoComSugestoes } from "../campo-com-sugestoes";

const BAIRROS = ["Manaíra", "Bessa", "Tambaú", "Centro"];

function Campo({
  sugestoes = BAIRROS,
  inicial = "",
  aoSubmeter,
}: {
  sugestoes?: string[];
  inicial?: string;
  aoSubmeter?: (valor: string) => void;
}) {
  const [valor, setValor] = useState(inicial);

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        aoSubmeter?.(valor);
      }}
    >
      <CampoComSugestoes
        id="bairro"
        rotulo="BAIRRO"
        valor={valor}
        onChange={setValor}
        sugestoes={sugestoes}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

describe("campo com sugestoes (spec 21)", () => {
  it("C1 - digitar lista as sugestoes que vieram do servidor", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    await usuario.type(screen.getByRole("combobox"), "man");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Manaíra" })).toBeInTheDocument();
  });

  it("C4 - escolher uma sugestao preenche o campo com o valor escolhido", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    const campo = screen.getByRole("combobox");

    await usuario.type(campo, "bes");
    await usuario.click(screen.getByRole("option", { name: "Bessa" }));

    expect(campo).toHaveValue("Bessa");
  });

  it("C5 - valor fora das sugestoes e enviado do mesmo jeito", async () => {
    const usuario = userEvent.setup();
    const aoSubmeter = vi.fn();

    render(<Campo aoSubmeter={aoSubmeter} />);

    await usuario.type(screen.getByRole("combobox"), "Bairro Inexistente");
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(aoSubmeter).toHaveBeenCalledWith("Bairro Inexistente");
  });

  it("C6 - as sugestoes sao percorriveis pelas setas", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    await usuario.click(screen.getByRole("combobox"));
    await usuario.keyboard("{ArrowDown}");

    expect(screen.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await usuario.keyboard("{ArrowDown}");

    expect(screen.getAllByRole("option")[1]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("C7 - Enter escolhe a sugestao em destaque", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    const campo = screen.getByRole("combobox");

    await usuario.click(campo);
    await usuario.keyboard("{ArrowDown}{Enter}");

    expect(campo).toHaveValue("Manaíra");
  });

  it("C8 - Esc fecha a lista sem alterar o que foi digitado", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    const campo = screen.getByRole("combobox");

    await usuario.type(campo, "cen");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await usuario.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(campo).toHaveValue("cen");
  });

  it("C9 - o campo informa se a lista esta aberta ou fechada", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    const campo = screen.getByRole("combobox");

    expect(campo).toHaveAttribute("aria-expanded", "false");

    await usuario.click(campo);

    expect(campo).toHaveAttribute("aria-expanded", "true");
  });

  it("C10 - o campo informa qual sugestao esta em destaque", async () => {
    const usuario = userEvent.setup();

    render(<Campo />);

    const campo = screen.getByRole("combobox");

    await usuario.click(campo);
    await usuario.keyboard("{ArrowDown}");

    const emDestaque = screen.getAllByRole("option")[0];

    expect(campo).toHaveAttribute("aria-activedescendant", emDestaque.id);
  });

  it("C13 - lista de sugestoes vazia nao impede submeter o digitado", async () => {
    const usuario = userEvent.setup();
    const aoSubmeter = vi.fn();

    // Falha ao carregar chega aqui como lista vazia.
    render(<Campo sugestoes={[]} aoSubmeter={aoSubmeter} />);

    await usuario.type(screen.getByRole("combobox"), "Manaíra");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(aoSubmeter).toHaveBeenCalledWith("Manaíra");
  });
});
