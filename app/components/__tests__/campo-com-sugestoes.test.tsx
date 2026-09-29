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

function CampoEstrito({
  sugestoes = BAIRROS,
  aoSubmeter,
  desabilitado = false,
}: {
  sugestoes?: string[];
  aoSubmeter?: (valor: string) => void;
  desabilitado?: boolean;
}) {
  const [valor, setValor] = useState("");

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
        estrito
        desabilitado={desabilitado}
        motivoDesabilitado="Escolha a cidade primeiro"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

describe("seletor estrito de bairro (spec 26)", () => {
  it("C1 - abre a lista sem que nada seja digitado", async () => {
    const usuario = userEvent.setup();

    render(<CampoEstrito />);

    await usuario.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(BAIRROS.length);
  });

  it("C2 - digitar filtra as opcoes", async () => {
    const usuario = userEvent.setup();

    render(<CampoEstrito />);

    await usuario.type(screen.getByRole("combobox"), "bes");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Bessa" })).toBeInTheDocument();
  });

  it("C3 - opcao escolhida e enviada na consulta", async () => {
    const usuario = userEvent.setup();
    const aoSubmeter = vi.fn();

    render(<CampoEstrito aoSubmeter={aoSubmeter} />);

    await usuario.type(screen.getByRole("combobox"), "tam");
    await usuario.click(screen.getByRole("option", { name: "Tambaú" }));
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(aoSubmeter).toHaveBeenCalledWith("Tambaú");
  });

  it("C4 - texto sem correspondencia NAO e enviado", async () => {
    const usuario = userEvent.setup();
    const aoSubmeter = vi.fn();

    render(<CampoEstrito aoSubmeter={aoSubmeter} />);

    await usuario.type(screen.getByRole("combobox"), "Bairro Que Nao Existe");
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(aoSubmeter).toHaveBeenCalledWith("");
  });

  it("C5 - sem correspondencia, a lista diz que nenhum bairro casa", async () => {
    const usuario = userEvent.setup();

    render(<CampoEstrito />);

    await usuario.type(screen.getByRole("combobox"), "zzz");

    expect(screen.getByRole("listbox")).toHaveTextContent(
      /nenhum bairro com esse nome/i,
    );
  });

  it("C6 e C7 - limpar a escolha zera o valor enviado", async () => {
    const usuario = userEvent.setup();
    const aoSubmeter = vi.fn();

    render(<CampoEstrito aoSubmeter={aoSubmeter} />);

    await usuario.type(screen.getByRole("combobox"), "bes");
    await usuario.click(screen.getByRole("option", { name: "Bessa" }));

    await usuario.click(screen.getByRole("button", { name: /limpar bairro/i }));

    expect(screen.getByRole("combobox")).toHaveValue("");

    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(aoSubmeter).toHaveBeenCalledWith("");
  });

  it("C8 - a opcao escolhida fica visivel no campo", async () => {
    const usuario = userEvent.setup();

    render(<CampoEstrito />);

    await usuario.type(screen.getByRole("combobox"), "man");
    await usuario.click(screen.getByRole("option", { name: "Manaíra" }));

    expect(screen.getByRole("combobox")).toHaveValue("Manaíra");
  });

  it("C9 - teclado percorre e escolhe", async () => {
    const usuario = userEvent.setup();
    const aoSubmeter = vi.fn();

    render(<CampoEstrito aoSubmeter={aoSubmeter} />);

    await usuario.click(screen.getByRole("combobox"));
    await usuario.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(screen.getByRole("combobox")).toHaveValue(BAIRROS[1]);

    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(aoSubmeter).toHaveBeenCalledWith(BAIRROS[1]);
  });

  it("C10 - o campo informa se a lista esta aberta", async () => {
    const usuario = userEvent.setup();

    render(<CampoEstrito />);

    const campo = screen.getByRole("combobox");

    expect(campo).toHaveAttribute("aria-expanded", "false");

    await usuario.click(campo);

    expect(campo).toHaveAttribute("aria-expanded", "true");
  });

  it("sem cidade, o campo fica inerte e diz por que", () => {
    render(<CampoEstrito desabilitado />);

    const campo = screen.getByRole("combobox");

    expect(campo).toBeDisabled();
    expect(campo).toHaveAttribute("placeholder", "Escolha a cidade primeiro");
  });
});
