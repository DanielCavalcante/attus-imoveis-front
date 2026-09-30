# 33-campo-de-envio-de-imagem

## Intenção
Quem anuncia escolhe um arquivo do próprio aparelho, em vez de colar o endereço
de uma imagem que está em outro lugar.

## Depende de
32-imagem-enviada-e-nao-linkada

## Critérios

- [ ] **C1** `experiencia` — o formulário de anúncio não tem mais campo de texto para endereço de imagem.
- [ ] **C2** `experiencia` — o campo de imagem aceita arquivo escolhido do aparelho.
- [ ] **C3** `experiencia` — escolhido o arquivo, a pré-visualização mostra a imagem escolhida.
- [ ] **C4** `experiencia` — arquivo de tipo não aceito é recusado na tela, com mensagem que nomeia os tipos aceitos.
- [ ] **C5** `experiencia` — arquivo acima do limite é recusado na tela, com mensagem que nomeia o limite.
- [ ] **C6** `experiencia` — enquanto o envio está em curso, publicar não é possível.
- [ ] **C7** `experiencia` — falha do servidor no envio vira mensagem legível, e o formulário preenchido não se perde.
- [ ] **C8** `dominio` — publicar envia o caminho devolvido pelo servidor, nunca um endereço digitado.
- [ ] **C9** `experiencia` — editar anúncio existente mostra a imagem atual e permite trocá-la.
- [ ] **C10** `experiencia` — o campo tem rótulo associado e é operável por teclado.
- [ ] **C11** `experiencia` — em 390px de largura a tela não produz rolagem horizontal.
- [ ] **C12** `dominio` — anúncio antigo, com endereço externo, continua aparecendo no card e no detalhe.

## Contrato técnico

A validação da tela não substitui a do servidor, ela antecipa: mandar 5 MB para
receber recusa é gastar a rede de quem anuncia. A recusa que vale continua
sendo a da spec 32.

A pré-visualização usa `URL.createObjectURL` no arquivo local, e não espera o
envio terminar: a pessoa confere antes de gastar o upload. O objeto é revogado
quando o arquivo troca, senão cada troca vaza um blob.

Os cards continuam com `<img>` e não `next/image`, como o comentário em
`property-card.tsx` já registra -- agora por motivo diferente: as imagens
passam a vir do próprio domínio, e trocar o componente é mudança que ninguém
pediu.

## Fora de escopo

- **Mais de uma imagem por anúncio.** Hoje é uma, e continua uma.
- **Cortar, girar ou ajustar a imagem antes de enviar.**
- **A foto de perfil**, pelo mesmo motivo da spec 32.
- **Remover `remotePatterns` do `next.config.ts`.** Enquanto houver anúncio
  antigo com endereço da Unsplash (C12), tirá-lo quebraria esses cards.

## Plano

1. Serviço de envio — `app/services/imagens.service.ts`.
2. Componente do campo, com pré-visualização e validação —
   `app/components/campo-de-imagem.tsx`.
3. Troca no formulário de criação e no de edição — `app/anuncie/page.tsx`,
   `app/anuncie/edit/[id]/page.tsx`, `app/schemas/announcement.ts`.
4. Testes por critério — `app/components/__tests__/campo-de-imagem.test.tsx`.

## Perguntas em aberto

Nenhuma.
