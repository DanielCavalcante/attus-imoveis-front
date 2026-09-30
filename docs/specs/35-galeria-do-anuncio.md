# 35-galeria-do-anuncio

## Intenção
Quem anuncia manda várias fotos e escolhe a capa; quem procura vê todas num
carrossel e abre qualquer uma em tela cheia.

## Depende de
33-campo-de-envio-de-imagem, 34-varias-imagens-por-anuncio

## Critérios

- [ ] **C1** `experiencia` — o campo de imagem aceita mais de um arquivo de uma vez.
- [ ] **C2** `experiencia` — as fotos escolhidas aparecem como miniaturas, na ordem em que entraram.
- [ ] **C3** `experiencia` — dá para eleger qual das fotos é a capa.
- [ ] **C4** `experiencia` — a capa escolhida fica marcada entre as miniaturas.
- [ ] **C5** `experiencia` — dá para tirar uma foto do conjunto antes de publicar.
- [ ] **C6** `experiencia` — na página do imóvel, o carrossel aparece logo depois de "Onde fica".
- [ ] **C7** `experiencia` — o carrossel avança e volta entre as fotos.
- [ ] **C8** `experiencia` — clicar numa foto do carrossel abre ela em tela cheia.
- [ ] **C9** `experiencia` — a tela cheia fecha com `Esc`.
- [ ] **C10** `experiencia` — na tela cheia, as setas do teclado trocam de foto.
- [ ] **C11** `experiencia` — anúncio com uma foto só não mostra controles de navegação.
- [ ] **C12** `experiencia` — a tela cheia é um diálogo com nome, e o foco não escapa dela enquanto está aberta.
- [ ] **C13** `dominio` — anúncio antigo, de uma imagem, aparece sem erro e sem carrossel vazio.
- [ ] **C14** `experiencia` — em 390px de largura não há rolagem horizontal na página, e o carrossel se move por arrasto.

## Contrato técnico

A capa continua sendo o herói do topo da página, como hoje. O carrossel é o
**resto**: repetir a capa dentro dele faria a pessoa ver a mesma foto duas
vezes e contar uma a mais do que existe.

O carrossel é rolagem horizontal nativa com `scroll-snap`, não biblioteca:
arrasto no celular, roda no desktop e teclado vêm do navegador, e é isso que a
C14 mede. Biblioteca de carrossel aqui traria peso e um modelo de foco próprio
para depois brigar com a C12.

A tela cheia é diálogo de verdade (`<dialog>` ou `role="dialog"` com foco
preso). Foto ampliada que deixa o foco correr atrás dela é armadilha para quem
navega por teclado: some a imagem e a pessoa não sabe onde está.

`Esc` e as setas são atalhos do diálogo, não da página: presos à tela cheia,
eles não roubam a seta de quem está rolando a lista.

## Fora de escopo

- **Reordenar as fotos arrastando.** A ordem é a de envio (spec 34, C3), e a
  capa se escolhe por C3 desta. Arrastar para reordenar é gesto com estado
  próprio e merece a sua decisão.
- **Zoom dentro da tela cheia.**
- **Pré-carregar as fotos seguintes.** Otimização sem medida é chute; se a
  troca ficar lenta, vira spec com o número na mão.
- **Miniaturas geradas pelo servidor** — a spec 32 já disse não a processar
  imagem, e o carrossel carrega o que existe.

## Plano

1. O campo passa a lidar com conjunto e capa —
   `app/components/campo-de-imagem.tsx`, `app/schemas/announcement.ts`.
2. Carrossel — `app/components/carrossel-de-fotos.tsx`.
3. Tela cheia, com foco preso e atalhos — `app/components/foto-em-tela-cheia.tsx`.
4. Encaixe na página do imóvel, depois de "Onde fica" —
   `app/anuncie/detail/[id]/page.tsx`.
5. Testes por critério — `app/components/__tests__/carrossel-de-fotos.test.tsx`,
   `app/components/__tests__/foto-em-tela-cheia.test.tsx`.

## Perguntas em aberto

Nenhuma.
