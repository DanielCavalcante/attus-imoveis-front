# 36-campo-de-bairro-no-anuncio

## Intenção
Quem anuncia informa o bairro do imóvel, em vez de depender de um serviço de
terceiro acertar.

## Depende de
nenhuma

## Critérios

- [ ] **C1** `experiencia` — o formulário de anúncio tem campo de bairro, no bloco do endereço.
- [ ] **C2** `dominio` — o bairro digitado chega à API no campo `neighborhood`.
- [ ] **C3** `experiencia` — o campo sugere os bairros da cidade que está preenchida.
- [ ] **C4** `experiencia` — trocar a cidade troca as sugestões de bairro.
- [ ] **C5** `dominio` — bairro fora da lista de sugestões é enviado assim mesmo.
- [ ] **C6** `dominio` — publicar sem preencher o bairro continua funcionando.
- [ ] **C7** `experiencia` — o campo tem rótulo associado e é operável por teclado.
- [ ] **C8** `experiencia` — em 390px de largura o campo não produz rolagem horizontal.
- [ ] **C9** `dominio` — editar um anúncio que já tem bairro mostra o bairro atual no campo.

## Contrato técnico

O campo reusa `CampoComSugestoes`, o mesmo do filtro e da home — **sem** o modo
estrito. Estrito aqui trancaria quem anuncia em cidade sem catálogo: a lista
dela sai do `distinct` sobre os anúncios, que começa vazia, e a pessoa não
teria como informar bairro nenhum. É o oposto do que esta spec existe para
resolver.

`neighborhood` já existe em `AnnouncementCreateDTO` e em `AnnouncementUpdateDTO`
desde a spec 19, com `@Size(max = 60)` e sem `@NotBlank`. Nada muda no servidor:
o que falta é a tela preencher o que a API já aceita.

C6 mantém a decisão da spec 19 com todas as letras — bairro é recorte de busca,
não dado essencial do imóvel, e não bloqueia publicação. O campo é a fonte
confiável; a derivação pelo CEP continua sendo o atalho.

## Fora de escopo

- **Tornar o bairro obrigatório.** A spec 19 decidiu que ele não bloqueia
  publicação, e reverter isso é decisão de produto, não consequência desta.
- **Preencher o campo a partir do CEP** — é a spec 38, e ela depende desta.
- **Preencher o bairro dos 26 anúncios que estão sem ele.** São dados
  existentes; mexer neles é migração, com a sua própria decisão.

## Plano

1. O campo entra no schema — `app/schemas/announcement.ts`.
2. O campo entra no bloco de endereço, com sugestões pela cidade —
   `app/anuncie/page.tsx`, `app/hooks/use-locations.ts`.
3. Testes por critério — `app/components/__tests__/campo-de-bairro.test.tsx`.

## Perguntas em aberto

Nenhuma.
