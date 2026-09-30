import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const empurrar = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: empurrar }),
}));

const getCidades = vi.fn();
const getBairros = vi.fn();

vi.mock("@/app/services/locations.service", () => ({
  getCidades: (...args: unknown[]) => getCidades(...args),
  getBairros: (...args: unknown[]) => getBairros(...args),
}));

const { default: BuscaHero } = await import("../home-busc");

const BAIRROS_JP = ["Manaíra", "Bessa"];
const BAIRROS_RECIFE = ["Boa Viagem", "Espinheiro"];

function montar() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={cliente}>
      <BuscaHero />
    </QueryClientProvider>,
  );
}

describe("busca da home com sugestoes (spec 21)", () => {
  beforeEach(() => {
    empurrar.mockClear();
    getCidades.mockReset();
    getBairros.mockReset();

    getCidades.mockResolvedValue(["João Pessoa", "Recife"]);
    getBairros.mockImplementation(async (cidade: string) =>
      cidade === "João Pessoa" ? BAIRROS_JP : BAIRROS_RECIFE,
    );
  });

  it("C2 - com Joao Pessoa na cidade, as sugestoes de bairro sao as de Joao Pessoa", async () => {
    const usuario = userEvent.setup();

    montar();

    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("João Pessoa"));

    await usuario.click(screen.getByLabelText("BAIRRO"));

    expect(
      await screen.findByRole("option", { name: "Manaíra" }),
    ).toBeInTheDocument();
  });

  it("C3 - trocar a cidade substitui as sugestoes de bairro", async () => {
    const usuario = userEvent.setup();

    montar();

    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("João Pessoa"));

    const cidade = screen.getByLabelText("CIDADE");

    await usuario.clear(cidade);
    await usuario.type(cidade, "Recife");

    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("Recife"));

    await usuario.click(screen.getByLabelText("BAIRRO"));

    expect(
      await screen.findByRole("option", { name: "Boa Viagem" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Manaíra" }),
    ).not.toBeInTheDocument();
  });

  it("C11 - digitar nao dispara uma requisicao de sugestao por tecla", async () => {
    const usuario = userEvent.setup();

    montar();

    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("João Pessoa"));

    getBairros.mockClear();

    const cidade = screen.getByLabelText("CIDADE");

    await usuario.clear(cidade);
    await usuario.type(cidade, "Campina Grande");

    await waitFor(() =>
      expect(getBairros).toHaveBeenCalledWith("Campina Grande"),
    );

    // Quinze teclas; com uma requisicao por tecla seriam quinze chamadas.
    expect(getBairros.mock.calls.length).toBeLessThan(5);
  });

  it("C12 - sem cidade, bairros nao sao pedidos", async () => {
    const usuario = userEvent.setup();

    montar();

    await waitFor(() => expect(getBairros).toHaveBeenCalled());

    getBairros.mockClear();

    await usuario.clear(screen.getByLabelText("CIDADE"));

    await waitFor(() =>
      expect(screen.getByLabelText("CIDADE")).toHaveValue(""),
    );

    expect(getBairros).not.toHaveBeenCalled();
  });

  it("C5 - cidade digitada fora das sugestoes vai para a consulta assim mesmo", async () => {
    const usuario = userEvent.setup();

    montar();

    const cidade = screen.getByLabelText("CIDADE");

    await usuario.clear(cidade);
    await usuario.type(cidade, "Cidade Que Nao Existe");
    await usuario.click(screen.getByRole("button", { name: /buscar/i }));

    expect(empurrar).toHaveBeenCalledWith(
      expect.stringContaining("city=Cidade+Que+Nao+Existe"),
    );
  });
});
