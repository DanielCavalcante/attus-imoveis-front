import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const enviarImagem = vi.fn();

vi.mock("@/app/services/imagens.service", async () => {
  const real = await vi.importActual<
    typeof import("@/app/services/imagens.service")
  >("@/app/services/imagens.service");

  return {
    ...real,
    enviarImagem: (...args: unknown[]) => enviarImagem(...args),
  };
});

const { CampoDeImagem } = await import("../campo-de-imagem");
const { urlDaImagem } = await import("@/app/lib/imagem");

function arquivo(nome: string, tipo: string, tamanho = 1024) {
  const file = new File(["x".repeat(16)], nome, { type: tipo });

  // File não deixa definir `size` pelo construtor com precisão; definir aqui
  // é o que permite provar a recusa por tamanho sem alocar 6 MB no teste.
  Object.defineProperty(file, "size", { value: tamanho });

  return file;
}

function montar(props: Partial<Parameters<typeof CampoDeImagem>[0]> = {}) {
  const onChange = vi.fn();
  const onEnviando = vi.fn();

  render(
    <CampoDeImagem onChange={onChange} onEnviando={onEnviando} {...props} />,
  );

  return { onChange, onEnviando };
}

describe("campo de envio de imagem (spec 33)", () => {
  beforeEach(() => {
    enviarImagem.mockReset();
    enviarImagem.mockResolvedValue({
      nome: "abc.png",
      caminho: "/api/v1/imagens/abc.png",
    });

    // jsdom não implementa createObjectURL.
    globalThis.URL.createObjectURL = vi.fn(() => "blob:previa");
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  // ---------- C1 e C2: o campo ----------

  it("C1 - nao existe campo de texto para endereco de imagem", () => {
    montar();

    expect(screen.queryByPlaceholderText(/https?:/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/link da imagem/i)).not.toBeInTheDocument();
  });

  it("C2 - o campo aceita arquivo do aparelho", () => {
    montar();

    const entrada = screen.getByLabelText(/foto do imóvel/i);

    expect(entrada).toHaveAttribute("type", "file");
    expect(entrada).toHaveAttribute("accept", "image/jpeg,image/png,image/webp");
  });

  // ---------- C3: a previa ----------

  it("C3 - escolhido o arquivo, a previa mostra a imagem", async () => {
    montar();

    await userEvent.upload(
      screen.getByLabelText(/foto do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    await waitFor(() =>
      expect(screen.getByAltText(/prévia da foto/i)).toHaveAttribute(
        "src",
        "blob:previa",
      ),
    );
  });

  // ---------- C4 e C5: o que a tela recusa antes de gastar rede ----------

  it("C4 - tipo nao aceito e recusado, nomeando os aceitos", async () => {
    const { onChange } = montar();

    // `applyAccept: false` porque o proprio atributo `accept` ja barraria o
    // arquivo no seletor -- e o que este teste mede e a guarda do codigo, que
    // existe para o que escapa dele (arrastar e soltar, seletor do sistema
    // que ignora o filtro).
    await userEvent.upload(
      screen.getByLabelText(/foto do imóvel/i),
      arquivo("contrato.pdf", "application/pdf"),
      { applyAccept: false },
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /JPEG, PNG ou WebP/i,
    );

    // Recusa antes do envio: a rede de quem anuncia não é gasta à toa.
    expect(enviarImagem).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("C5 - arquivo acima do limite e recusado, nomeando o limite", async () => {
    montar();

    await userEvent.upload(
      screen.getByLabelText(/foto do imóvel/i),
      arquivo("enorme.png", "image/png", 6 * 1024 * 1024),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(/5 MB/);
    expect(enviarImagem).not.toHaveBeenCalled();
  });

  // ---------- C6 e C7: envio em curso e falha ----------

  it("C6 - enquanto o envio corre, o formulario e avisado", async () => {
    let responder: (v: unknown) => void = () => {};

    enviarImagem.mockReturnValue(
      new Promise((resolve) => {
        responder = resolve;
      }),
    );

    const { onEnviando } = montar();

    await userEvent.upload(
      screen.getByLabelText(/foto do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    await waitFor(() => expect(onEnviando).toHaveBeenCalledWith(true));

    responder({ nome: "abc.png", caminho: "/api/v1/imagens/abc.png" });

    await waitFor(() => expect(onEnviando).toHaveBeenLastCalledWith(false));
  });

  it("C7 - falha do servidor vira mensagem legivel", async () => {
    enviarImagem.mockRejectedValue(new Error("Formato não aceito."));

    const { onChange } = montar();

    await userEvent.upload(
      screen.getByLabelText(/foto do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Formato não aceito.",
    );

    // A prévia some: deixá-la daria a impressão de que a foto entrou.
    expect(screen.queryByAltText(/prévia da foto/i)).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  // ---------- C8: o que vai para o anuncio ----------

  it("C8 - publicar usa o caminho devolvido pelo servidor", async () => {
    const { onChange } = montar();

    await userEvent.upload(
      screen.getByLabelText(/foto do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith("/api/v1/imagens/abc.png"),
    );
  });

  // ---------- C10: acessibilidade ----------

  it("C10 - o campo tem rotulo associado", () => {
    montar();

    const entrada = screen.getByLabelText(/foto do imóvel/i);

    expect(entrada.id).toBeTruthy();
    expect(document.querySelector(`label[for="${entrada.id}"]`)).not.toBeNull();
  });

  // ---------- C12: o anuncio antigo ----------

  it("C12 - valor antigo, com endereco externo, continua sendo mostrado", () => {
    montar({ valor: "https://images.unsplash.com/antigo.jpg" });

    expect(screen.getByAltText(/prévia da foto/i)).toHaveAttribute(
      "src",
      "https://images.unsplash.com/antigo.jpg",
    );
  });

  it("C12 - caminho de imagem enviada vira endereco absoluto da API", () => {
    expect(urlDaImagem("/api/v1/imagens/abc.png")).toBe(
      "http://localhost:8080/api/v1/imagens/abc.png",
    );

    // O que já era absoluto continua absoluto: derrubar os antigos seria
    // apagar a foto de quem já anuncia.
    expect(urlDaImagem("https://images.unsplash.com/antigo.jpg")).toBe(
      "https://images.unsplash.com/antigo.jpg",
    );
  });
});
