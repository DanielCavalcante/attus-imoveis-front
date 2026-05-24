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
    const error = await response.json();
    throw new Error(error.message || "Erro na requisição");
  }

  return response.json();
}
