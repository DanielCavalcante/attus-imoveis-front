# Veredito — 03-cadastro-tipado-no-front

Base: `aa69704..HEAD` mais os não rastreados de `.` (o trabalho está na árvore, não commitado).

> **Limitação de independência.** Produzido pela mesma sessão que escreveu o código, a pedido do humano. O passo 2 do `verificar` pede contexto limpo porque quem escreve o código escreve os testes. Leia sabendo que essa garantia não existe aqui.

Critérios `contrato-api` provados por Vitest (6 testes). Critérios `experiencia` provados na aplicação renderizada em `localhost:3000`, contra a stack em Docker, conforme o catálogo de domínios.

- **C1** — atendido. A tela de cadastro abre com o grupo "Tipo de conta" e as opções "Pessoa física" e "Pessoa jurídica" visíveis acima dos demais campos, com a primeira marcada por padrão.

- **C2** — atendido. Com pessoa física marcada, `document.getElementById('cnpj')` retorna nulo e a tela não exibe o campo. Confirmado tanto na carga inicial quanto no cadastro concluído em C8.

- **C3** — atendido. Ao escolher pessoa jurídica, o campo CNPJ aparece entre telefone e senha, com a nota de que os demais dados são completados depois. O rótulo do primeiro campo também muda de "Nome completo" para "Nome do contato".

- **C4** — atendido. `buildCreateUserPayload` devolve `accountType` nos dois tipos; teste em `app/services/__tests__/user-payload.test.ts`.

- **C5** — atendido. Para pessoa jurídica o montador devolve `cnpj` com `trim` aplicado; provado com entrada contendo espaços nas pontas.

- **C6** — atendido. Para pessoa física a chave `cnpj` é removida do corpo, não enviada vazia. Provado no teste e confirmado ponta a ponta: a conta criada pela interface gravou `cnpj` nulo no banco, não string vazia.

- **C7** — atendido. Formulário de pessoa jurídica preenchido sem CNPJ exibiu "CNPJ obrigatório para pessoa jurídica" abaixo do campo. A mensagem é a do schema Zod, não a do servidor, e nenhuma conta foi criada na tentativa — a chamada é barrada antes do `mutateAsync`.

- **C8** — atendido. Cadastro de pessoa física preenchido pela interface concluiu e redirecionou para `/portal/auth/login`, sem toast de erro. Este critério é o que o estado anterior reprovava: a API recusava todo cadastro com 400 por falta de `accountType`.

- **C9** — atendido. `/portal/empresa` sem sessão redirecionou para `/portal/auth/login`; verificado lendo `location.pathname` após a navegação.

- **C10** — atendido. A tela exibe campo para os catorze dados, em três blocos: identificação, responsável e contato, endereço da sede. Complemento aparece rotulado como opcional.

- **C11** — atendido. A tela exibe "Cadastro incompleto" enquanto falta dado e o estado vem de `dossieCompleto` do servidor. Após o preenchimento completo, a coluna `dossie_completo` virou verdadeira no banco.

- **C12** — atendido. Salvar emitiu `PUT /companies/me` e a resposta 200 produziu o toast "Dados da empresa salvos."

- **C13** — atendido. Com sessão de conta pessoa jurídica, a navegação exibe "Empresa" apontando para `/portal/empresa`.

- **C14** — atendido. Com sessão de conta pessoa física, a navegação lista apenas Dashboard, Imóveis e Anuncie; a consulta por `header a[href="/portal/empresa"]` retorna falso.

- **C15** — atendido. Segunda empresa tentando gravar o mesmo par CRECI número+UF recebeu 409 e a tela exibiu "CRECI ja cadastrado por outra empresa" — a mensagem do servidor, não um texto genérico.

## Observações que não são critério

- O dossiê usa o mesmo toast do resto do app para erro de servidor, então o conflito de CRECI aparece como notificação transitória e não marca o campo `creciNumero`. O dado errado continua na tela sem indicação de qual campo causou a recusa.
- ~~A sessão lê `accountType` do JWT.~~ **CORRIGIDO na homologação do ciclo 01, 2026-09-28: esta afirmação era falsa.** `app/contexts/auth-context.tsx:74-85` prefere o JSON de `localStorage["user"]` e só decodifica o token quando esse item não existe. Como `updateUserSession` (`:61-64`) regrava esse JSON com o `UserDetailDTO` devolvido pelo perfil, e esse DTO **não tem `role`**, salvar o perfil apaga o papel da sessão. Reproduzido na aplicação: conta interna com token válido salvou o perfil e passou a receber "Área restrita" em `/portal/backoffice`, com o item "Painel" sumindo da navegação. A verificação original não pegou porque limpava `localStorage["user"]` antes de injetar o token — o método de verificação mascarou o defeito.
>
> **CORRIGIDO no código em 2026-09-28**, depois da homologação. A cópia em `localStorage["user"]` deixou de existir: `app/lib/session.ts` deriva a sessão do token e `mergeProfileIntoSession` impede que `id`, `email`, `accountType` e `role` venham de qualquer outra origem. O `auth-context` apaga o item legado no boot. Provado na aplicação: conta interna salvou o perfil e manteve o acesso ao painel; e um `localStorage["user"]` forjado com `role: INTERNO` sobre token de conta comum passou a não conceder nada. Quatro testes em `app/lib/__tests__/session.test.ts`.
- `AccountType` no contexto de autenticação é opcional (`accountType?`), então token emitido antes da spec 01 não quebra a tela — apenas não mostra o acesso à área da empresa.
