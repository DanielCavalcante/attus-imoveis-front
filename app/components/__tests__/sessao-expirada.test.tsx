import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getMyQuota = vi.fn();
const getMyAnnouncements = vi.fn();

vi.mock("@/app/services/announcements-me.service", () => ({
  getMyQuota: () => getMyQuota(),
  getMyAnnouncements: () => getMyAnnouncements(),
  inativarAnuncio: vi.fn(),
  reativarAnuncio: vi.fn(),
  excluirAnuncio: vi.fn(),
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

const { SessaoExpirada, ehSessaoExpirada } = await import("@/app/services/api");
const Anuncie = (await import("@/app/anuncie/page")).default;
const MeusAnuncios = (await import("@/app/portal/anuncios/page")).default;

/** Cliente com os mesmos padrões do QueryProvider de produção. */
function clienteDeProducao() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        retry: (tentativas: number, erro: unknown) =>
          !ehSessaoExpirada(erro) && tentativas < 3,
      },
    },
  });
}

function montar(Pagina: () => React.ReactNode) {
  render(
    <QueryClientProvider client={clienteDeProducao()}>
      <Pagina />
    </QueryClientProvider>,
  );
}

describe("sessão vencida não vira esqueleto nem mentira", () => {
  beforeEach(() => {
    getMyQuota.mockReset();
    getMyAnnouncements.mockReset();
  });

  it("sessão vencida não é repetida: insistir num 403 é esperar por nada", async () => {
    getMyQuota.mockRejectedValue(new SessaoExpirada());

    montar(Anuncie);

    await waitFor(() => expect(getMyQuota).toHaveBeenCalled());

    // Tempo de sobra para as três tentativas do padrão acontecerem.
    await new Promise((r) => setTimeout(r, 1500));

    expect(getMyQuota).toHaveBeenCalledTimes(1);
  });

  it("falha que não é de sessão continua sendo repetida", async () => {
    getMyQuota.mockRejectedValue(new Error("Erro 500 na requisição"));

    montar(Anuncie);

    await waitFor(() => expect(getMyQuota.mock.calls.length).toBeGreaterThan(1), {
      timeout: 4000,
    });
  });

  it("/anuncie mostra o formulário quando a quota falha, em vez de esqueleto", async () => {
    getMyQuota.mockRejectedValue(new SessaoExpirada());

    montar(Anuncie);

    // Quem decide se a publicação passa é o servidor; trancar a tela por uma
    // leitura que falhou impediria de anunciar quem tem todo o direito.
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Criar anúncio", level: 1 }),
      ).toBeInTheDocument(),
    );
  });

  it("Meus anúncios não diz que a conta não tem anúncios quando a lista falha", async () => {
    getMyAnnouncements.mockRejectedValue(new SessaoExpirada());
    getMyQuota.mockRejectedValue(new SessaoExpirada());

    montar(MeusAnuncios);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        /não foi possível carregar seus anúncios/i,
      ),
    );

    // A frase que aparecia para quem tinha 18 anúncios.
    expect(screen.queryByText(/você ainda não anunciou/i)).not.toBeInTheDocument();
  });

  it("o saldo não fica pulsando para sempre quando a quota falha", async () => {
    getMyAnnouncements.mockResolvedValue({ content: [] });
    getMyQuota.mockRejectedValue(new SessaoExpirada());

    const { container } = render(
      <QueryClientProvider client={clienteDeProducao()}>
        <MeusAnuncios />
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/não foi possível carregar o saldo/i),
      ).toBeInTheDocument(),
    );

    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(0);
  });
});
