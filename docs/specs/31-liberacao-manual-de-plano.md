# 31-liberacao-manual-de-plano

## Intenção
A conta interna libera o plano de uma empresa por tela, e vê o que o downgrade
vai causar antes de confirmar.

## Depende de
30-vinculo-de-plano-da-empresa

## Critérios

- [ ] **C1** `experiencia` — a tela de liberação existe no backoffice e lista as empresas aprovadas com o plano vigente de cada uma.
- [ ] **C2** `experiencia` — escolher uma empresa mostra quantos anúncios ela tem no ar.
- [ ] **C3** `experiencia` — o seletor de plano só oferece plano ativo.
- [ ] **C4** `experiencia` — escolher plano de limite menor que os anúncios no ar mostra o aviso, com os dois números, antes da confirmação.
- [ ] **C5** `experiencia` — o aviso diz que nenhum anúncio será tirado do ar.
- [ ] **C6** `experiencia` — o aviso não desabilita a confirmação: o downgrade é liberado do mesmo jeito.
- [ ] **C7** `experiencia` — upgrade ou plano de limite nulo não mostra o aviso.
- [ ] **C8** `experiencia` — confirmada a liberação, a lista mostra o plano novo sem recarregar a página.
- [ ] **C9** `seguranca` — conta comum que abre a rota da tela não vê a lista.
- [ ] **C10** `experiencia` — recusa do servidor (plano inativo, por exemplo) vira mensagem legível, não silêncio.
- [ ] **C11** `experiencia` — o aviso é anunciado a leitor de tela quando aparece.
- [ ] **C12** `experiencia` — em 390px de largura a tela não produz rolagem horizontal.
- [ ] **C13** `experiencia` — conta PJ aprovada e sem plano abre `/anuncie` e vê o motivo certo — falta plano, não falta aprovação — em vez do formulário.

## Contrato técnico

Os dois números de C4 vêm do servidor (spec 30, C11), não de contagem montada
no cliente: a tela que calcula o próprio aviso erra quando alguém publica entre
o carregamento e a confirmação.

Confirmação em diálogo, como a exclusão de anúncio da spec 23 — é a convenção
que o produto já tem para ação com consequência.

C13 mora aqui e não na spec 29 de propósito: são dois portões em sequência, e
o segundo só existe depois da spec 30. Critério de tela na 29 dependendo da 30
inverteria a ordem, e nenhuma das duas fecharia. A tela da 29 é reaproveitada,
ganhando o motivo novo — não é uma segunda tela.

## Fora de escopo

- **Cancelar plano.** Liberar e trocar cobre o pedido. Cancelar agora tem
  efeito definido — sem plano a empresa para de publicar, pela C15 da spec 30 —
  e é justamente por ter esse efeito que merece decisão própria, não um botão
  de tabela.
- **Histórico de trocas na tela.** A spec 30 grava quem e quando; mostrar isso
  é outra tela, e ninguém pediu.
- **Preço, cobrança ou recibo** — não há gateway.

## Plano

1. Serviço e hooks das rotas novas — `app/services/backoffice.service.ts`,
   `app/hooks/use-backoffice.ts`.
2. Tela — `app/portal/backoffice/planos-das-empresas/page.tsx`.
3. Diálogo de confirmação com o aviso —
   `app/components/confirmar-liberacao-de-plano.tsx`.
4. Testes por critério —
   `app/components/__tests__/confirmar-liberacao-de-plano.test.tsx`.

## Perguntas em aberto

Nenhuma.
