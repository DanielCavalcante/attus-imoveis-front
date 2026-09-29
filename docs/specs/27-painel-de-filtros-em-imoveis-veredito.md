# 27-painel-de-filtros-em-imoveis — veredito

Medido contra `573b1fa..HEAD`, escopo `.`, com `npm test` (66/66, em oito
arquivos), `npm run build` e medição em viewport de 390×844 dentro de iframe.

**São 14 critérios julgados de 15.** O C6 — seletor de tipo — está atendido; o
que ficou de fora da spec foi o quinto controle que você listou, "publicação",
cuja pergunta em aberto continua sem resposta. A spec previa isso: "enquanto
não vier a resposta, esta spec entrega os quatro filtros certos".

- **C1** — atendido. `/imoveis` mostra o painel à esquerda da lista no desktop, em coluna de 17rem, fixo ao rolar.
- **C2** — atendido. Em 390px o painel tem `display: none` e aparece um botão "Filtrar" de 52px de altura. O primeiro card começa em 483px, bem acima da dobra de 844 — a lista não foi empurrada para baixo por cinco controles.
- **C3** — atendido. Campo de cidade, com sugestões e texto livre.
- **C4** — atendido. Seletor de bairro, no modo estrito da spec 26, desabilitado enquanto não houver cidade.
- **C5** — atendido. Mínimo e máximo em campos separados, cada um com rótulo próprio.
- **C6** — atendido. Seletor de tipo com os quatro valores do enum mais "Qualquer tipo".
- **C7** — atendido. Aplicar entrega os filtros escolhidos ao pai, que navega; a lista troca pela chave do TanStack Query, sem recarregar a página.
- **C8** — atendido. `aplicar` monta a consulta com `buildAnnouncementsQuery` e chama `router.push`, então os filtros aparecem na URL.
- **C9** — atendido. Montado com `city`, `type` e `minPrice` vindos da URL, o painel abre com os três preenchidos.
- **C10** — atendido. Faixa vazia ou só com espaço produz consulta vazia.
- **C11** — atendido. "Limpar filtros" entrega `FILTROS_VAZIOS` de uma vez.
- **C12** — atendido. A contagem lê `totalElements` da página filtrada, e o título compõe o recorte ("Apartamentos em Manaíra, João Pessoa") em vez de dizer "Todos os imóveis".
- **C13** — atendido. Os cinco controles têm `label[for]` apontando para o `id` de cada um; os dois de preço usam rótulo visualmente oculto porque a legenda do `fieldset` já nomeia a faixa.
- **C14** — atendido. Todos os controles são nativos (`input`, `select`, `button`), sem `tabindex` e sem `div` com `onClick`.
- **C15** — atendido. Mínimo 900.000 com máximo 100.000 mostra "O mínimo está acima do máximo" em `role="alert"` e **desabilita** o botão: a consulta não é montada. É a dívida que a spec 18 deixou explicitamente para a tela.

## Observações que não são critério

- **Um defeito de acessibilidade encontrado pelo teste, de novo.** O botão de limpar tudo se chamava "Limpar", e os campos de cidade e bairro têm cada um o seu "Limpar cidade" e "Limpar bairro": três botões com nome parecido deixam quem usa leitor de tela sem saber qual apaga o quê. Virou "Limpar filtros".
- **Trocar a cidade invalida o bairro escolhido também aqui**, pelo mesmo motivo da home — bairro de João Pessoa preso num filtro de Recife devolveria lista vazia sem explicar por quê.
- **O estado mora na URL, e o painel guarda rascunho.** Ele só aplica no submit; enquanto isso a lista não pisca a cada tecla. Voltar pelo navegador reabre o painel com o que aquela URL tinha.
- **O estado vazio mudou de texto.** Antes dizia "Ainda não há imóveis publicados", o que passaria a ser mentira quando o acervo tem imóveis e o recorte não. Agora sugere afrouxar o recorte ou limpar os filtros.
- **A ordenação continua fora do painel**, à direita, junto da busca por termo — é onde estava, e movê-la depende da resposta sobre "publicação".
