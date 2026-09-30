import { ORIGEM_DAS_IMAGENS } from "./ambiente";

const API = ORIGEM_DAS_IMAGENS;

/**
 * O endereço de onde a imagem do anúncio é carregada.
 *
 * Dois formatos convivem de propósito: anúncio novo guarda o caminho da
 * imagem enviada (`/api/v1/imagens/...`), e anúncio de antes da spec 32
 * guarda o endereço externo que alguém digitou. Derrubar os antigos seria
 * apagar a foto de quem já anuncia, então o que era absoluto continua absoluto.
 */
export function urlDaImagem(valor?: string | null) {
  if (!valor) return "";

  if (valor.startsWith("http://") || valor.startsWith("https://")) {
    return valor;
  }

  return `${API}${valor.startsWith("/") ? "" : "/"}${valor}`;
}
