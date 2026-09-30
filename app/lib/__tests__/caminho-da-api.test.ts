import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const fetchOriginal = globalThis.fetch;

const rota = join("app", "api", "v1", "[...caminho]", "route.ts");

const { GET, POST } = await import("@/app/api/v1/[...caminho]/route");
const { API_DO_NAVEGADOR, ORIGEM_DAS_IMAGENS, API_INTERNA } = await import(
  "@/app/lib/ambiente"
);

function contexto(...partes: string[]) {
  return { params: Promise.resolve({ caminho: partes }) };
}

describe("o site como único ponto de entrada (spec 42)", () => {
  beforeEach(() => {
    globalThis.fetch = fetchOriginal;
  });

  // ---------- C1 e C2: o que atravessa ----------

  it("C1 - o corpo e o status da API voltam como vieram", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ total: 3 }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    const resposta = await GET(
      new Request("http://site/api/v1/announcements"),
      contexto("announcements"),
    );

    expect(resposta.status).toBe(201);
    expect(await resposta.json()).toEqual({ total: 3 });
  });

  it("C2 - método, consulta e cabeçalhos chegam à API", async () => {
    const espiao = vi.fn(async () => new Response("{}", { status: 200 }));

    globalThis.fetch = espiao as unknown as typeof fetch;

    await POST(
      new Request("http://site/api/v1/announcements?size=5", {
        method: "POST",
        headers: { Authorization: "Bearer token-da-pessoa" },
      }),
      contexto("announcements"),
    );

    const [destino, opcoes] = espiao.mock.calls[0] as [string, RequestInit];

    expect(destino).toBe(`${API_INTERNA}/announcements?size=5`);
    expect(opcoes.method).toBe("POST");
    // C3: o token da pessoa é repassado — a API continua sabendo quem fala.
    expect((opcoes.headers as Headers).get("Authorization")).toBe(
      "Bearer token-da-pessoa",
    );
  });

  it("a origem do navegador não atravessa o caminho", async () => {
    const espiao = vi.fn(async () => new Response("{}", { status: 200 }));

    globalThis.fetch = espiao as unknown as typeof fetch;

    await POST(
      new Request("http://site/api/v1/users", {
        method: "POST",
        headers: { Origin: "https://site.exemplo", Referer: "https://site.exemplo/x" },
      }),
      contexto("users"),
    );

    const [, opcoes] = espiao.mock.calls[0] as [string, RequestInit];
    const cabecalhos = opcoes.headers as Headers;

    // Este salto é servidor para servidor: não há origem cruzada nele. Com o
    // `Origin` repassado, a API recusava com "Invalid CORS request" -- e em
    // produção, onde a lista de origens é vazia de propósito, isso derrubava o
    // cadastro de conta.
    expect(cabecalhos.get("Origin")).toBeNull();
    expect(cabecalhos.get("Referer")).toBeNull();
  });

  // ---------- C6: os cabeçalhos da imagem ----------

  it("C6 - Content-Type e nosniff sobrevivem ao caminho", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("bytes", {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "X-Content-Type-Options": "nosniff",
        },
      }),
    ) as typeof fetch;

    const resposta = await GET(
      new Request("http://site/api/v1/imagens/a.png"),
      contexto("imagens", "a.png"),
    );

    expect(resposta.headers.get("Content-Type")).toBe("image/png");
    expect(resposta.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  // ---------- C7: em fluxo ----------

  it("C7 - o corpo é repassado em fluxo, não carregado inteiro", () => {
    const codigo = readFileSync(rota, "utf8");

    // `resposta.body` é o fluxo; `await resposta.arrayBuffer()` carregaria os
    // 5 MB de cada foto na memória do site, multiplicados por quem estiver
    // olhando fotos ao mesmo tempo.
    expect(codigo).toContain("new Response(resposta.body");
    expect(codigo).not.toContain("arrayBuffer()");
    expect(codigo).not.toContain("await resposta.text()");
  });

  // ---------- C8: a API fora do ar ----------

  it("C8 - API fora do ar vira erro legível, e não página de erro", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    }) as typeof fetch;

    const resposta = await GET(
      new Request("http://site/api/v1/announcements"),
      contexto("announcements"),
    );

    expect(resposta.status).toBe(503);
    expect((await resposta.json()).message).toMatch(/indisponível/i);
  });

  // ---------- C9: o destino é só o configurado ----------

  it("C9 - o caminho não alcança outro host", async () => {
    const espiao = vi.fn(async () => new Response("{}", { status: 200 }));

    globalThis.fetch = espiao as unknown as typeof fetch;

    // Tentativa de sair do destino pelo próprio caminho.
    await GET(
      new Request("http://site/api/v1/x"),
      contexto("..", "..", "evil.example.com"),
    );

    const [destino] = espiao.mock.calls[0] as [string];

    expect(destino.startsWith(API_INTERNA)).toBe(true);
    expect(destino).not.toContain("evil.example.com/");
  });

  // ---------- C12 e C13: a origem ----------

  it("C12 - o endereço do navegador é relativo, sem host da API", () => {
    expect(API_DO_NAVEGADOR).toBe("/api/v1");
    expect(API_DO_NAVEGADOR).not.toContain("http");
  });

  it("C13 - as fotos vêm da própria origem", async () => {
    const { urlDaImagem } = await import("@/app/lib/imagem");

    expect(ORIGEM_DAS_IMAGENS).toBe("");
    expect(urlDaImagem("/api/v1/imagens/a.png")).toBe("/api/v1/imagens/a.png");

    // Anúncio anterior à spec 32 guarda endereço absoluto, e continua absoluto.
    expect(urlDaImagem("https://images.unsplash.com/x.jpg")).toBe(
      "https://images.unsplash.com/x.jpg",
    );
  });

  // ---------- C4 e C10: a credencial ----------

  it("C4 e C10 - sem a variável não há credencial, e o caminho funciona assim", async () => {
    const { credencialDeServico } = await import(
      "@/app/lib/credencial-de-servico"
    );

    // Em desenvolvimento não há servidor de metadados: `docker compose up`
    // continua funcionando pelo mesmo caminho, sem credencial nenhuma.
    delete process.env.ATTUS_CREDENCIAL_DE_SERVICO;

    expect(await credencialDeServico(API_INTERNA)).toBeNull();
  });

  it("C4 - a credencial nunca é devolvida ao navegador", () => {
    const codigo = readFileSync(rota, "utf8");

    // Ela entra no pedido para a API; os cabeçalhos que voltam são os da
    // resposta, e nenhum deles é construído a partir dela.
    const depoisDaResposta = codigo.slice(codigo.indexOf("const deVolta"));

    expect(depoisDaResposta).not.toContain("credencial");
  });
});
