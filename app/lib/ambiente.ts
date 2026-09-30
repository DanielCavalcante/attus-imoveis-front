/**
 * Os endereços do sistema, num lugar só.
 *
 * Eram cinco lugares com `localhost` fixo, e cada um deles quebraria em
 * produção de um jeito diferente: o site sem telas autenticadas, as fotos
 * todas ausentes, o sitemap vazio e o buscador achando que o site mora na
 * máquina de quem fez o deploy.
 *
 * O padrão de desenvolvimento continua aqui, explícito: é o que faz
 * `docker compose up` funcionar sem ninguém exportar variável.
 */

/**
 * Onde o SERVIDOR do site alcança a API.
 *
 * Lido na execução, e não no build: em produção a API não tem entrada da
 * internet, e quem fala com ela é este processo. Em contêiner, `localhost` é
 * o próprio contêiner -- confundir isto já deixou o sitemap sem nenhum
 * anúncio.
 */
export const API_INTERNA =
  process.env.ATTUS_API_INTERNA ?? "http://localhost:8080/api/v1";

/**
 * O endereço público do site.
 *
 * Embutido no build (`NEXT_PUBLIC_*`), e é ele que aparece em canonical, Open
 * Graph e sitemap. Sem ele em produção, o site anuncia ao buscador que mora
 * em `localhost`.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Onde o NAVEGADOR alcança a API: a própria origem do site.
 *
 * Relativo, e não um host: em produção a API não tem entrada da internet, e o
 * site é o único ponto de entrada. O pedido sai para o próprio domínio e o
 * servidor do site o encaminha.
 *
 * Isso também encerra o CORS como assunto -- mesma origem não dispara
 * verificação nenhuma.
 */
export const API_DO_NAVEGADOR = "/api/v1";

/**
 * De onde as fotos do acervo são carregadas: também a própria origem.
 *
 * Vazio de propósito. `urlDaImagem` concatena com o caminho guardado no
 * anúncio (`/api/v1/imagens/...`), e o resultado relativo resolve contra o
 * domínio do site.
 */
export const ORIGEM_DAS_IMAGENS = "";
