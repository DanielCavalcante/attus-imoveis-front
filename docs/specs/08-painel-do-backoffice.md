# 08-painel-do-backoffice

## Intenção
A equipe interna analisa imobiliárias e gerencia planos por tela, em vez de por chamada de API na mão.

## Depende de
05-analise-de-confiabilidade, 07-planos-configuraveis

## Critérios
- [ ] **C1** `seguranca` — `/portal/backoffice` sem sessão redireciona para a tela de login.
- [ ] **C2** `seguranca` — `/portal/backoffice` com sessão de papel comum não exibe a fila.
- [ ] **C3** `experiencia` — `/portal/backoffice` com sessão de papel interno exibe a fila de análise.
- [ ] **C4** `experiencia` — Cada linha da fila mostra CNPJ, razão social e CRECI da empresa.
- [ ] **C5** `experiencia` — Fila sem empresa pendente exibe estado vazio, não tabela em branco.
- [ ] **C6** `dominio` — Aprovar pela tela deixa a empresa com análise aprovada.
- [ ] **C7** `experiencia` — Empresa aprovada some da fila sem recarregar a página.
- [ ] **C8** `experiencia` — Reprovar sem motivo preenchido não envia a decisão.
- [ ] **C9** `dominio` — Reprovar pela tela grava o motivo informado na empresa.
- [ ] **C10** `experiencia` — `/portal/backoffice/planos` lista os planos, inclusive os inativos.
- [ ] **C11** `experiencia` — Criar plano pela tela faz o plano aparecer na lista.
- [ ] **C12** `experiencia` — Desativar plano pela tela marca o plano como inativo na lista.
- [ ] **C13** `experiencia` — Plano com limite de anúncios vazio é exibido como ilimitado.
- [ ] **C14** `experiencia` — Conta de papel interno vê o acesso ao painel na navegação.
- [ ] **C15** `experiencia` — Conta de papel comum não vê o acesso ao painel na navegação.

## Contrato técnico
- **A proteção de verdade é da API.** `/api/v1/backoffice/**` já exige papel `INTERNO` desde a spec 01. O guard de rota no cliente evita que a pessoa errada veja uma tela quebrada; ele não é o que impede o acesso aos dados, e não pode ser tratado como se fosse.
- O painel mora no mesmo app Next do site público. O bundle é servido a qualquer visitante — por isso nenhuma regra de negócio, chave ou dado sensível pode viver no código do painel; ele só desenha o que a API devolve.
- O papel vem da claim `role` do JWT, emitida desde a spec 01. `auth-context.tsx` passa a lê-la, como já faz com `accountType`.
- `components/internal-route.tsx` é o guard por papel, irmão de `private-route.tsx`. Sessão ausente redireciona para o login; sessão sem papel interno mostra recusa, sem redirecionar — quem tem conta e errou de endereço precisa entender o que houve.
- A conta interna de desenvolvimento vem das variáveis `ATTUS_BOOTSTRAP_INTERNAL_*` no `docker-compose.yml` do backend. Em produção as mesmas variáveis vêm do Terraform; **nenhuma credencial interna entra no repositório com valor de produção**.
- Aprovar e reprovar invalidam a consulta da fila pelo TanStack Query, sem recarregar a página.

## Fora de escopo
- Reativar plano desativado — a API não expõe a rota; está registrado no veredito da spec 07.
- Paginação e ordenação da fila — a API devolve tudo; quando ela paginar, a tela acompanha.
- Ver o dossiê completo da empresa antes de decidir: a fila traz o que decide. Tela de detalhe é outra demanda.
- Histórico de decisões e quem decidiu o quê.
- Qualquer aviso à empresa sobre a decisão — depende do serviço de e-mail, adiado pelo gate.

## Plano
1. `app/contexts/auth-context.tsx` — `role` no tipo da sessão.
2. `app/components/internal-route.tsx` — guard por papel.
3. `app/types/backoffice.ts` e `app/schemas/plan.ts`.
4. `app/services/backoffice.service.ts` — fila, aprovar, reprovar, planos.
5. `app/hooks/use-pending-companies.ts`, `use-review-company.ts`, `use-plans.ts`, `use-plan-mutations.ts`.
6. `app/portal/backoffice/page.tsx` — fila de análise.
7. `app/portal/backoffice/planos/page.tsx` — gestão de planos.
8. `app/components/menu.tsx` — acesso ao painel só para papel interno.
9. `../attus-imoveis-back/docker-compose.yml` — variáveis de bootstrap da conta interna.

Fatia única: as duas telas dependem do guard e do papel na sessão.

## Perguntas em aberto
nenhuma
