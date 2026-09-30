/**
 * A credencial que prova ao Cloud Run quem está chamando.
 *
 * Serviço sem entrada pública ainda exige que quem chama prove a identidade.
 * O site pede ao servidor de metadados do próprio ambiente um token de
 * identidade emitido PARA o endereço da API, e o manda junto — é o que permite
 * a API existir fechada.
 *
 * Fora do GCP não há servidor de metadados: devolve nulo, e em desenvolvimento
 * `docker compose up` continua funcionando sem credencial nenhuma.
 */
const METADADOS =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

/** O token vale cerca de uma hora; guardar evita uma ida por requisição. */
let guardado: { token: string; ateQuando: number } | null = null;

export async function credencialDeServico(destino: string) {
  if (!process.env.ATTUS_CREDENCIAL_DE_SERVICO) return null;

  const agora = Date.now();

  if (guardado && guardado.ateQuando > agora) return `Bearer ${guardado.token}`;

  try {
    const resposta = await fetch(
      `${METADADOS}?audience=${encodeURIComponent(destino)}`,
      { headers: { "Metadata-Flavor": "Google" }, cache: "no-store" },
    );

    if (!resposta.ok) return null;

    const token = (await resposta.text()).trim();

    // Renovado com folga: token vencido no meio de uma requisição viraria 403
    // sem explicação para quem está usando.
    guardado = { token, ateQuando: agora + 45 * 60 * 1000 };

    return `Bearer ${token}`;
  } catch {
    return null;
  }
}
