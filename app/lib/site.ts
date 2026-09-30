import { SITE_URL } from "./ambiente";

/**
 * De onde o site é servido, para os endereços absolutos que SEO exige.
 *
 * Open Graph, canonical e sitemap não aceitam caminho relativo: o buscador e
 * a rede social precisam do endereço completo. Vem do ambiente porque o
 * domínio de produção não é o de desenvolvimento, e deixá-lo fixo no código
 * faria o compartilhamento apontar para a maquina de quem fez o deploy.
 */
export const SITE = {
  url: SITE_URL,
  nome: "Encontrei",
  descricao:
    "Imóveis em João Pessoa e na Paraíba, anunciados por imobiliária com CRECI conferido ou por quem vende o próprio imóvel.",
} as const;
