import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getAnnouncementDetail = vi.fn();
const updateAnnouncement = vi.fn();
const getBairros = vi.fn();
const getCidades = vi.fn();

vi.mock("@/app/services/announcements-detail.service", () => ({
  getAnnouncementDetail: (...a: unknown[]) => getAnnouncementDetail(...a),
}));

vi.mock("@/app/services/announcement-update.service", () => ({
  updateAnnouncement: (...a: unknown[]) => updateAnnouncement(...a),
}));

vi.mock("@/app/services/locations.service", () => ({
  getBairros: (...a: unknown[]) => getBairros(...a),
  getCidades: () => getCidades(),
}));

vi.mock("@/app/services/enderecos.service", () => ({
  getEndereco: vi.fn(),
}));

vi.mock("@/app/contexts/auth-context", () => ({
  useAuth: () => ({
    user: { id: 1, email: "imob@t.dev", accountType: "PJ" },
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const push = vi.fn();
const erro = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push }),
  useParams: () => ({ id: "7" }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: (m: string) => erro(m) },
}));

const Edicao = (await import("@/app/anuncie/edit/[id]/page")).default;

const ANUNCIO = {
  id: 7,
  title: "Apartamento no Bessa",
  description: "Três quartos",
  // A API devolve `null` para campo não preenchido, e o schema aceita
  // `undefined` -- não `null`. Com o valor cru, o formulário reprovava num
  // campo que a pessoa nem vê e o botão não fazia nada.
  complement: null,
  city: "João Pessoa",
  neighborhood: "Bessa",
  state: "PB",
  image: "/api/v1/imagens/capa.png",
  imagens: ["/api/v1/imagens/outra.png", "/api/v1/imagens/capa.png"],
  street: "Av. Gov. Flávio Ribeiro",
  streetNumber: 100,
  cep: "58036-000",
  propertyType: "APARTMENT",
  reason: "SALE",
  rooms: 3,
  bathRooms: 2,
  area: 95,
  price: 520000,
};

function montar() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <Edicao />
    </QueryClientProvider>,
  );
}

describe("edição é a mesma tela da criação (spec 39)", () => {
  beforeEach(() => {
    getAnnouncementDetail.mockReset();
    updateAnnouncement.mockReset();
    push.mockReset();
    erro.mockReset();

    getBairros.mockResolvedValue([]);
    getCidades.mockResolvedValue([]);
    getAnnouncementDetail.mockResolvedValue(ANUNCIO);
    updateAnnouncement.mockResolvedValue(ANUNCIO);
  });

  // ---------- C1, C3, C11: a tela ----------

  it("C1 - abre com os campos preenchidos com os dados do anúncio", async () => {
    montar();

    await waitFor(() =>
      expect(screen.getByLabelText("Título do anúncio")).toHaveValue("Apartamento no Bessa"),
    );

    expect(screen.getByLabelText("Cidade")).toHaveValue("João Pessoa");
    expect(screen.getByLabelText("Bairro")).toHaveValue("Bessa");
    expect(screen.getByLabelText("Estado")).toHaveValue("PB");
    expect(screen.getByLabelText("CEP")).toHaveValue("58036-000");
  });

  it("C3 - tem os mesmos campos da criação", async () => {
    montar();

    await screen.findByLabelText("Título do anúncio");

    // Os campos que a criação tem, um a um: é isso que "mesma tela" significa.
    for (const rotulo of [
      "Título do anúncio",
      "Cidade",
      "Bairro",
      "Estado",
      "CEP",
      "Rua",
      "Fotos do imóvel",
    ]) {
      expect(screen.getByLabelText(rotulo)).toBeInTheDocument();
    }
  });

  it("C11 - o botão diz salvar, e não publicar", async () => {
    montar();

    await screen.findByLabelText("Título do anúncio");

    expect(
      screen.getByRole("button", { name: /salvar alterações/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /publicar anúncio/i }),
    ).not.toBeInTheDocument();
  });

  // ---------- C4: nada de formulário vazio ----------

  it("C4 - enquanto carrega, o formulário não aparece vazio", async () => {
    let responder: (v: unknown) => void = () => {};

    getAnnouncementDetail.mockReturnValue(
      new Promise((resolve) => {
        responder = resolve;
      }),
    );

    montar();

    expect(screen.queryByLabelText("Título do anúncio")).not.toBeInTheDocument();

    responder(ANUNCIO);

    await waitFor(() =>
      expect(screen.getByLabelText("Título do anúncio")).toHaveValue("Apartamento no Bessa"),
    );
  });

  // ---------- C2, C5, C9: salvar ----------

  it("C2 e C5 - salvar envia as alterações e mantém a foto", async () => {
    montar();

    const titulo = await screen.findByLabelText("Título do anúncio");

    await userEvent.clear(titulo);
    await userEvent.type(titulo, "Apartamento reformado no Bessa");

    await userEvent.click(
      screen.getByRole("button", { name: /salvar alterações/i }),
    );

    await waitFor(() => expect(updateAnnouncement).toHaveBeenCalled());

    const [id, enviado] = updateAnnouncement.mock.calls[0];

    expect(id).toBe(7);
    expect(enviado.title).toBe("Apartamento reformado no Bessa");

    // A foto é o único campo que não se digita: sem trazê-la, salvar sem tocar
    // em nada apagaria a capa.
    expect(enviado.image).toBe("/api/v1/imagens/capa.png");
    expect(enviado.imagens).toEqual(ANUNCIO.imagens);
  });

  it("C9 - salvo, volta para a lista", async () => {
    montar();

    await screen.findByLabelText("Título do anúncio");

    await userEvent.click(
      screen.getByRole("button", { name: /salvar alterações/i }),
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/portal/anuncios"));
  });

  // ---------- C10: falha ao salvar ----------

  it("C10 - falha ao salvar mantém o que a pessoa digitou", async () => {
    updateAnnouncement.mockRejectedValue(new Error("Limite de anúncios atingido"));

    montar();

    const titulo = await screen.findByLabelText("Título do anúncio");

    await userEvent.clear(titulo);
    await userEvent.type(titulo, "Título que não pode sumir");

    await userEvent.click(
      screen.getByRole("button", { name: /salvar alterações/i }),
    );

    await waitFor(() =>
      expect(erro).toHaveBeenCalledWith("Limite de anúncios atingido"),
    );

    expect(titulo).toHaveValue("Título que não pode sumir");
    expect(push).not.toHaveBeenCalled();
  });

  // ---------- C7 e C8: o que não é seu, e o que não existe ----------

  it("C7 e C8 - anúncio de outra conta ou inexistente não vira formulário", async () => {
    getAnnouncementDetail.mockRejectedValue(new Error("Anúncio não encontrado"));

    montar();

    expect(
      await screen.findByRole("heading", { name: /anúncio não encontrado/i }),
    ).toBeInTheDocument();

    expect(screen.queryByLabelText("Título do anúncio")).not.toBeInTheDocument();
  });
});
