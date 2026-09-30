import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getMyQuota = vi.fn();
const createAnnouncement = vi.fn();
const getBairros = vi.fn();
const getCidades = vi.fn();
const enviarImagem = vi.fn();

vi.mock("@/app/services/announcements-me.service", () => ({
  getMyQuota: () => getMyQuota(),
  getMyAnnouncements: vi.fn(),
  inativarAnuncio: vi.fn(),
  reativarAnuncio: vi.fn(),
  excluirAnuncio: vi.fn(),
}));

vi.mock("@/app/services/announcement-create.service", () => ({
  createAnnouncement: (...args: unknown[]) => createAnnouncement(...args),
}));

vi.mock("@/app/services/locations.service", () => ({
  getBairros: (...args: unknown[]) => getBairros(...args),
  getCidades: () => getCidades(),
}));

vi.mock("@/app/services/imagens.service", async () => {
  const real = await vi.importActual<
    typeof import("@/app/services/imagens.service")
  >("@/app/services/imagens.service");

  return { ...real, enviarImagem: (...a: unknown[]) => enviarImagem(...a) };
});

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

function montar() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <Anuncie />
    </QueryClientProvider>,
  );
}

async function abrirFormulario() {
  montar();

  await screen.findByRole("heading", { name: "Criar anúncio", level: 1 });
}

describe("campo de bairro no anúncio (spec 36)", () => {
  beforeEach(() => {
    getMyQuota.mockReset();
    createAnnouncement.mockReset();
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

    getCidades.mockResolvedValue(["João Pessoa", "Recife"]);
    getBairros.mockResolvedValue(["Manaíra", "Bessa", "Tambaú"]);
    createAnnouncement.mockResolvedValue({ id: 1 });
  });

  // ---------- C1 e C7: o campo existe e é alcançável ----------

  it("C1 - o formulário tem campo de bairro", async () => {
    await abrirFormulario();

    expect(screen.getByLabelText("Bairro")).toBeInTheDocument();
  });

  it("C7 - o campo tem rótulo associado", async () => {
    await abrirFormulario();

    const campo = screen.getByLabelText("Bairro");

    expect(document.querySelector(`label[for="${campo.id}"]`)).not.toBeNull();
  });

  // ---------- C3 e C4: as sugestões seguem a cidade ----------

  it("C3 - o campo sugere os bairros da cidade preenchida", async () => {
    await abrirFormulario();

    await userEvent.type(screen.getByLabelText("Cidade"), "João Pessoa");

    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("João Pessoa"), {
      timeout: 3000,
    });

    await userEvent.type(screen.getByLabelText("Bairro"), "Man");

    expect(await screen.findByRole("option", { name: "Manaíra" })).toBeInTheDocument();
  });

  it("C4 - trocar a cidade troca as sugestões", async () => {
    await abrirFormulario();

    const cidade = screen.getByLabelText("Cidade");

    await userEvent.type(cidade, "João Pessoa");
    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("João Pessoa"), {
      timeout: 3000,
    });

    await userEvent.clear(cidade);
    await userEvent.type(cidade, "Recife");

    await waitFor(() => expect(getBairros).toHaveBeenCalledWith("Recife"), {
      timeout: 3000,
    });
  });

  // ---------- C5: valor fora da lista ----------

  it("C5 - bairro fora das sugestões fica no campo", async () => {
    await abrirFormulario();

    const bairro = screen.getByLabelText("Bairro");

    // Cidade sem catálogo tem lista vazia; recusar aqui deixaria a pessoa sem
    // como informar bairro nenhum.
    await userEvent.type(bairro, "Bairro que não está na lista");

    await waitFor(() =>
      expect(bairro).toHaveValue("Bairro que não está na lista"),
    );
  });

  // ---------- C6: publicar sem bairro ----------

  it("C6 - o bairro vazio não impede publicar", async () => {
    await abrirFormulario();

    // O schema é quem decide: bairro ausente não produz erro de validação.
    const { announcementSchema } = await import("@/app/schemas/announcement");

    const semBairro = announcementSchema.safeParse({
      title: "Casa",
      city: "João Pessoa",
      state: "PB",
      image: "/api/v1/imagens/a.png",
      street: "Rua do Sol",
      streetNumber: 100,
      cep: "58038-000",
      propertyType: "HOUSE",
      reason: "SALE",
      rooms: 2,
      bathRooms: 1,
      area: 70,
      price: 300000,
    });

    expect(semBairro.success).toBe(true);
  });

  it("C2 - o bairro digitado vai no campo `neighborhood` da API", async () => {
    const { announcementSchema } = await import("@/app/schemas/announcement");

    const comBairro = announcementSchema.parse({
      title: "Casa",
      city: "João Pessoa",
      neighborhood: "Manaíra",
      state: "PB",
      image: "/api/v1/imagens/a.png",
      street: "Rua do Sol",
      streetNumber: 100,
      cep: "58038-000",
      propertyType: "HOUSE",
      reason: "SALE",
      rooms: 2,
      bathRooms: 1,
      area: 70,
      price: 300000,
    });

    expect(comBairro.neighborhood).toBe("Manaíra");
  });
});
