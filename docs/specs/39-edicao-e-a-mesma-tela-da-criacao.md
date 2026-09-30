# 39-edicao-e-a-mesma-tela-da-criacao

## Intenção
Editar um anúncio passa a ser a mesma tela de criar, com os campos já
preenchidos — e passa a funcionar.

## Depende de
36-campo-de-bairro-no-anuncio

## Critérios

- [ ] **C1** `experiencia` — abrir a edição de um anúncio mostra os campos preenchidos com os dados dele.
- [ ] **C2** `dominio` — salvar grava as alterações e elas aparecem no anúncio.
- [ ] **C3** `experiencia` — a tela de edição tem os mesmos campos e a mesma composição da de criação.
- [ ] **C4** `experiencia` — enquanto o anúncio carrega, o formulário não aparece preenchido com valores vazios.
- [ ] **C5** `dominio` — editar não muda a foto quando ninguém troca a foto.
- [ ] **C6** `experiencia` — trocar a foto na edição substitui a capa do anúncio.
- [ ] **C7** `seguranca` — abrir a edição de anúncio de outra conta não mostra os dados dele.
- [ ] **C8** `experiencia` — anúncio que não existe mostra que não foi encontrado, em vez de formulário vazio.
- [ ] **C9** `experiencia` — salvo, a lista de "Meus anúncios" já mostra o valor novo.
- [ ] **C10** `dominio` — falha ao salvar mantém o que a pessoa digitou na tela.
- [ ] **C11** `experiencia` — o botão diz "Salvar alterações", e não "Publicar anúncio".
- [ ] **C12** `experiencia` — em 390px de largura a tela não produz rolagem horizontal.

## Contrato técnico

Um formulário só, usado pelas duas telas. Hoje são dois: a criação tem 551
linhas com o mundo visual do produto, e a edição tem 221 com `Card`,
`rounded-3xl` e `shadow-sm` — vocabulário de outro projeto, que o resto do site
não usa. Manter os dois em pé significa toda regra nova nascer duas vezes, e
foi assim que a edição ficou para trás: ela **não carrega o anúncio**, mostra
`defaultValue="Apartamento 203"` fixo e não salva nada.

Extrair o formulário é o trabalho desta spec, e é o que faz C3 ser verdade por
construção em vez de por vigilância.

`PUT /announcements/{id}` já existe no servidor e já exige ser dono desde a
spec 22 — o front nunca o chamou. C7 é a tela respeitando o que a API já
responde (404 para quem não é dono), não uma regra nova.

C5 importa porque a foto é o único campo que não se digita: sem ele, abrir a
edição e salvar sem tocar em nada apagaria a capa.

## Fora de escopo

- **Editar o conjunto de fotos** (acrescentar, remover, reordenar, trocar a
  capa entre as que já existem). A spec 35 fez isso na criação; trazer para a
  edição é trabalho próprio, e C5 e C6 garantem que a capa não se perca
  enquanto isso.
- **Rascunho salvo automaticamente.**
- **Histórico de alterações do anúncio.**

## Plano

1. O formulário sai da página e vira componente, sem mudar o que ele faz —
   `app/components/formulario-de-anuncio.tsx`, `app/anuncie/page.tsx`.
2. Serviço e hook de edição — `app/services/announcement-update.service.ts`,
   `app/hooks/use-update-announcement.ts`.
3. A tela de edição passa a carregar o anúncio e usar o formulário —
   `app/anuncie/edit/[id]/page.tsx`.
4. Testes por critério —
   `app/components/__tests__/formulario-de-anuncio.test.tsx`,
   `app/components/__tests__/edicao-de-anuncio.test.tsx`.

## Perguntas em aberto

Nenhuma.
