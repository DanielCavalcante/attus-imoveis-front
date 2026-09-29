const BASE_URL = "http://localhost:8080/api/v1";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(
  endpoint: string,
  options?: RequestOptions,
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options?.headers);

  headers.set("Content-Type", "application/json");

  if (options?.auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
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
