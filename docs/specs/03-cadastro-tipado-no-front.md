# 03-cadastro-tipado-no-front

## Intenção
Quem cria conta escolhe se é pessoa física ou jurídica, e a empresa completa o dossiê numa área própria depois — hoje o formulário não manda o tipo e a API recusa todo cadastro com 400.

## Depende de
02-dossie-da-empresa

## Critérios
- [ ] **C1** `experiencia` — A tela de cadastro apresenta escolha visível entre pessoa física e pessoa jurídica.
- [ ] **C2** `experiencia` — Com pessoa física escolhida, o campo de CNPJ não aparece na tela.
- [ ] **C3** `experiencia` — Com pessoa jurídica escolhida, o campo de CNPJ aparece na tela.
- [ ] **C4** `contrato-api` — O corpo enviado ao criar conta contém `accountType`.
- [ ] **C5** `contrato-api` — O corpo enviado ao criar conta pessoa jurídica contém `cnpj` preenchido.
- [ ] **C6** `contrato-api` — O corpo enviado ao criar conta pessoa física não contém `cnpj` com string vazia.
- [ ] **C7** `experiencia` — Cadastro de pessoa jurídica sem CNPJ mostra mensagem de erro sem chamar a API.
- [ ] **C8** `experiencia` — Cadastro de pessoa física preenchido corretamente chega ao fim sem erro da API.
- [ ] **C9** `experiencia` — A rota `/portal/empresa` exige sessão e redireciona quem não tem.
- [ ] **C10** `experiencia` — `/portal/empresa` exibe campo para cada dado obrigatório do dossiê.
- [ ] **C11** `experiencia` — `/portal/empresa` informa se o dossiê está completo ou incompleto.
- [ ] **C12** `contrato-api` — Salvar o dossiê emite `PUT` para `/companies/me`.
- [ ] **C13** `experiencia` — Conta pessoa jurídica vê o acesso à área da empresa na navegação.
- [ ] **C14** `experiencia` — Conta pessoa física não vê o acesso à área da empresa na navegação.
- [ ] **C15** `experiencia` — Recusa da API ao salvar o dossiê é exibida com a mensagem vinda do servidor.

## Contrato técnico
- Os literais de `accountType` são `PF` e `PJ`, idênticos ao enum Java. O schema Zod é a fonte do tipo, como já vale para `announcement.ts`.
- O tipo de conta vem do JWT: a claim `accountType` foi adicionada na spec 01, e `auth-context.tsx` passa a lê-la. C13 e C14 dependem disso, não de uma chamada extra à API.
- **Pessoa física não envia `cnpj`, nem como string vazia.** A coluna é única no banco e trata `''` como valor: duas contas PF com string vazia colidiriam. O campo sai do corpo quando o tipo é PF.
- O dossiê completo mora em `/portal/empresa`, não no cadastro. Catorze campos na frente de quem está tentando criar conta é o motivo de existir o cadastro em duas etapas.
- Rede continua passando só por `app/services/api.ts`; a tela de empresa fala com a API por hook do TanStack Query, como as demais.
- `components/ui/` não é editado à mão.
- Verificação: os critérios `contrato-api` são provados por teste automatizado sobre o schema e o montador do corpo; os de `experiencia` são provados na aplicação renderizada, contra a stack em Docker, conforme o catálogo de domínios.

## Fora de escopo
- Máscara e validação de dígito de CNPJ, CPF e CEP — a spec 02 não valida no servidor e a tela não vai inventar regra que o servidor não aplica.
- Busca de endereço por CEP — integração externa, entra quando houver spec própria.
- Envio do dossiê para análise e qualquer indicação de aprovação — spec 05.
- Confirmação de e-mail e bloqueio de login — spec 04; o cadastro aqui continua terminando na tela de login.
- Tela de edição de CNPJ depois de criado.

## Plano
1. `app/schemas/user.ts` — `accountType` obrigatório e `cnpj` condicional ao tipo.
2. `app/services/user.service.ts` — monta o corpo omitindo `cnpj` quando o tipo é PF.
3. `app/portal/auth/register/page.tsx` — escolha de tipo e campo de CNPJ condicional.
4. `app/types/company.ts` e `app/schemas/company.ts` — dossiê.
5. `app/services/company.service.ts` — `GET` e `PUT` em `/companies/me`.
6. `app/hooks/use-company.ts` e `app/hooks/use-update-company.ts`.
7. `app/portal/empresa/page.tsx` — formulário do dossiê com o estado de completude.
8. `app/contexts/auth-context.tsx` — `accountType` no tipo da sessão.
9. `app/components/menu.tsx` — acesso à área da empresa só para PJ.
10. `package.json` e `vitest.config.ts` — Vitest para os critérios de `contrato-api`.
11. `app/services/__tests__/user-payload.test.ts` e `app/schemas/__tests__/user-schema.test.ts`.

Fatia única: a tela de empresa depende do schema e dos services, e a navegação depende do tipo na sessão.

## Perguntas em aberto
nenhuma
