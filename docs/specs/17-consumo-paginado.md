# 17-consumo-paginado

## Intenção
As seis telas que listam voltam a funcionar, agora sobre respostas paginadas, e a busca passa a procurar no acervo inteiro em vez de no que coube na tela.

## Depende de
16-busca-e-ordenacao-no-servidor

> **Aprovada no gate humano em 2026-09-28.** Todos os critérios aceitos.

## Critérios
- [x] **C1** `experiencia` — A listagem pública exibe os imóveis da primeira página.
- [x] **C2** `experiencia` — Ao chegar ao fim da listagem pública, a página seguinte é carregada e acrescentada.
- [x] **C3** `experiencia` — Com todas as páginas carregadas, a listagem para de buscar mais.
- [x] **C4** `experiencia` — A listagem pública informa quantos imóveis existem no total.
- [x] **C5** `contrato-api` — Digitar na busca emite requisição com o termo, não filtra a lista já carregada.
- [x] **C6** `experiencia` — Buscar recomeça a listagem da primeira página.
- [x] **C7** `experiencia` — Busca sem resultado exibe estado vazio que nomeia o termo procurado.
- [x] **C8** `contrato-api` — Trocar a ordenação emite requisição com `sort`.
- [x] **C9** `experiencia` — O carrossel da home exibe imóveis vindos da primeira página.
- [x] **C10** `experiencia` — O dashboard exibe os anúncios da conta.
- [x] **C11** `experiencia` — A fila de análise do painel exibe as empresas pendentes.
- [x] **C12** `experiencia` — A lista de planos do painel exibe os planos.
- [x] **C13** `experiencia` — Aprovar uma empresa continua removendo a linha da fila sem recarregar.
- [x] **C14** `experiencia` — Nenhuma das seis telas quebra quando a resposta traz zero elementos.

## Contrato técnico
- **Rolagem infinita na listagem pública**, decidido no gate. As demais telas seguem em página única, com o tamanho padrão da API: elas listam o que é da conta ou da fila, e não crescem como o acervo.
- Um tipo só para a resposta paginada — `Page<T>` com `content`, `totalElements`, `number`, `size` e `last` — em `app/types/page.ts`, reaproveitado pelos serviços que hoje declaram array.
- A rolagem infinita usa `useInfiniteQuery` do TanStack Query, que já está no projeto. `IntersectionObserver` dispara a próxima página; **a tela também precisa de um caminho sem rolagem**, porque observador de interseção não funciona para quem navega por teclado até o fim da lista.
- Busca e ordenação **saem do cliente**. O termo vai para a API com atraso de digitação, e trocar termo ou ordenação recomeça da primeira página — manter páginas de um filtro anterior misturaria resultados.
- `AnnouncementList` deixa de filtrar em memória. Hoje ele recebe a lista inteira e trabalha sobre ela; passa a receber o que veio da página e a delegar o filtro.
- O painel do backoffice passa a ler `content` nas duas filas. Nenhuma outra mudança lá.
- `components/ui/` não é editado à mão.
- Verificação: os critérios `contrato-api` por teste sobre os montadores de requisição; os de `experiencia` na aplicação renderizada contra a stack em Docker, conforme o catálogo de domínios.

## Fora de escopo
- Paginação visível nos favoritos e no histórico: as duas telas ainda nem existem, e virão já paginadas na spec delas.
- Filtro por tipo de imóvel na home — o seletor continua decorativo; ligá-lo depende da spec de filtros no servidor.
- Endereço da busca na URL: recarregar a página perde o termo. É melhoria conhecida, não requisito desta spec.
- Manter a posição de rolagem ao voltar do detalhe para a listagem.

## Plano
1. `app/types/page.ts` — o envelope paginado.
2. `app/services/announcements.service.ts` — termo, ordenação e página nos parâmetros.
3. `app/services/announcements-me.service.ts`, `app/services/backoffice.service.ts` — leem `content`.
4. `app/hooks/use-announcements.ts` — `useInfiniteQuery`.
5. `app/components/announcement-list.tsx` — busca e ordenação delegadas ao servidor, sem filtro em memória.
6. `app/components/infinite-sentinel.tsx` — observador de interseção, com botão como caminho alternativo.
7. `app/components/body-cards.tsx`, `app/imoveis/page.tsx`, `app/portal/dashboard/page.tsx`, `app/portal/backoffice/page.tsx`, `app/portal/backoffice/planos/page.tsx` — consomem o envelope.
8. `app/services/__tests__/announcements-query.test.ts`.

Fatia única: as seis telas dependem do mesmo envelope e do mesmo serviço.

## Perguntas em aberto
nenhuma
