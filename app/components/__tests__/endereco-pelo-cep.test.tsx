import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getMyQuota = vi.fn();
const getEndereco = vi.fn();
const getBairros = vi.fn();
const getCidades = vi.fn();

vi.mock("@/app/services/announcements-me.service", () => ({
  getMyQuota: () => getMyQuota(),
  getMyAnnouncements: vi.fn(),
  inativarAnuncio: vi.fn(),
  reativarAnuncio: vi.fn(),
  excluirAnuncio: vi.fn(),
}));

vi.mock("@/app/services/enderecos.service", () => ({
  getEndereco: (...args: unknown[]) => getEndereco(...args),
}));

vi.mock("@/app/services/locations.service", () => ({
  getBairros: (...a: unknown[]) => getBairros(...a),
  getCidades: () => getCidades(),
}));

vi.mock("@/app/services/announcement-create.service", () => ({
  createAnnouncement: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock("@/app/services/company.service", () => ({
  getMyCompany: vi.fn().mockResolvedValue({}),
  updateMyCompany: vi.fn(),
}));

vi.mock("@/app/contexts/auth-context", () => ({
  useAuth: () => ({
    user: { id: 1, email: "imob@t.dev", accountType: "PJ" },
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const Anuncie = (await import("@/app/anuncie/page")).default;

const MANAIRA = {
  cep: "58038000",
  logradouro: "Avenida João Maurício",
  bairro: "Manaíra",
  cidade: "João Pessoa",
  uf: "PB",
};

async function abrir() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <Anuncie />
    </QueryClientProvider>,
  );

  await screen.findByRole("heading", { name: "Criar anúncio", level: 1 });
}

describe("endereço preenchido pelo CEP (spec 38)", () => {
  beforeEach(() => {
    getMyQuota.mockReset();
    getEndereco.mockReset();
    getBairros.mockReset();
    getCidades.mockReset();

    getMyQuota.mockResolvedValue({
      ilimitado: true,
      limite: null,
      usados: 0,
      restantes: null,
      podePublicar: true,
      motivo: null,
    });

    getCidades.mockResolvedValue([]);
    getBairros.mockResolvedValue([]);
    getEndereco.mockResolvedValue(MANAIRA);
  });

  // ---------- C1 a C3: o gatilho e o preenchimento ----------

  it("C1 e C3 - CEP completo busca e preenche os quatro campos", async () => {
    await abrir();

    await userEvent.type(screen.getByLabelText("CEP"), "58038-000");

    await waitFor(() => expect(getEndereco).toHaveBeenCalledWith("58038000"));

    await waitFor(() => {
      expect(screen.getByLabelText("Rua")).toHaveValue("Avenida João Maurício");
      expect(screen.getByLabelText("Bairro")).toHaveValue("Manaíra");
      expect(screen.getByLabelText("Cidade")).toHaveValue("João Pessoa");
      expect(screen.getByLabelText("Estado")).toHaveValue("PB");
    });
  });

  it("C2 - CEP incompleto não dispara consulta", async () => {
    await abrir();

    await userEvent.type(screen.getByLabelText("CEP"), "5803");

    expect(getEndereco).not.toHaveBeenCalled();
  });

  // ---------- C4 e C5: o que a tela diz ----------

  it("C4 - enquanto busca, a tela sinaliza", async () => {
    let responder: (v: unknown) => void = () => {};

    getEndereco.mockReturnValue(
      new Promise((resolve) => {
        responder = resolve;
      }),
    );

    await abrir();

    await userEvent.type(screen.getByLabelText("CEP"), "58038-000");

    expect(await screen.findByText(/buscando o endereço/i)).toBeInTheDocument();

    responder(MANAIRA);
  });

  it("C5 - CEP que não existe avisa e não limpa o que estava", async () => {
    getEndereco.mockRejectedValue(new Error("CEP 99999999 não encontrado"));

    await abrir();

    const cidade = screen.getByLabelText("Cidade");

    await userEvent.type(cidade, "Recife");
    await userEvent.type(screen.getByLabelText("CEP"), "99999-999");

    expect(await screen.findByText(/não encontramos esse cep/i)).toBeInTheDocument();

    // O que a pessoa digitou continua lá.
    expect(cidade).toHaveValue("Recife");
  });

  // ---------- C6 e C7: quem manda é quem digita ----------

  it("C6 - com a consulta falhando, o endereço continua editável", async () => {
    getEndereco.mockRejectedValue(new Error("indisponível"));

    await abrir();

    await userEvent.type(screen.getByLabelText("CEP"), "58038-000");
    await screen.findByText(/não encontramos esse cep/i);

    const rua = screen.getByLabelText("Rua");

    await userEvent.type(rua, "Rua digitada à mão");

    expect(rua).toHaveValue("Rua digitada à mão");
    expect(rua).toBeEnabled();
  });

  it("C7 - correção feita depois não é sobrescrita", async () => {
    await abrir();

    await userEvent.type(screen.getByLabelText("CEP"), "58038-000");

    await waitFor(() =>
      expect(screen.getByLabelText("Rua")).toHaveValue("Avenida João Maurício"),
    );

    const rua = screen.getByLabelText("Rua");

    await userEvent.clear(rua);
    await userEvent.type(rua, "Avenida João Maurício, bloco B");

    // Nenhuma segunda consulta acontece, então nada reescreve o que ela
    // corrigiu: quem conhece o endereço é quem mora nele.
    await new Promise((r) => setTimeout(r, 300));

    expect(rua).toHaveValue("Avenida João Maurício, bloco B");
    expect(getEndereco).toHaveBeenCalledTimes(1);
  });

  // ---------- C8: não perguntar duas vezes ----------

  it("C8 - o mesmo CEP não dispara uma segunda consulta", async () => {
    await abrir();

    const cep = screen.getByLabelText("CEP");

    await userEvent.type(cep, "58038-000");
    await waitFor(() => expect(getEndereco).toHaveBeenCalledTimes(1));

    await userEvent.clear(cep);
    await userEvent.type(cep, "58038-000");

    await new Promise((r) => setTimeout(r, 300));

    expect(getEndereco).toHaveBeenCalledTimes(1);
  });

  // ---------- C9: acessibilidade ----------

  it("C9 - o estado da busca é anunciado a leitor de tela", async () => {
    await abrir();

    const aviso = document.getElementById("estado-do-cep");

    expect(aviso).toHaveAttribute("role", "status");
    expect(screen.getByLabelText("CEP")).toHaveAttribute(
      "aria-describedby",
      "estado-do-cep",
    );
  });
});
