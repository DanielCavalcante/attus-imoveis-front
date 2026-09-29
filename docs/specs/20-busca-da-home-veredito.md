# 20-busca-da-home — veredito

Medido contra `3a01505..HEAD`, escopo `.`, com `npm test` (24/24), `npm run build`
(12 rotas, sem erro de tipo) e a stack Docker no ar para as observações de tela.

- **C1** — atendido. A home abre com "João Pessoa" no campo de cidade, observado na tela. É valor inicial de um campo de texto, não valor fixo: a digitação por cima funciona (C2).
- **C2** — atendido. Trocar o conteúdo do campo de cidade para "Niterói" e submeter levou a `/imoveis?city=Niterói`, com a listagem respondendo "Imóveis em Niterói · 2 anúncios publicados".
- **C3** — atendido. O campo de bairro é `input type="text"` com `value`/`onChange` próprios, e aceita digitação pela mesma via do campo de cidade.
- **C4** — atendido. O seletor abre em "Qualquer tipo", observado na tela.
- **C5** — atendido. `TIPOS_DE_IMOVEL` traz `APARTMENT`, `HOUSE`, `CONDOMINIUM` e `LAND`, nessa ordem, e o teste compara a lista inteira.
- **C6** — atendido. `buildAnnouncementsQuery` com cidade, bairro e tipo produz `city=`, `neighborhood=` e `type=` na mesma consulta.
- **C7** — atendido. Só com cidade, a consulta traz `city=` e **não** traz `neighborhood` nem `type`. Confirmado também no navegador: a URL resultante foi `?city=Niter%C3%B3i`, sem mais nada.
- **C8** — atendido. Com o tipo em "Qualquer tipo" o componente passa `undefined`, e a consulta não traz `type`. O filtro não nasce ligado.
- **C9** — atendido. Campos vazios ou só espaço produzem consulta vazia (`""`), e a navegação vai para `/imoveis` sem parâmetro.
- **C10** — atendido. `type=CONDOMINIUM` entra na consulta e a string "Condom" não aparece nela. O rótulo e o valor vivem separados em `TIPOS_DE_IMOVEL`.
- **C11** — atendido. O campo de termo livre não existe mais na home, observado na tela: restam cidade, bairro e tipo.
- **C12** — atendido. `<label for="busca-cidade">` associado ao `id` do campo.
- **C13** — atendido. `<label for="busca-bairro">` associado ao `id` do campo.
- **C14** — atendido. `<label for="busca-tipo">` associado ao `id` do seletor.
- **C15** — atendido. Os três controles são elementos nativos (`input`, `input`, `select`) e o botão é `<button type="submit">`: entram na ordem de tabulação sem `tabindex` e operam por teclado. Nada foi construído com `div` mais `onClick`.

## Observações que não são critério

- **Entrou trabalho que os critérios não pedem, e foi deliberado.** A listagem passou a ler `city`, `neighborhood` e `type` da URL. Sem isso a home navegaria com os três parâmetros e a listagem os ignoraria — ou seja, os controles novos seriam controle morto, que é exatamente o que saiu desta home na aplicação do redesign. O painel de filtros de `/imoveis` continua sendo spec futura; o que entrou aqui é só a leitura dos parâmetros.
- O título da listagem passou a compor o recorte ("Imóveis em Niterói", "Apartamentos em Manaíra, João Pessoa"). Com filtro vindo da home, "Todos os imóveis" seria falso, e a contagem logo abaixo se refere ao recorte.
- `PropertyType` deixou de ser tipo privado de `app/lib/property.ts` e passou a ser exportado, para o serviço e o hook tiparem o filtro em vez de aceitarem `string`.
- A captura de tela do passo final expirou por timeout do CDP; a observação de C2 e C7 foi feita lendo `location.href` e o conteúdo do `h1` na página já carregada, o que é evidência mais direta que a imagem.
