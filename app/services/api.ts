import { API_DO_NAVEGADOR } from "../lib/ambiente";

const BASE_URL = API_DO_NAVEGADOR;

/**
 * A sessão acabou: o token venceu, foi revogado ou nunca valeu.
 *
 * Tipo próprio porque o tratamento é outro. Insistir numa requisição recusada
 * por sessão é esperar por algo que não vai mudar — e o JWT dura 1h sem
 * refresh, então isso acontece com quem simplesmente ficou um tempo na tela.
 *
 * O servidor responde 403 e não 401 a token vencido (é o Spring Security
 * decidindo), então os dois contam.
 */
export class SessaoExpirada extends Error {
  constructor(mensagem?: string) {
    super(mensagem || "Sua sessão expirou. Entre de novo para continuar.");
    this.name = "SessaoExpirada";
  }
}

export function ehSessaoExpirada(erro: unknown): erro is SessaoExpirada {
  return erro instanceof SessaoExpirada;
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(
  endpoint: string,
  options?: RequestOptions,
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options?.headers);

  // FormData escolhe o proprio Content-Type, com o boundary junto. Fixar
  // application/json aqui faria o servidor receber multipart rotulado como
  // JSON e recusar antes de olhar o arquivo.
  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options?.auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (options?.auth && (response.status === 401 || response.status === 403)) {
      throw new SessaoExpirada(await mensagemDeErro(response));
    }

    throw new Error((await mensagemDeErro(response)) ?? "Erro na requisição");
  }

  return (await corpo<T>(response)) as T;
}

/**
 * Resposta sem corpo não é resposta inválida.
 *
 * 204 é o que as rotas de inativar, reativar e excluir devolvem, e
 * `response.json()` num corpo vazio lança "Unexpected end of JSON input" — a
 * mutação falhava inteira depois de o servidor já ter feito o trabalho.
 */
async function corpo<T>(response: Response): Promise<T | undefined> {
  if (response.status === 204) return undefined;

  const texto = await response.text();

  return texto ? (JSON.parse(texto) as T) : undefined;
}

/**
 * Erro com corpo vazio também existe, e é comum: o 403 do Spring Security não
 * traz JSON. Lendo com `response.json()`, o erro de parsing substituía o erro
 * real e escondia o status.
 */
async function mensagemDeErro(response: Response) {
  const texto = await response.text().catch(() => "");

  if (!texto) return `Erro ${response.status} na requisição`;

  try {
    return (JSON.parse(texto) as { message?: string }).message ?? texto;
  } catch {
    return texto;
  }
}
