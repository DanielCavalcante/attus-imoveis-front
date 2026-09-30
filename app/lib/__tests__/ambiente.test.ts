import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { API_INTERNA, ORIGEM_DAS_IMAGENS, SITE_URL } from "../ambiente";

/** Todo arquivo de `app/`, menos os testes. */
function arquivosDoApp(pasta = "app"): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);

    if (statSync(caminho).isDirectory()) {
      return nome === "__tests__" ? [] : arquivosDoApp(caminho);
    }

    return /\.(ts|tsx)$/.test(nome) ? [caminho] : [];
  });
}

describe("endereços do sistema (spec 41)", () => {
  // ---------- C1: um lugar só ----------

  it("C1 - nenhum endereço fixo fora de app/lib/ambiente.ts", () => {
    const culpados = arquivosDoApp()
      .filter((caminho) => !caminho.endsWith(join("lib", "ambiente.ts")))
      .filter((caminho) => {
        // Comentário que menciona `localhost` explicando uma decisão não é
        // endereço fixo; o que conta é o valor no código.
        const codigo = readFileSync(caminho, "utf8")
          .split("\n")
          .filter((linha) => {
            const limpa = linha.trim();

            return (
              !limpa.startsWith("//") &&
              !limpa.startsWith("*") &&
              !limpa.startsWith("/*")
            );
          })
          .join("\n");

        return codigo.includes("localhost");
      });

    expect(culpados).toEqual([]);
  });

  // ---------- C2 e C3: os dois endereços ----------

  it("C2 - o endereço do servidor vem do ambiente, na execução", () => {
    // Lido de `process.env` e não embutido: em contêiner, `localhost` é o
    // próprio contêiner, e foi assim que o sitemap saiu sem nenhum anúncio.
    expect(API_INTERNA).toBe(
      process.env.ATTUS_API_INTERNA ?? "http://localhost:8080/api/v1",
    );
  });

  it("C3 - o endereço público do site vem do ambiente", () => {
    expect(SITE_URL).toBe(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    );
  });

  it("a origem das imagens deriva do endereço da API, sem repetir host", () => {
    expect(ORIGEM_DAS_IMAGENS).not.toContain("/api/v1");
  });

  // ---------- C4: a guarda do build ----------

  it("C4 - o build de produção para sem o endereço público", () => {
    const config = readFileSync("next.config.ts", "utf8");

    expect(config).toContain('process.env.NODE_ENV === "production"');
    expect(config).toContain("NEXT_PUBLIC_SITE_URL");
    expect(config).toContain("throw new Error");
  });

  // ---------- C5 e C6: o build reprodutível ----------

  it("C5 - a imagem é construída com npm ci, a partir do lockfile", () => {
    const dockerfile = readFileSync("Dockerfile", "utf8");

    expect(dockerfile).toContain("npm ci");
    expect(dockerfile).toContain("package-lock.json");
    expect(dockerfile).not.toContain("RUN npm install");
  });

  it("C6 - o lockfile está commitado, que é o que torna o build repetível", () => {
    expect(() => statSync("package-lock.json")).not.toThrow();
  });

  // ---------- C7: a sonda ----------

  it("C7 - a rota de saúde não consulta a API", () => {
    const rota = readFileSync(join("app", "api", "saude", "route.ts"), "utf8");

    // Se consultasse, uma queda da API derrubaria e recriaria o contêiner do
    // site em ciclo, e ninguém veria nem a tela que explica a queda.
    expect(rota).not.toContain("fetch");
    expect(rota).toContain("UP");
  });
});
