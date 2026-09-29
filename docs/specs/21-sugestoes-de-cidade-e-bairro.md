# 21-sugestoes-de-cidade-e-bairro

## Intenção
Quem digita cidade ou bairro na home vê as opções que existem de verdade no acervo, em vez de adivinhar a grafia.

## Depende de
20-busca-da-home

## Critérios
- [ ] **C1** `experiencia` — Digitar no campo de cidade lista sugestões vindas do servidor.
- [ ] **C2** `experiencia` — Com "João Pessoa" no campo de cidade, as sugestões de bairro são bairros de João Pessoa.
- [ ] **C3** `dominio` — Trocar a cidade substitui as sugestões de bairro pelas da nova cidade.
- [ ] **C4** `experiencia` — Escolher uma sugestão preenche o campo com o valor escolhido.
- [ ] **C5** `dominio` — Valor digitado que não está entre as sugestões é enviado do mesmo jeito ao submeter.
- [ ] **C6** `experiencia` — As sugestões são percorríveis pelas setas do teclado.
- [ ] **C7** `experiencia` — Enter escolhe a sugestão em destaque.
- [ ] **C8** `experiencia` — Esc fecha a lista sem alterar o que foi digitado.
- [ ] **C9** `experiencia` — O campo informa a leitor de tela se a lista está aberta ou fechada.
- [ ] **C10** `experiencia` — O campo informa a leitor de tela qual sugestão está em destaque.
- [ ] **C11** `performance` — Digitação não dispara uma requisição de sugestão por tecla.
- [ ] **C12** `dominio` — Sugestões de bairro não são pedidas enquanto a cidade estiver vazia.
- [ ] **C13** `dominio` — Falha ao carregar sugestões não impede submeter o que foi digitado.

## Contrato técnico
- **Combobox próprio, não `<datalist>`.** A renderização do `datalist` é do navegador: não aceita o mundo visual do produto e difere entre navegadores a ponto de C6 a C10 não se sustentarem.
- Padrão ARIA de combobox: o campo com `role="combobox"`, `aria-expanded`, `aria-controls` e `aria-activedescendant`; a lista com `role="listbox"` e cada opção com `role="option"`. C9 e C10 são exatamente esses dois atributos, e sem eles a lista existe só para quem enxerga.
- **As sugestões saem das rotas da spec 19** — cidades com anúncio, e bairros de uma cidade. A lista é o que existe no acervo, não um cadastro: bairro sem anúncio não aparece porque não há o que mostrar lá.
- **Sugestão não é validação.** C5 é a regra: quem digita um bairro sem anúncio cai na listagem vazia, que nomeia o motivo. Travar o campo em silêncio é pior — a pessoa não descobre se errou o nome ou se não há imóvel lá.
- Atraso de digitação antes de pedir sugestão, pelo mesmo motivo que a listagem já usa um.
- **O harness de teste cresce, e isso é parte da entrega.** O Vitest roda hoje em `environment: "node"` e inclui só `app/**/__tests__/**/*.test.ts`: nenhum critério desta spec se prova assim. Entram ambiente de DOM, biblioteca de teste de componente, e `include` aceitando `.tsx`. Especificar comportamento de tela sem meio de observá-lo é escrever critério que ninguém consegue reprovar.

## Fora de escopo
- Correção de digitação, busca fonética e aproximação por semelhança nas sugestões.
- Ordenar as sugestões por quantidade de anúncios ou por proximidade.
- Sugestão no seletor de tipo: o conjunto é fechado e tem quatro valores.
- Sugestões no painel de filtros de `/imoveis`.
- Cache das listas entre visitas.

## Plano
1. `vitest.config.ts` e `package.json` — ambiente de DOM, biblioteca de teste de componente e `include` aceitando `.tsx`.
2. `app/services/locations.service.ts` — consumo das rotas de cidades e de bairros.
3. `app/hooks/use-locations.ts` — sugestões com atraso de digitação, e bairro condicionado à cidade.
4. `app/components/campo-com-sugestoes.tsx` — o combobox acessível, usado pelos dois campos.
5. `app/components/home-busc.tsx` — os campos de cidade e bairro passam a usá-lo.
6. `app/components/__tests__/campo-com-sugestoes.test.tsx`.
7. `app/components/__tests__/home-busc.test.tsx`.

Fatia única: C3 e C12 só se provam com os dois campos conversando entre si.

## Perguntas em aberto
nenhuma
