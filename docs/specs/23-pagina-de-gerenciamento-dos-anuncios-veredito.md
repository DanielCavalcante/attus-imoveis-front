# 23-pagina-de-gerenciamento-dos-anuncios — veredito

Medido contra `9d24505..HEAD`, escopo `.`, com `npm test` (46/46, em sete
arquivos), `npm run build` (13 rotas) e a stack Docker no ar, com uma conta de
teste local semeada para as observações de tela.

- **C1** — atendido. A página é `<PrivateRoute>`: sem sessão, `router.replace("/portal/auth/login")`. É o mesmo componente que já guarda as outras telas privadas.
- **C2** — atendido. Com a conta de teste, a página lista os dois anúncios, um no ar e um fora do ar, na mesma lista.
- **C3** — atendido, e provado dos dois lados. Na tela, as marcas "NO AR" e "FORA DO AR" mudaram junto com o estado real. No teste, `active: true` mostra "NO AR" e `active: false` mostra "FORA DO AR". O estado é texto, não só opacidade da foto: cor e contraste sozinhos não dizem o que está acontecendo.
- **C4** — atendido. A ação "Editar" é um `<a href="/anuncie/edit/7">` — leva ao formulário daquele anúncio, não a uma tela genérica.
- **C5** — atendido. Anúncio ativo oferece "Tirar do ar" e **não** oferece "Voltar ao ar". Na tela, o clique levou o saldo de "1 de 3 · 2 vagas livres" para "0 de 3 · 3 vagas livres".
- **C6** — atendido. Anúncio inativo oferece "Voltar ao ar" e **não** oferece "Tirar do ar". Observado na tela depois da primeira inativação.
- **C7** — atendido. Cada linha oferece "Excluir", e o clique entrega o anúncio inteiro ao manipulador, não só o id.
- **C8** — atendido. "Excluir" abre `role="dialog"` com `aria-modal="true"` e título **"Excluir “Cobertura em Manaíra”?"** — a confirmação nomeia o anúncio, como o contrato exige.
- **C9** — atendido. O saldo aparece o tempo todo: "1 de 3 no ar · 2 vagas livres". Sem vaga, o texto vira "sem vaga — tire um do ar para publicar outro", que diz o que fazer em vez de só informar o número.
- **C10** — atendido. Inativar levou o saldo de "1 de 3 · 2 vagas livres" para "0 de 3 · 3 vagas livres" sem recarregar a página. É invalidação de consulta, não manipulação manual da lista.
- **C11** — atendido. Confirmar a exclusão levou a lista de 2 para 1 `<article>`, com o diálogo fechado, sem recarregar.
- **C12** — atendido. `aoReativar` repassa a mensagem do backend, que no 409 é "Limite de 3 anuncios no ar atingido". A tradução para "erro ao reativar" esconderia a única informação útil.
- **C13** — atendido. Conta sem anúncios vê "Você ainda não anunciou" e o botão "Criar anúncio", observado na tela antes da semeadura.
- **C14** — atendido. "Editar", "Tirar do ar", "Voltar ao ar" e "Excluir" têm nome escrito. Nenhum ícone sozinho.
- **C15** — atendido. Tab percorre Editar → Tirar do ar → Excluir na ordem do documento. Todas as ações são `<a>` ou `<button>` nativos.

## Três defeitos reais encontrados por olhar a tela, e nenhum deles aparecia em teste

1. **`api()` quebrava em 204.** As três rotas novas devolvem `204 No Content` e o cliente terminava em `return response.json()`, que lança `Unexpected end of JSON input` num corpo vazio. A mutação falhava **depois** de o servidor já ter feito o trabalho. Corrigido: 204 e corpo vazio passam a devolver `undefined`.
2. **`api()` mascarava o erro real.** No caminho de falha, `await response.json()` num corpo vazio — o 403 do Spring Security não traz JSON — lançava erro de parsing por cima do erro verdadeiro, escondendo o status. Corrigido: lê como texto e só tenta interpretar se houver conteúdo.
3. **`PATCH` não estava na lista de métodos do CORS.** `setAllowedMethods` tinha GET, POST, PUT, DELETE e OPTIONS. Inativar e reativar usam PATCH, então o preflight reprovava e **o navegador nem enviava a requisição** — nada no log do servidor, e a tela falhando sem dizer por quê. É correção no repositório do backend, e entrou aqui porque foi aqui que apareceu.

O terceiro é o mais instrutivo: a suíte do backend passa com 218 testes verdes porque o MockMvc não faz preflight. Só um navegador real encontra isso.

## Observações que não são critério

- **Entrou um campo no backend que a spec 22 deveria ter trazido:** `active` no `AnnouncementListDTO`. Sem ele a página não teria como cumprir o C3 — a lista da conta não dizia quais anúncios estavam no ar.
- **A grade saiu do dashboard**, como o contrato técnico previa. O dashboard virou dois caminhos, "Meus anúncios" e "Criar anúncio", e o menu ganhou o acesso direto à página nova.
- **A automação do navegador não foi confiável nesta aba:** cliques sintéticos do CDP não chegavam aos botões, mesmo com a coordenada no centro do retângulo medido, e duas capturas de tela expiraram. As observações de C5, C8, C10 e C11 foram feitas disparando o `click()` do próprio elemento e lendo o DOM depois — evidência mais direta que a imagem.
- **`neighborhood` voltou nulo nos anúncios criados**, mesmo com CEP válido de Manaíra. É o comportamento declarado em C4 e C5 da spec 19 — o contêiner provavelmente não alcança o ViaCEP — e confirma na prática que a publicação não depende do serviço externo. Vale conferir a saída de rede do contêiner antes de dar o bairro por funcionando em produção.
