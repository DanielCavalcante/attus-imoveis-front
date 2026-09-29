# 26-seletor-pesquisavel-de-bairro

## Intenção
O bairro deixa de ser texto livre e passa a ser escolha numa lista pesquisável — quem procura vê os bairros que existem em vez de adivinhar a grafia.

## Depende de
25-catalogo-de-bairros

> **Aprovada no gate humano em 2026-09-29.** Todos os critérios aceitos.

## Critérios
- [ ] **C1** `experiencia` — O campo de bairro abre a lista de opções sem que nada seja digitado.
- [ ] **C2** `experiencia` — Digitar no campo filtra as opções da lista.
- [ ] **C3** `dominio` — Submeter com uma opção escolhida envia aquele bairro na consulta.
- [ ] **C4** `dominio` — Texto digitado que não corresponde a nenhuma opção não é enviado na consulta.
- [ ] **C5** `experiencia` — Sem correspondência, a lista diz que nenhum bairro casa com o que foi digitado.
- [ ] **C6** `experiencia` — Existe ação para limpar a escolha e voltar a "qualquer bairro".
- [ ] **C7** `dominio` — Com a escolha limpa, a consulta não leva bairro.
- [ ] **C8** `experiencia` — A opção escolhida fica visível no campo depois de escolhida.
- [ ] **C9** `experiencia` — As opções são percorríveis e escolhíveis pelo teclado.
- [ ] **C10** `experiencia` — O campo informa a leitor de tela se a lista está aberta.
- [ ] **C11** `dominio` — O campo de cidade continua aceitando texto livre.

## Contrato técnico
- **Esta spec substitui, só para bairro, a regra que a spec 21 fixou.** Lá está escrito: "sugestão não é validação; valor livre é enviado do mesmo jeito", e o motivo era que travar o campo em silêncio impede a pessoa de descobrir se errou o nome ou se não há imóvel lá. Com o catálogo da spec 25 esse motivo cai: a lista passa a ser a cidade inteira, então **não estar na lista significa que o bairro não existe** — e aí recusar é informação, não silêncio. C5 é o que garante que a recusa fala.
- **A cidade continua livre, e isso é deliberado.** Só João Pessoa tem catálogo; travar a cidade numa lista impediria buscar em qualquer outra. C11 prende isso.
- **O componente é o mesmo `CampoComSugestoes`, com um modo a mais.** Ele já resolve digitação, filtragem, teclado e ARIA; o que muda é uma opção de estrita — quando ligada, o valor submetido só sai da lista. Duplicar o componente para mudar uma regra criaria dois lugares para consertar o mesmo bug de acessibilidade.
- **Escolha limpável, e não campo que se apaga sozinho.** Uma vez escolhido o bairro, apagar o texto à mão é ambíguo: a pessoa pode estar trocando de bairro. A ação de limpar é explícita.
- **A lista de opções não fica presa atrás do teclado virtual.** Ela é posicionada logo abaixo do campo e tem altura máxima; no celular isso pode cair fora da área visível quando o teclado sobe. A implementação precisa manter a lista à vista — e este é o ponto que nenhum teste automatizado deste repositório verifica, porque exige gesto e teclado de aparelho real.
- Sem cidade escolhida não há o que listar: o campo fica inerte e diz por quê, em vez de abrir lista vazia.

## Fora de escopo
- Tornar a cidade uma lista fechada — só uma cidade tem catálogo.
- Escolher mais de um bairro de uma vez.
- Correção de digitação, busca fonética ou aproximação por semelhança.
- Ordenar as opções por quantidade de anúncios.
- O mesmo seletor no formulário de anúncio: lá o bairro vem do CEP e o anunciante é a autoridade sobre o próprio endereço, o que a spec 19 fixou.

## Plano
1. `app/components/campo-com-sugestoes.tsx` — modo estrito, ação de limpar e mensagem de "nenhum bairro".
2. `app/components/home-busc.tsx` — o campo de bairro passa a usar o modo estrito.
3. `app/components/__tests__/campo-com-sugestoes.test.tsx` — os critérios do modo estrito, ao lado dos que já existem.
4. `app/components/__tests__/home-busc.test.tsx` — C3, C4, C7 e C11 pela consulta montada.

Fatia única: C4 e C7 só se provam com o modo estrito ligado num campo e desligado no outro, na mesma tela.

## Perguntas em aberto
nenhuma
