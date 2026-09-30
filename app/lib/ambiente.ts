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
 * Onde o NAVEGADOR alcança a API.
 *
 * Em desenvolvimento, a própria API. Em produção vira caminho relativo, com o
 * site como único ponto de entrada -- é a spec 42 que constrói esse caminho.
 */
export const API_DO_NAVEGADOR =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

/** De onde as fotos do acervo são carregadas. */
export const ORIGEM_DAS_IMAGENS = API_DO_NAVEGADOR.replace(/\/api\/v1\/?$/, "");
