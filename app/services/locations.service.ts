import { api } from "./api";

/**
 * As cidades e os bairros que existem sao os que tem anuncio, nao um cadastro.
 *
 * E isto que faz o sistema nascer sabendo os bairros de Joao Pessoa e saber os
 * de Belo Horizonte no dia em que alguem publicar la, sem ninguem cadastrar
 * nada. Bairro sem anuncio nao aparece porque nao ha o que mostrar.
 */
export async function getCidades() {
  return api<string[]>("/announcements/cidades", { method: "GET" });
}

export async function getBairros(city: string) {
  const cidade = city.trim();

  if (!cidade) return [];

  return api<string[]>(
    `/announcements/bairros?city=${encodeURIComponent(cidade)}`,
    { method: "GET" },
  );
}
