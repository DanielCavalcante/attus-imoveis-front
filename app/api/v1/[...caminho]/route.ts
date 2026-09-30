import { API_INTERNA } from "@/app/lib/ambiente";
import { credencialDeServico } from "@/app/lib/credencial-de-servico";

/**
 * O caminho por onde o site fala com a API.
 *
 * Em produção a API não tem entrada da internet: o navegador não a alcança, e
 * quem fala com ela é este processo. Toda chamada do site passa por aqui.
 *
 * **Nada de regra de negócio mora neste arquivo.** Ele encaminha, acrescenta a
 * credencial de serviço e devolve. É essa estreiteza que o mantém um caminho,
 * e não um segundo backend — cada decisão que entrasse aqui teria de ser
 * mantida em dois lugares, e um dos dois ficaria para trás.
 */
export const dynamic = "force-dynamic";

/** Cabeçalhos que não fazem sentido repassar: eles descrevem o salto anterior. */
const NAO_REPASSAR = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
]);

async function repassar(requisicao: Request, contexto: Contexto) {
  const { caminho } = await contexto.params;

  // O destino é só o configurado. Proxy que aceita destino de fora vira proxy
  // aberto: alguém pediria por aqui apontando para outro host e usaria o
  // serviço como ponte.
  const rota = caminho.map(encodeURIComponent).join("/");
  const consulta = new URL(requisicao.url).search;
  const destino = `${API_INTERNA}/${rota}${consulta}`;

  const cabecalhos = new Headers();

  requisicao.headers.forEach((valor, nome) => {
    if (!NAO_REPASSAR.has(nome.toLowerCase())) cabecalhos.set(nome, valor);
  });

  // A credencial de serviço vai JUNTO, e não no lugar, do token da pessoa: a
  // API continua usando o dela para saber quem está falando.
  const credencial = await credencialDeServico(API_INTERNA);

  if (credencial) cabecalhos.set("X-Serverless-Authorization", credencial);

  try {
    const resposta = await fetch(destino, {
      method: requisicao.method,
      headers: cabecalhos,
      // O corpo é repassado como veio: multipart do envio de imagem atravessa
      // sem ser remontado, e sem ser lido inteiro na memória.
      body: requisicao.body,
      // Exigido pelo Node quando o corpo é um fluxo.
      duplex: "half",
      redirect: "manual",
      cache: "no-store",
    } as RequestInit);

    const deVolta = new Headers(resposta.headers);

    deVolta.delete("content-encoding");
    deVolta.delete("content-length");
    deVolta.delete("transfer-encoding");

    // O corpo volta em fluxo. Carregá-lo inteiro multiplicaria a memória do
    // site pelo número de pessoas olhando fotos ao mesmo tempo, e cada foto
    // pode ter 5 MB.
    return new Response(resposta.body, {
      status: resposta.status,
      statusText: resposta.statusText,
      headers: deVolta,
    });
  } catch {
    // A API fora do ar vira erro legível, e não página de erro do servidor.
    return Response.json(
      { status: 503, message: "Serviço indisponível no momento. Tente de novo." },
      { status: 503 },
    );
  }
}

type Contexto = { params: Promise<{ caminho: string[] }> };

export const GET = repassar;
export const POST = repassar;
export const PUT = repassar;
export const PATCH = repassar;
export const DELETE = repassar;
