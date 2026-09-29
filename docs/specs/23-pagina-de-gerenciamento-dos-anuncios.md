# 23-pagina-de-gerenciamento-dos-anuncios

## Intenção
Depois de entrar, a pessoa tem um lugar só para cuidar dos anúncios dela: editar, tirar do ar, excluir, e ver quantas vagas ainda tem.

## Depende de
22-anuncio-ativo-e-quota-por-ativos

> **Aprovada no gate humano em 2026-09-29.** Todos os critérios aceitos.

## Critérios
- [ ] **C1** `seguranca` — Visitante não autenticado não alcança a página.
- [ ] **C2** `experiencia` — A página lista os anúncios da conta, ativos e inativos juntos.
- [ ] **C3** `experiencia` — Cada anúncio da lista mostra se está ativo ou inativo.
- [ ] **C4** `experiencia` — Cada anúncio tem ação de editar que leva ao formulário daquele anúncio.
- [ ] **C5** `experiencia` — Anúncio ativo oferece a ação de inativar.
- [ ] **C6** `experiencia` — Anúncio inativo oferece a ação de reativar.
- [ ] **C7** `experiencia` — Cada anúncio oferece a ação de excluir.
- [ ] **C8** `experiencia` — Excluir pede confirmação que nomeia o anúncio antes de executar.
- [ ] **C9** `experiencia` — A página mostra quantas vagas da quota estão ocupadas e quantas restam.
- [ ] **C10** `dominio` — Inativar atualiza o saldo de vagas exibido sem recarregar a página.
- [ ] **C11** `dominio` — Excluir tira o anúncio da lista sem recarregar a página.
- [ ] **C12** `dominio` — Reativar recusado por quota cheia mostra mensagem que nomeia o motivo.
- [ ] **C13** `experiencia` — Conta sem nenhum anúncio vê estado vazio com caminho para criar o primeiro.
- [ ] **C14** `experiencia` — Cada ação tem nome que diz o que ela faz, não ícone sozinho.
- [ ] **C15** `experiencia` — Todas as ações são alcançáveis e operáveis por teclado.

## Contrato técnico
- **A página nova absorve a listagem do dashboard, não convive com ela.** `/portal/dashboard` hoje já lista "Meus anúncios" na mesma grade pública. Duas telas listando os mesmos anúncios com poderes diferentes é o jeito de alguém editar no lugar errado e não achar a ação que procura. A grade sai do dashboard e ele aponta para cá.
- **O card do acervo público não serve aqui.** `PropertyCard` foi desenhado para seduzir quem procura imóvel; esta tela é de operação, e quem chega já é dono do que vê. Linha com estado, medidas e ações, não vitrine.
- **Excluir confirma nomeando o anúncio; inativar não confirma.** A assimetria é o ponto: exclusão é irreversível e a confirmação precisa dizer o que vai sumir, enquanto inativar se desfaz num clique e pedir confirmação para o que é reversível ensina a pessoa a clicar em "sim" sem ler.
- **A quota aparece antes de faltar.** C9 mostra ocupadas e restantes o tempo todo; descobrir que a vaga acabou só na hora de publicar é descobrir tarde.
- **Conta sem limite vê o que tem no ar, não um restante inventado.** A spec 22 conta ativos para qualquer tipo de conta, mas só a pessoa física tem teto hoje. Sem teto, a tela diz quantos estão no ar e que não há limite — número de vagas restantes que ninguém definiu seria número inventado, e a tela inteira foi construída para não fazer isso.
- **A recusa por quota cheia diz o motivo.** O backend devolve 409 em C13 da spec 22; a tela traduz isso em "você já tem três anúncios no ar — inative um para publicar este", não em "erro ao reativar".
- Estado do servidor é do TanStack Query, como no resto do app: C10 e C11 são invalidação de consulta, não manipulação manual da lista na tela.

## Fora de escopo
- Ações em lote sobre vários anúncios de uma vez.
- Ordenar e filtrar a própria lista: quem tem três anúncios não precisa de filtro, e quem tiver muitos é PJ, que ainda não tem limite definido.
- Métricas do anúncio (visitas, favoritos recebidos): o dado de histórico existe, mas exibi-lo é decisão de produto própria.
- Recuperar anúncio excluído.
- Criar anúncio a partir desta página: quem cria é `/anuncie`, e duplicar a porta de criação é o erro que esta spec está desfazendo no dashboard.

## Plano
1. `app/services/announcements-me.service.ts` — inativar, reativar e excluir.
2. `app/hooks/use-my-announcements.ts` — as três mutações, com invalidação da lista e da quota.
3. `app/components/linha-de-anuncio.tsx` — a linha de operação com estado e ações.
4. `app/portal/anuncios/page.tsx` — a página, dentro de `PrivateRoute`.
5. `app/portal/dashboard/page.tsx` — a grade sai e o dashboard aponta para a página nova.
6. `app/components/menu.tsx` — o acesso à página para conta autenticada.
7. `app/services/__tests__/announcements-me.test.ts` — os critérios de consulta e payload, no harness que já existe.

Fatia única: C10 e C12 só se provam com a lista e o saldo de quota na mesma tela.

## Perguntas em aberto
nenhuma
