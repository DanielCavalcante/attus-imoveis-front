# 29-tela-de-cadastro-em-aprovacao

## Intenção
Quem ainda não foi aprovado descobre disso ao tentar anunciar, e sabe com quem
falar — em vez de preencher o formulário inteiro e levar um erro no fim.

## Depende de
28-aprovacao-manda-no-anuncio

## Critérios

- [ ] **C1** `experiencia` — conta PJ com empresa não aprovada abre `/anuncie` e vê a tela de aprovação no lugar do formulário.
- [ ] **C2** `experiencia` — a tela mostra um canal de contato clicável.
- [ ] **C3** `experiencia` — com a empresa em `NAO_ENVIADO`, a tela oferece o caminho para completar o dossiê em `/portal/empresa`.
- [ ] **C4** `experiencia` — com a empresa em `EM_ANALISE`, a tela diz que o cadastro está em análise e não oferece ação que não exista.
- [ ] **C5** `experiencia` — com a empresa em `REPROVADA`, a tela mostra o motivo que o backoffice registrou.
- [ ] **C6** `dominio` — conta PF abre `/anuncie` e vê o formulário.
- [ ] **C7** `dominio` — conta PJ aprovada abre `/anuncie` e vê o formulário.
- [ ] **C8** `experiencia` — enquanto o estado da empresa carrega, o formulário não aparece para depois sumir.
- [ ] **C9** `seguranca` — a tela não é o portão: se o servidor recusar mesmo assim, a mensagem dele chega a quem está usando.
- [ ] **C10** `experiencia` — a tela usa os tokens do mundo visual e não tem rótulo solto acima do título.
- [ ] **C11** `experiencia` — o título da tela é o `h1` da página.
- [ ] **C12** `experiencia` — em 390px de largura a tela não produz rolagem horizontal.

## Contrato técnico

O canal de contato sai de variável de ambiente (`NEXT_PUBLIC_CONTATO_*`), não
de literal no componente: o endereço muda sem deploy de código, e um literal
teria de ser caçado em cada tela que o repetisse.

O estado vem de `useCompany()`, que já existe e já entrega `analysisStatus` e
`rejectionReason`. Nenhuma rota nova.

## Fora de escopo

- **Esconder o link "Anuncie" do menu.** Link que some não explica nada; a
  tela explica. Quem clica descobre o porquê, que é o objetivo do pedido.
- **Formulário de contato dentro da tela.** O produto já tem o canal de apoio
  da spec 09; uma segunda caixa de entrada seria fila que ninguém lê.
- **Avisar por e-mail quando a análise terminar** — não há serviço de e-mail no
  projeto, como a própria `AccountStatus.PENDENTE_EMAIL` registra.
- **Empresa aprovada e sem plano, que também não publica.** É o segundo portão,
  e ele só existe depois da spec 30; critério aqui sobre ele faria esta spec
  depender de uma que vem depois. Está na spec 31, C13, reaproveitando a tela
  que esta spec constrói.

## Plano

1. Componente da tela, com as três variações de estado —
   `app/components/cadastro-em-aprovacao.tsx`.
2. `/anuncie` passa a decidir entre a tela e o formulário, sem piscar —
   `app/anuncie/page.tsx`.
3. Contato por ambiente — `.env.example`, `docker-compose.yml` do back (que é
   quem sobe o web).
4. Testes por critério — `app/components/__tests__/cadastro-em-aprovacao.test.tsx`.

## Perguntas em aberto

Nenhuma.
