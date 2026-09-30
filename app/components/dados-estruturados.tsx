import { SITE } from "../lib/site";

/**
 * O que o buscador entende sem precisar interpretar a tela.
 *
 * JSON-LD é como o Google sabe que isto é um site com busca interna, e é o
 * que habilita a caixa de pesquisa direto no resultado. Sem ele, o buscador
 * lê o site como texto e adivinha o resto.
 *
 * Nada aqui é invenção: a área atendida é a que o produto realmente cobre, e
 * a rota de busca é a que existe.
 */
export function DadosEstruturados() {
  const dados = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE.nome,
    description: SITE.descricao,
    url: SITE.url,
    logo: `${SITE.url}/icone-512.png`,
    areaServed: {
      "@type": "City",
      name: "João Pessoa",
      containedInPlace: { "@type": "State", name: "Paraíba" },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/imoveis?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      // O conteúdo é montado aqui, não vem de fora: não há entrada de usuário
      // neste objeto.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
