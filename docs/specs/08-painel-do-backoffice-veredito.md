# Veredito — 08-painel-do-backoffice

Base: `aa69704..HEAD` mais os não rastreados de `.` (o trabalho está na árvore, não commitado).

> **Limitação de independência.** Produzido pela mesma sessão que escreveu o código, a pedido do humano. O passo 2 do `verificar` pede contexto limpo porque quem escreve o código escreve os testes. Leia sabendo que essa garantia não existe aqui.

Provado na aplicação renderizada em `localhost:3000` contra a stack em Docker, com a conta interna criada pelo bootstrap a partir das variáveis de ambiente do compose. Os critérios `dominio` foram conferidos no banco, não no corpo da resposta.

- **C1** — atendido. Com `localStorage` comprovadamente vazio, `/portal/backoffice` levou a `/portal/auth/login`. A primeira leitura deste critério deu falso negativo porque restara token de uma navegação anterior no mesmo origin; repetido com a limpeza verificada antes da navegação.

- **C2** — atendido. Sessão de papel `COMUM` recebe a tela "Área restrita", sem fila e sem chamada à API. `InternalRoute` mostra recusa em vez de redirecionar, para que quem tem conta entenda o que houve.

- **C3** — atendido. Sessão de papel `INTERNO` exibe "Análise de imobiliárias" com a empresa pendente.

- **C4** — atendido. A linha mostrou CNPJ `98.765.432/0001-10`, razão social `Horizonte Imoveis LTDA` e CRECI `J-9911 / PE`, além de responsável e e-mail comercial.

- **C5** — atendido. Sem empresa pendente a tela mostra "Nada na fila" com explicação, não uma tabela vazia.

- **C6** — atendido. Aprovar pela tela deixou `analysis_status = APROVADA` no banco, com `reviewed_by = interno@attus.dev`.

- **C7** — atendido. A empresa decidida sai da lista sem recarregar: as mutações invalidam a consulta da fila no TanStack Query. Observado nas duas decisões, reprovação e aprovação.

- **C8** — atendido. Clicar em Reprovar com o motivo vazio exibiu "Informe o motivo da reprovação." e a empresa permaneceu na fila — a guarda roda antes do `mutateAsync`, então nada foi enviado.

- **C9** — atendido. Reprovar com motivo gravou `rejection_reason = "CRECI J-9911 nao consta no conselho de PE"` na empresa.

- **C10** — atendido. Depois de desativado, o plano "Basico" continua listado, marcado como inativo — o painel usa o catálogo interno, não o público.

- **C11** — atendido. Dois planos criados pela tela apareceram na lista sem recarregar.

- **C12** — atendido. Desativar trocou o selo para "Inativo", atenuou o cartão e removeu o próprio botão de desativar.

- **C13** — atendido. O plano criado com o campo de limite vazio é exibido como "Anúncios ilimitados"; o de limite 10 mostra "10 anúncios". O campo vazio chega ao backend como nulo, que é como ilimitado é representado lá.

- **C14** — atendido. A navegação da conta interna exibe "Painel" apontando para `/portal/backoffice`.

- **C15** — atendido. A navegação da conta de papel comum lista apenas Dashboard, Imóveis e Anuncie.

## Observações que não são critério

- O painel é servido do mesmo bundle do site público, como o contrato técnico declara. Quem inspecionar o JavaScript vê as rotas e os formatos de payload do backoffice. Isso é aceitável porque a API recusa por papel, mas significa que nenhuma regra nova pode ser colocada só no cliente.
- O motivo da reprovação fica em estado por empresa (`Record<number, string>`), então duas recusas em aberto não compartilham texto. O estado se perde ao trocar de rota, o que é desejável — mas também ao recarregar após um erro de rede.
- A fila mostra o que decide, não o dossiê inteiro. Endereço da sede e CPF do responsável não aparecem; quem precisar deles para decidir não tem por onde ver na tela.
- Não há confirmação antes de aprovar. Um clique errado aprova a empresa, e não existe rota para desfazer.
