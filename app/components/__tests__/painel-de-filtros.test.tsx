import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getCidades = vi.fn();
const getBairros = vi.fn();

vi.mock("@/app/services/locations.service", () => ({
  getCidades: (...args: unknown[]) => getCidades(...args),
  getBairros: (...args: unknown[]) => getBairros(...args),
}));

const { PainelDeFiltros, FILTROS_VAZIOS } = await import(
  "../painel-de-filtros"
);

function montar(filtros = FILTROS_VAZIOS) {
  const aplicar = vi.fn();
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={cliente}>
      <PainelDeFiltros filtros={filtros} onAplicar={aplicar} />
    </QueryClientProvider>,
  );

  return aplicar;
}

describe("painel de filtros (spec 27)", () => {
  beforeEach(() => {
    getCidades.mockReset();
    getBairros.mockReset();

    getCidades.mockResolvedValue(["João Pessoa", "Recife"]);
    getBairros.mockResolvedValue(["Manaíra", "Bessa"]);
  });

  it("C3 a C6 - o painel tem cidade, bairro, tipo e faixa de preco", () => {
    montar();

    expect(screen.getByLabelText("CIDADE")).toBeInTheDocument();
    expect(screen.getByLabelText("BAIRRO")).toBeInTheDocument();
    expect(screen.getByLabelText("TIPO")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço mínimo")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço máximo")).toBeInTheDocument();
  });

  it("C7 - aplicar entrega os filtros escolhidos", async () => {
    const usuario = userEvent.setup();
    const aplicar = montar();

    await usuario.type(screen.getByLabelText("Preço máximo"), "500000");
    await usuario.selectOptions(screen.getByLabelText("TIPO"), "APARTMENT");
    await usuario.click(screen.getByRole("button", { name: /aplicar/i }));

    expect(aplicar).toHaveBeenCalledWith(
      expect.objectContaining({ maxPrice: "500000", type: "APARTMENT" }),
    );
  });

  it("C9 - os filtros da URL chegam preenchidos no painel", () => {
    montar({
      ...FILTROS_VAZIOS,
      city: "João Pessoa",
      type: "HOUSE",
      minPrice: "300000",
    });

    expect(screen.getByLabelText("CIDADE")).toHaveValue("João Pessoa");
    expect(screen.getByLabelText("TIPO")).toHaveValue("HOUSE");
    expect(screen.getByLabelText("Preço mínimo")).toHaveValue(300000);
  });

  it("C11 - limpar zera todos os filtros de uma vez", async () => {
    const usuario = userEvent.setup();
    const aplicar = montar({ ...FILTROS_VAZIOS, city: "Recife", type: "LAND" });

    await usuario.click(screen.getByRole("button", { name: "Limpar filtros" }));

    expect(aplicar).toHaveBeenCalledWith(FILTROS_VAZIOS);
  });

  it("C15 - faixa invertida e impedida antes de virar consulta", async () => {
    const usuario = userEvent.setup();
    const aplicar = montar();

    await usuario.type(screen.getByLabelText("Preço mínimo"), "900000");
    await usuario.type(screen.getByLabelText("Preço máximo"), "100000");

    expect(screen.getByRole("alert")).toHaveTextContent(/mínimo está acima/i);

    const botao = screen.getByRole("button", { name: /aplicar/i });

    expect(botao).toBeDisabled();
    expect(aplicar).not.toHaveBeenCalled();
  });

  it("trocar a cidade invalida o bairro escolhido", async () => {
    const usuario = userEvent.setup();

    montar({ ...FILTROS_VAZIOS, city: "João Pessoa", neighborhood: "Manaíra" });

    await waitFor(() => expect(getBairros).toHaveBeenCalled());

    const cidade = screen.getByLabelText("CIDADE");

    await usuario.clear(cidade);
    await usuario.type(cidade, "Recife");

    expect(screen.getByLabelText("BAIRRO")).toHaveValue("");
  });

  it("C13 - cada controle tem rotulo associado", () => {
    montar();

    for (const id of [
      "filtro-cidade",
      "filtro-bairro",
      "filtro-tipo",
      "filtro-preco-min",
      "filtro-preco-max",
    ]) {
      expect(document.getElementById(id)).toBeInTheDocument();
      expect(
        document.querySelector(`label[for="${id}"]`),
      ).toBeInTheDocument();
    }
  });
});
