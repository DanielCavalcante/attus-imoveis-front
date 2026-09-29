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
  const onCapa = vi.fn();

  render(
    <CampoDeImagem
      valor={[]}
      capa={0}
      onChange={onChange}
      onCapa={onCapa}
      onEnviando={onEnviando}
      {...props}
    />,
  );

  return { onChange, onEnviando, onCapa };
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

    const entrada = screen.getByLabelText(/fotos do imóvel/i);

    expect(entrada).toHaveAttribute("type", "file");
    expect(entrada).toHaveAttribute("accept", "image/jpeg,image/png,image/webp");
  });

  // ---------- C3: a previa ----------

  it("C3 - a previa local aparece antes de o envio terminar", async () => {
    let responder: (v: unknown) => void = () => {};

    enviarImagem.mockReturnValue(
      new Promise((resolve) => {
        responder = resolve;
      }),
    );

    montar();

    await userEvent.upload(
      screen.getByLabelText(/fotos do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    // O ponto da prévia local é esse: a pessoa confere a foto sem esperar o
    // upload. Depois de enviada, quem guarda a lista é o formulário.
    await waitFor(() =>
      expect(screen.getByAltText(/sendo enviada/i)).toHaveAttribute(
        "src",
        "blob:previa",
      ),
    );

    responder({ nome: "abc.png", caminho: "/api/v1/imagens/abc.png" });
  });

  it("C3 - foto ja guardada aparece como miniatura", () => {
    montar({ valor: ["/api/v1/imagens/abc.png"] });

    expect(screen.getByAltText(/foto 1 do imóvel/i)).toHaveAttribute(
      "src",
      "http://localhost:8080/api/v1/imagens/abc.png",
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
      screen.getByLabelText(/fotos do imóvel/i),
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
      screen.getByLabelText(/fotos do imóvel/i),
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
      screen.getByLabelText(/fotos do imóvel/i),
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
      screen.getByLabelText(/fotos do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Formato não aceito.",
    );

    // Nenhuma miniatura fica: deixá-la daria a impressão de que a foto entrou.
    expect(screen.queryByAltText(/foto 1 do imóvel/i)).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  // ---------- C8: o que vai para o anuncio ----------

  it("C8 - publicar usa o caminho devolvido pelo servidor", async () => {
    const { onChange } = montar();

    await userEvent.upload(
      screen.getByLabelText(/fotos do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(["/api/v1/imagens/abc.png"]),
    );
  });

  // ---------- spec 35, C1 a C5: conjunto e capa ----------

  it("C1 (spec 35) - o campo aceita mais de um arquivo", () => {
    montar();

    expect(screen.getByLabelText(/fotos do imóvel/i)).toHaveAttribute("multiple");
  });

  it("C2 (spec 35) - as fotos aparecem como miniaturas, na ordem", () => {
    montar({ valor: ["/api/v1/imagens/a.png", "/api/v1/imagens/b.png"] });

    const miniaturas = screen.getAllByAltText(/foto \d do imóvel/i);

    expect(miniaturas).toHaveLength(2);
    expect(miniaturas[0]).toHaveAttribute(
      "src",
      "http://localhost:8080/api/v1/imagens/a.png",
    );
  });

  it("C3 e C4 (spec 35) - da para eleger a capa, e ela fica marcada", async () => {
    const { onCapa } = montar({
      valor: ["/api/v1/imagens/a.png", "/api/v1/imagens/b.png"],
      capa: 0,
    });

    // A que já é capa se anuncia como tal; a outra oferece virar.
    expect(screen.getByRole("button", { name: "Capa" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /usar como capa/i }),
    );

    expect(onCapa).toHaveBeenCalledWith(1);
  });

  it("C5 (spec 35) - da para tirar uma foto do conjunto", async () => {
    const { onChange } = montar({
      valor: ["/api/v1/imagens/a.png", "/api/v1/imagens/b.png"],
      capa: 0,
    });

    await userEvent.click(screen.getByRole("button", { name: /remover foto 2/i }));

    expect(onChange).toHaveBeenCalledWith(["/api/v1/imagens/a.png"]);
  });

  it("C5 (spec 35) - remover a capa devolve a capa para a primeira", async () => {
    const { onCapa } = montar({
      valor: ["/api/v1/imagens/a.png", "/api/v1/imagens/b.png"],
      capa: 1,
    });

    await userEvent.click(screen.getByRole("button", { name: /remover foto 2/i }));

    // A capa não pode apontar para uma foto que saiu.
    expect(onCapa).toHaveBeenCalledWith(0);
  });

  it("C10 (spec 34) - passar do teto e recusado antes do envio", async () => {
    montar({ valor: ["/api/v1/imagens/a.png"], maximo: 1 });

    await userEvent.upload(
      screen.getByLabelText(/fotos do imóvel/i),
      arquivo("casa.png", "image/png"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(/no máximo 1 foto/i);
    expect(enviarImagem).not.toHaveBeenCalled();
  });

  // ---------- C10: acessibilidade ----------

  it("C10 (spec 33) - o campo tem rotulo associado", () => {
    montar();

    const entrada = screen.getByLabelText(/fotos do imóvel/i);

    expect(entrada.id).toBeTruthy();
    expect(document.querySelector(`label[for="${entrada.id}"]`)).not.toBeNull();
  });

  // ---------- C12: o anuncio antigo ----------

  it("C12 - valor antigo, com endereco externo, continua sendo mostrado", () => {
    montar({ valor: ["https://images.unsplash.com/antigo.jpg"] });

    expect(screen.getByAltText(/foto 1 do imóvel/i)).toHaveAttribute(
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
