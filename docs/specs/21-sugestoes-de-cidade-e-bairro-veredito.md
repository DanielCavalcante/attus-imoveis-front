# 21-sugestoes-de-cidade-e-bairro — veredito

Medido contra `521b09e..HEAD`, escopo `.`, com `npm test` (38/38, em seis
arquivos) e `npm run build` (12 rotas, sem erro de tipo).

Os treze critérios têm teste automatizado. Só existem porque esta spec instalou
o ambiente de DOM: no harness anterior nenhum deles era observável.

- **C1** — atendido. Digitar "man" no campo abre o `listbox` e mostra a opção "Manaíra".
- **C2** — atendido. Montada a home, `getBairros` é chamado com "João Pessoa" e a lista de bairros traz "Manaíra". A cidade inicial governa a lista inicial.
- **C3** — atendido. Trocando a cidade para "Recife", `getBairros` é chamado com "Recife", a lista passa a trazer "Boa Viagem" e "Manaíra" **deixa de existir** no documento. A segunda metade é o que impede o critério de ser satisfeito por uma lista que só cresce.
- **C4** — atendido. Clicar em "Bessa" põe "Bessa" no campo.
- **C5** — atendido, e provado duas vezes. No componente: "Bairro Inexistente" chega ao submit. Na home: "Cidade Que Nao Existe" vai para a consulta como `city=Cidade+Que+Nao+Existe`. Sugestão não é validação.
- **C6** — atendido. Uma seta para baixo marca a primeira opção com `aria-selected="true"`; a segunda move para a opção seguinte.
- **C7** — atendido. Seta para baixo e Enter preenchem o campo com "Manaíra".
- **C8** — atendido. Esc fecha o `listbox` e o campo continua com "cen" — o digitado não é revertido nem completado.
- **C9** — atendido. `aria-expanded` é `false` antes do foco e `true` depois.
- **C10** — atendido. Com uma opção em destaque, o `aria-activedescendant` do campo é exatamente o `id` daquela opção.
- **C11** — atendido. Digitar "Campina Grande" (quinze teclas) produz menos de cinco chamadas a `getBairros`. Com uma requisição por tecla seriam quinze.
- **C12** — atendido. Limpando a cidade, `getBairros` não é chamado. `enabled` evita a requisição em vez de mandar uma consulta que o servidor responderia vazia.
- **C13** — atendido. Com a lista de sugestões vazia — que é como uma falha de carregamento chega ao componente — não há `listbox`, e o que foi digitado continua chegando ao submit.

## O que apareceu no caminho

- **Um defeito de acessibilidade real, encontrado pelo teste.** O `listbox` usava `aria-label={rotulo}`, então o campo e a lista tinham o mesmo nome acessível: "CIDADE". A consulta por rótulo passou a encontrar dois elementos, e o motivo é o mesmo que atrapalharia uma pessoa usando leitor de tela — dois elementos com o mesmo nome, sem saber em qual está. Corrigido para "Sugestões de cidade".
- **O harness cresceu, como a spec previu.** `jsdom`, `@testing-library/react`, `@testing-library/user-event` e `@testing-library/jest-dom`; `include` passou a aceitar `.tsx` e o ambiente virou `jsdom`. Os 24 testes que já existiam continuam verdes.
- **`@vitejs/plugin-react` ficou de fora.** A versão atual exige Vite 8 e o Vitest deste projeto traz o 7; o conflito de peer não se resolve sem forçar. O esbuild do próprio Vite transforma o JSX (`esbuild.jsx: "automatic"`), e o plugin existe para Fast Refresh, que teste não usa.
- **Lint:** os mesmos 4 erros pré-existentes de antes desta frente (`anuncie/page.tsx`, `auth-context`, `perfil`, `carousel` do shadcn). Nenhum novo.
