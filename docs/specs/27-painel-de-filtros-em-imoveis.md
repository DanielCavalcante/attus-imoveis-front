# 27-painel-de-filtros-em-imoveis

## Intenção
A listagem ganha um painel de filtros à esquerda: quem chegou pela home refina ali, sem voltar para a porta de entrada.

## Depende de
26-seletor-pesquisavel-de-bairro

> **Aprovada no gate humano em 2026-09-29.** Todos os critérios aceitos.

## Critérios
- [ ] **C1** `experiencia` — `/imoveis` mostra um painel de filtros à esquerda da lista, no desktop.
- [ ] **C2** `experiencia` — No celular o painel abre por um controle próprio, em vez de ocupar a tela antes da lista.
- [ ] **C3** `dominio` — O painel tem campo de cidade.
- [ ] **C4** `dominio` — O painel tem seletor de bairro.
- [ ] **C5** `dominio` — O painel tem faixa de preço, com mínimo e máximo separados.
- [ ] **C6** `dominio` — O painel tem seletor de tipo de imóvel.
- [ ] **C7** `dominio` — Alterar um filtro atualiza a lista sem recarregar a página.
- [ ] **C8** `dominio` — Os filtros aplicados aparecem na URL.
- [ ] **C9** `dominio` — Abrir uma URL com filtros preenche o painel com eles.
- [ ] **C10** `dominio` — Filtro deixado vazio não restringe o resultado.
- [ ] **C11** `experiencia` — Existe ação para limpar todos os filtros de uma vez.
- [ ] **C12** `dominio` — A contagem exibida reflete o recorte, não o acervo inteiro.
- [ ] **C13** `experiencia` — Cada controle do painel tem rótulo associado.
- [ ] **C14** `experiencia` — O painel é alcançável e operável por teclado.
- [ ] **C15** `dominio` — Preço mínimo maior que o máximo é impedido antes de virar consulta.

## Contrato técnico
- **Os filtros continuam vivendo na URL, e a URL continua sendo a fonte.** A listagem já lê `q`, `city`, `neighborhood` e `type` de `searchParams` desde a spec 20; o painel passa a escrever neles. Isso é o que faz C8 e C9 serem o mesmo mecanismo em dois sentidos, e é o que mantém o resultado compartilhável por link.
- **O painel não introduz filtro novo no servidor.** Cidade, bairro, faixa de preço e tipo já existem no contrato desde as specs 18 e 19. Esta spec é de tela.
- **Faixa invertida é impedida na tela, e não no servidor.** A spec 18 decidiu que o servidor responde página vazia para `minPrice` maior que `maxPrice`, porque é consulta sem resultado e não requisição malformada; e disse, com todas as letras, que impedir a inversão é trabalho da tela. C15 é essa dívida sendo paga.
- **No celular o painel não vira uma coluna empilhada acima da lista.** Empilhado, ele põe cinco controles entre a pessoa e o primeiro imóvel — e a medição do celular mostrou que altura é o recurso escasso ali. Abre por controle próprio e fecha ao aplicar.
- **Alterar filtro não recarrega a página**: é troca de consulta com a chave do TanStack Query mudando, como a listagem já faz com termo e ordenação.
- O campo de bairro é o seletor estrito da spec 26; o de cidade continua livre, pelo mesmo motivo de lá.

## Fora de escopo
- Filtro por quartos, banheiros e área: os campos existem no anúncio, mas nenhum foi pedido e cada um amplia o contrato do servidor.
- Contagem por faceta ("142 apartamentos, 38 casas"): exige agregação por consulta e é decisão de produto própria.
- Filtro salvo, alerta por busca e histórico de filtros.
- Mapa e busca por proximidade.
- Mexer no formulário da home: a porta de entrada continua perguntando três coisas.

## Plano
1. `app/components/painel-de-filtros.tsx` — os controles, o estado e a escrita na URL.
2. `app/imoveis/page.tsx` — o painel à esquerda, a lista à direita, e a leitura dos parâmetros que já existe.
3. `app/services/announcements.service.ts` — `minPrice` e `maxPrice` na consulta, que hoje não são montados no front.
4. `app/hooks/use-announcements.ts` — os dois na chave da consulta.
5. `app/services/__tests__/announcements-query.test.ts` — C10 e C15 pela consulta montada.
6. `app/components/__tests__/painel-de-filtros.test.tsx` — os critérios de tela.

Fatia única: C8 e C9 são o mesmo mecanismo nos dois sentidos e não se provam separados.

## Perguntas em aberto
- **O que "publicação" quer dizer como filtro.** Você listou cinco controles e quatro são inequívocos; este tem duas leituras que dão trabalhos diferentes:
  1. **Ordenação por data de publicação** — já existe na tela como "Publicados recentemente" e só mudaria de lugar, entrando no painel. Custo quase zero, e cabe nesta spec.
  2. **Filtro "publicado nos últimos N dias"** — não existe: exige parâmetro novo no `GET /announcements`, consulta por `created_at` e provavelmente índice. Vira spec de backend antes desta.

  Enquanto não vier a resposta, esta spec entrega os quatro filtros certos. O insumo que falta é qual das duas leituras é a sua.
