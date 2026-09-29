import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getCompanyPlans = vi.fn();
const getAllPlans = vi.fn();
const getImpactoDoPlano = vi.fn();
const liberarPlano = vi.fn();
const erro = vi.fn();

vi.mock("@/app/services/backoffice.service", () => ({
  getCompanyPlans: () => getCompanyPlans(),
  getAllPlans: () => getAllPlans(),
  getImpactoDoPlano: (...args: unknown[]) => getImpactoDoPlano(...args),
  liberarPlano: (...args: unknown[]) => liberarPlano(...args),
  getPendingCompanies: vi.fn(),
  approveCompany: vi.fn(),
  rejectCompany: vi.fn(),
  createPlan: vi.fn(),
  deactivatePlan: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: (m: string) => erro(m) },
}));

vi.mock("@/app/components/internal-route", () => ({
  InternalRoute: ({ children }: { children: React.ReactNode }) => children,
}));

const Pagina = (await import("@/app/portal/backoffice/planos-das-empresas/page"))
  .default;

const AURORA = {
  companyId: 7,
  razaoSocial: "Imobiliária Aurora LTDA",
  nomeFantasia: "Aurora Imóveis",
  cnpj: "11222333000181",
  planoNome: "Cinco anúncios",
  limiteAnuncios: 5,
  anunciosNoAr: 4,
};

const SEM_PLANO = {
  ...AURORA,
  companyId: 8,
  nomeFantasia: "Boreal Imóveis",
  planoNome: null,
  limiteAnuncios: null,
  anunciosNoAr: 0,
};

const PLANOS = [
  {
    id: 2,
    nome: "Dois anúncios",
    descricao: null,
    precoMensal: 99,
    limiteAnuncios: 2,
    anunciosIlimitados: false,
    ativo: true,
  },
  {
    id: 9,
    nome: "Plano fora de linha",
    descricao: null,
    precoMensal: 49,
    limiteAnuncios: 1,
    anunciosIlimitados: false,
    ativo: false,
  },
];

function montar() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={cliente}>
      <Pagina />
    </QueryClientProvider>,
  );
}

describe("planos das empresas (spec 31)", () => {
  beforeEach(() => {
    getCompanyPlans.mockReset();
    getAllPlans.mockReset();
    getImpactoDoPlano.mockReset();
    liberarPlano.mockReset();
    erro.mockReset();

    getCompanyPlans.mockResolvedValue([AURORA, SEM_PLANO]);
    getAllPlans.mockResolvedValue(PLANOS);
    getImpactoDoPlano.mockResolvedValue({
      anunciosNoAr: 4,
      planoAtual: "Cinco anúncios",
      limiteAtual: 5,
      planoDestino: "Dois anúncios",
      limiteDestino: 2,
      excede: true,
    });
    liberarPlano.mockResolvedValue(undefined);
  });

  it("C1 - lista as empresas aprovadas com o plano vigente", async () => {
    montar();

    expect(await screen.findByText("Aurora Imóveis")).toBeInTheDocument();
    expect(screen.getByText(/Cinco anúncios/)).toBeInTheDocument();

    // Empresa aprovada e ainda sem plano é o caso que a tela resolve.
    expect(screen.getByText("Boreal Imóveis")).toBeInTheDocument();
    expect(screen.getByText(/Sem plano/)).toBeInTheDocument();
  });

  it("C2 - mostra quantos anuncios a empresa tem no ar", async () => {
    montar();

    await screen.findByText("Aurora Imóveis");

    expect(screen.getByText(/4 anúncios no ar/)).toBeInTheDocument();
  });

  it("C3 - o seletor so oferece plano ativo", async () => {
    montar();

    const seletor = await screen.findByLabelText(
      /liberar plano para aurora imóveis/i,
    );

    expect(seletor).toHaveTextContent("Dois anúncios");
    expect(seletor).not.toHaveTextContent("Plano fora de linha");
  });

  it("C4 - escolher plano menor abre a confirmacao com o aviso", async () => {
    montar();

    const seletor = await screen.findByLabelText(
      /liberar plano para aurora imóveis/i,
    );

    await userEvent.selectOptions(seletor, "2");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /acima do novo limite/i,
    );
  });

  it("C8 - confirmada, a liberacao vai ao servidor e a lista recarrega", async () => {
    montar();

    const seletor = await screen.findByLabelText(
      /liberar plano para aurora imóveis/i,
    );

    await userEvent.selectOptions(seletor, "2");
    await userEvent.click(
      await screen.findByRole("button", { name: /liberar plano/i }),
    );

    await waitFor(() =>
      expect(liberarPlano).toHaveBeenCalledWith(7, 2),
    );

    // Duas buscas: a inicial e a que a invalidação disparou. Sem recarregar
    // a página.
    await waitFor(() => expect(getCompanyPlans).toHaveBeenCalledTimes(2));
  });

  it("C10 - recusa do servidor vira mensagem legivel", async () => {
    liberarPlano.mockRejectedValue(
      new Error("Plano desativado não pode ser liberado"),
    );

    montar();

    const seletor = await screen.findByLabelText(
      /liberar plano para aurora imóveis/i,
    );

    await userEvent.selectOptions(seletor, "2");
    await userEvent.click(
      await screen.findByRole("button", { name: /liberar plano/i }),
    );

    await waitFor(() =>
      expect(erro).toHaveBeenCalledWith("Plano desativado não pode ser liberado"),
    );
  });
});
