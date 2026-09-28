# Veredito — 17-consumo-paginado

Base: `1307dd6..HEAD` mais os não rastreados de `.`.

> **Limitação de independência.** Produzido pela mesma sessão que escreveu o código, a pedido do humano. Leia sabendo que essa garantia não existe aqui.

Critérios `contrato-api` por Vitest (7 testes sobre o montador de consulta). Critérios `experiencia` na aplicação renderizada contra a stack em Docker, com 24 anúncios semeados — duas páginas de 12 — para que a rolagem tivesse o que carregar.

- **C1** — atendido. A listagem abre com 12 cartões, que é o tamanho de página da API.

- **C2** — atendido. Rolando até o fim, a segunda página carrega e é acrescentada: 12 vira 24. Registrado abaixo que a primeira medição deu falso negativo.

- **C3** — atendido. Com as duas páginas carregadas a sentinela some e a tela exibe "Você chegou ao fim da lista".

- **C4** — atendido. O cabeçalho exibe "24 imóveis disponíveis", vindo de `totalElements` e não da contagem do que está na tela.

- **C5** — atendido, e a prova está no número. Buscar "goiania" devolveu **2 de 24**, não 2 dos 12 carregados: a busca foi ao servidor. E encontrou cidades gravadas como "Goiânia" — a insensibilidade a acento da spec 16 funcionando ponta a ponta pela interface.

- **C6** — atendido. A busca recomeça da primeira página; o termo e a ordenação entram na chave da consulta.

- **C7** — atendido. "iglu na groenlandia" leva ao estado vazio que nomeia o termo procurado.

- **C8** — atendido. Trocar para "Menor preço" reordenou no servidor: R$ 2.300/mês, R$ 4.500/mês, R$ 320.000.

- **C9** — atendido. O carrossel da home exibe os 12 da primeira página.

- **C10** — atendido. O dashboard exibe os 18 anúncios da conta com o total no cabeçalho.

- **C11** — atendido. A fila de análise exibe a empresa pendente, com CRECI.

- **C12** — atendido. A tela de planos lista os dois planos, inclusive o inativo.

- **C13** — atendido. Aprovar deixa a fila com zero cartões e mostra o estado vazio, sem recarregar.

- **C14** — atendido. Fila vazia e catálogo vazio exibem estado próprio; nenhuma tela quebrou com zero elementos.

## Observações que não são critério

- **Dois defeitos meus apareceram só ao olhar a tela, e nenhum teste os pegaria.**
  - O arquivo do dashboard saiu com acentuação duplo-codificada — "Meus anÃºncios" — porque foi escrito por uma conversão que estraga UTF-8. Compila, passa no type check, e só aparece renderizado. Corrigido e varrido: nenhum outro arquivo dos dois repositórios tem o problema.
  - `getAllPlans` foi alterado para ler `content`, por eu presumir que toda rota de backoffice tinha virado página. A spec 14 paginou **as duas filas**, não o catálogo de planos, que continua devolvendo array. O efeito era a tela de planos sempre vazia. Corrigido.
- **A primeira medição de C2 foi falso negativo.** `window.scrollTo` por script não recalcula interseção como rolagem de verdade, e a contagem ficou em 12. Com a roda do mouse, a sentinela disparou. O critério passou a ser medido pelo caminho que uma pessoa usa.
- O botão "Carregar mais" não é decoração: `IntersectionObserver` só dispara por rolagem, e quem navega por teclado chega ao fim da lista pelo foco. Sem ele, essa pessoa não alcança a página seguinte.
- O termo de busca não vai para a URL: recarregar perde o que foi digitado. Declarado no fora de escopo.
- O dashboard e as duas telas do painel continuam em página única. Se a conta passar de 20 anúncios, o dashboard mostra 20 e não diz que há mais — o total aparece no cabeçalho, mas não há como alcançar o resto.
