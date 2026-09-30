# 26-seletor-pesquisavel-de-bairro — veredito

Medido contra `36abc7e..HEAD`, escopo `.`, com `npm test` (56/56, em sete
arquivos), `npm run build` e a stack Docker no ar para a observação de tela.

- **C1** — atendido. Clicar no campo abre o `listbox` sem nada digitado, com todas as opções. Confirmado na tela: o catálogo de João Pessoa aparece inteiro, com barra de rolagem.
- **C2** — atendido. Digitar "bes" reduz a lista a uma opção, "Bessa".
- **C3** — atendido. Escolher "Tambaú" e submeter entrega "Tambaú".
- **C4** — atendido, e é o critério que define a spec. Digitar "Bairro Que Nao Existe" e submeter entrega **string vazia**: o texto não vira consulta. No modo estrito, digitar limpa o valor escolhido, então só escolher define o que é enviado.
- **C5** — atendido. Digitar "zzz" mostra o `listbox` com "Nenhum bairro com esse nome" — a recusa fala, que é o que separa esta spec de travar o campo em silêncio.
- **C6** — atendido. O botão "Limpar bairro" zera o campo e devolve o foco a ele.
- **C7** — atendido. Depois de limpar, o submit entrega string vazia.
- **C8** — atendido. Escolher "Manaíra" deixa "Manaíra" visível no campo.
- **C9** — atendido. Duas setas para baixo e Enter escolhem a segunda opção, e ela chega ao submit.
- **C10** — atendido. `aria-expanded` é `false` antes do foco e `true` depois.
- **C11** — atendido. Os nove testes do modo livre continuam verdes ao lado dos dez do estrito, incluindo o que prova que a cidade envia valor fora da lista.

## Observações que não são critério

- **Um acoplamento que a spec não pedia e sem o qual ela mentiria:** trocar a cidade zera o bairro escolhido. Sem isso, um bairro de João Pessoa ficaria preso no filtro depois de a pessoa mudar para Recife, e a busca voltaria vazia sem explicar por quê.
- **Um erro meu, pego pelo lint:** a primeira versão sincronizava o texto do campo com o valor do pai por `useEffect`, o mesmo `setState`-dentro-de-efeito que eu já tinha corrigido duas vezes nesta frente. Trocado pelo ajuste durante a renderização, que é o padrão documentado do React para reagir a mudança de prop. Lint de volta aos 3 erros pré-existentes.
- **Sem cidade o campo fica inerte** e o placeholder diz "Escolha a cidade primeiro", em vez de abrir lista vazia.
- **O que continua sem teste, e a spec já dizia:** a lista é `absolute` logo abaixo do campo, e no celular o teclado virtual pode cobri-la. Exige gesto e teclado de aparelho real; nenhum dos dois aconteceu aqui.
