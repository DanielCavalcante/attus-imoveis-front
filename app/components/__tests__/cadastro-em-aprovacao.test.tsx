import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { AnalysisStatus } from "@/app/types/backoffice";

const getMyCompany = vi.fn();
const usuario = vi.fn();

vi.mock("@/app/services/company.service", () => ({
  getMyCompany: () => getMyCompany(),
  updateMyCompany: vi.fn(),
}));

vi.mock("@/app/contexts/auth-context", () => ({
  useAuth: () => usuario(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const { CadastroEmAprovacao } = await import("../cadastro-em-aprovacao");
const Anuncie = (await import("@/app/anuncie/page")).default;

function montarTela(status: AnalysisStatus, motivo: string | null = null) {
  render(<CadastroEmAprovacao status={status} motivo={motivo} />);
}

function montarPagina() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={cliente}>
      <Anuncie />
    </QueryClientProvider>,
  );
}

describe("tela de cadastro em aprovacao (spec 29)", () => {
  beforeEach(() => {
    getMyCompany.mockReset();
    usuario.mockReset();

    usuario.mockReturnValue({
      user: { id: 1, email: "imob@t.dev", accountType: "PJ" },
      loading: false,
    });
  });

  // ---------- C1, C6 a C8: quem vê o quê ----------

  it("C1 - PJ nao aprovada ve a tela no lugar do formulario", async () => {
    getMyCompany.mockResolvedValue({ analysisStatus: "EM_ANALISE" });

    montarPagina();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /em aprovação/i, level: 1 }),
      ).toBeInTheDocument(),
    );

    expect(screen.queryByLabelText(/título/i)).not.toBeInTheDocument();
  });

  it("C6 - pessoa fisica ve o formulario", async () => {
    usuario.mockReturnValue({
      user: { id: 2, email: "pf@t.dev", accountType: "PF" },
      loading: false,
    });

    montarPagina();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Criar anúncio", level: 1 }),
      ).toBeInTheDocument(),
    );

    // A conta PF nem consulta a empresa: ela não tem uma.
    expect(getMyCompany).not.toHaveBeenCalled();
  });

  it("C7 - PJ aprovada ve o formulario", async () => {
    getMyCompany.mockResolvedValue({ analysisStatus: "APROVADA" });

    montarPagina();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Criar anúncio", level: 1 }),
      ).toBeInTheDocument(),
    );
  });

  it("C8 - o formulario nao aparece antes da resposta", async () => {
    let responder: (empresa: unknown) => void = () => {};

    getMyCompany.mockReturnValue(
      new Promise((resolve) => {
        responder = resolve;
      }),
    );

    montarPagina();

    // Enquanto a resposta não chega, nada de formulário: mostrá-lo e recolhê-lo
    // faria quem já começou a digitar perder o que digitou.
    expect(
      screen.queryByRole("heading", { name: "Criar anúncio" }),
    ).not.toBeInTheDocument();

    responder({ analysisStatus: "APROVADA" });

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Criar anúncio", level: 1 }),
      ).toBeInTheDocument(),
    );
  });

  // ---------- C2 a C5: o que cada estado diz ----------

  it("C2 - a tela mostra um canal de contato clicavel", () => {
    montarTela("EM_ANALISE");

    const contato = screen.getByRole("link", { name: /@/ });

    expect(contato).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  it("C3 - nao enviado leva a completar o dossie", () => {
    montarTela("NAO_ENVIADO");

    expect(
      screen.getByRole("link", { name: /completar cadastro/i }),
    ).toHaveAttribute("href", "/portal/empresa");
  });

  it("C4 - em analise nao oferece acao que nao existe", () => {
    montarTela("EM_ANALISE");

    expect(
      screen.getByRole("heading", { name: /em aprovação/i }),
    ).toBeInTheDocument();

    // Só o contato: não há nada que a pessoa possa fazer para acelerar.
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("C5 - reprovada mostra o motivo registrado", () => {
    montarTela("REPROVADA", "CRECI não confere com a razão social.");

    expect(
      screen.getByText("CRECI não confere com a razão social."),
    ).toBeInTheDocument();
  });

  // ---------- C10 e C11: o acabamento ----------

  it("C11 - o titulo da tela e o h1 da pagina", () => {
    montarTela("EM_ANALISE");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("C10 - a tela nao tem rotulo solto acima do titulo", () => {
    const { container } = render(<CadastroEmAprovacao status="EM_ANALISE" />);

    const h1 = container.querySelector("h1");
    const antes = h1?.previousElementSibling;

    // O que vem antes do título é o ícone, não um kicker de texto.
    expect(antes?.tagName.toLowerCase()).toBe("svg");
  });
});
