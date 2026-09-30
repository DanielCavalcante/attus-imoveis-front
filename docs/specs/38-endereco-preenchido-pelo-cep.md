# 38-endereco-preenchido-pelo-cep

## Intenção
Digitado o CEP, o endereço do anúncio se preenche sozinho — e quem anuncia só
confere.

## Depende de
36-campo-de-bairro-no-anuncio, 37-consulta-de-endereco-por-cep

## Critérios

- [ ] **C1** `experiencia` — completados os 8 dígitos do CEP, a consulta é disparada.
- [ ] **C2** `experiencia` — CEP incompleto não dispara consulta nenhuma.
- [ ] **C3** `experiencia` — a resposta preenche logradouro, bairro, cidade e estado.
- [ ] **C4** `experiencia` — enquanto a consulta corre, a tela sinaliza que está buscando.
- [ ] **C5** `experiencia` — CEP que não existe mostra aviso e deixa os campos como estavam.
- [ ] **C6** `experiencia` — falha da consulta não impede preencher o endereço à mão.
- [ ] **C7** `experiencia` — o que a pessoa digitou depois do preenchimento não é sobrescrito enquanto o CEP não mudar.
- [ ] **C8** `experiencia` — digitar o mesmo CEP de novo não dispara uma segunda consulta.
- [ ] **C9** `experiencia` — o preenchimento é anunciado a leitor de tela.
- [ ] **C10** `experiencia` — em 390px de largura a tela não produz rolagem horizontal.
- [ ] **C11** `dominio` — publicar envia os valores que estão nos campos, venham do CEP ou da mão.

## Contrato técnico

O gatilho é o CEP ficar completo, não cada tecla: oito dígitos é o único
momento em que a consulta tem chance de responder algo. É isso que C2 mede, e
o que dispensa atraso de digitação aqui.

C7 é a regra que separa conveniência de atropelo. O preenchimento acontece
quando o **CEP muda**; correção feita depois pela pessoa fica de pé, porque
quem conhece o endereço é quem mora nele — é a mesma razão que a spec 19 deu
para o bairro informado prevalecer sobre o derivado.

Os campos continuam editáveis em qualquer estado (C6). Travá-los durante a
consulta economizaria uma inconsistência e criaria uma pior: a pessoa esperando
um serviço de terceiro para poder digitar o próprio endereço.

## Fora de escopo

- **Preencher o número da rua.** CEP não sabe o número.
- **Preencher endereço no cadastro da empresa** (`/portal/empresa`), que tem o
  próprio CEP. Mesma mecânica, outra tela e outro formulário; vira spec própria
  se valer a pena.
- **Corrigir a cidade quando ela diverge do CEP.** A spec 37 deixou isso de
  fora por decisão própria, e a tela não decide sozinha.
- **Máscara de digitação no campo de CEP.** O formato já é validado; máscara é
  outra mudança.

## Plano

1. Serviço e hook da consulta — `app/services/enderecos.service.ts`,
   `app/hooks/use-endereco.ts`.
2. O gatilho e o preenchimento no formulário — `app/anuncie/page.tsx`.
3. Testes por critério — `app/components/__tests__/endereco-pelo-cep.test.tsx`.

## Perguntas em aberto

Nenhuma.
