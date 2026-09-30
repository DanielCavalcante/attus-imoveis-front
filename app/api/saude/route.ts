/**
 * A sonda do site.
 *
 * Responde que o processo está de pé, e mais nada. Não consulta a API de
 * propósito: se consultasse, uma indisponibilidade dela derrubaria e recriaria
 * o contêiner do site em ciclo — e aí ninguém veria nem a tela que explica que
 * algo está fora do ar.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "UP" });
}
