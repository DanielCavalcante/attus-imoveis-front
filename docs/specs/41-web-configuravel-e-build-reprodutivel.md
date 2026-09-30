# 41-web-configuravel-e-build-reprodutivel

## Intenção
O site deixa de falar com `localhost` e passa a ser construído de forma
reprodutível — condição para existir uma imagem de produção.

## Depende de
nenhuma

## Critérios

- [ ] **C1** `dominio` — nenhum arquivo de `app/` contém `localhost` fora de valor padrão de desenvolvimento declarado num lugar só.
- [ ] **C2** `contrato-api` — o navegador chama a API pela própria origem do site, sem endereço externo embutido no bundle.
- [ ] **C3** `contrato-api` — o endereço que o servidor usa para a API vem do ambiente, no momento da execução.
- [ ] **C4** `dominio` — as fotos do acervo são carregadas pela própria origem do site, e não de um host fixo.
- [ ] **C5** `dominio` — o endereço público do site vem do ambiente, e é ele que aparece em canonical, Open Graph e sitemap.
- [ ] **C6** `seguranca` — o build de produção falha quando o endereço público do site não é informado.
- [ ] **C7** `dominio` — a imagem é construída com `npm ci`, a partir do `package-lock.json`.
- [ ] **C8** `dominio` — o mesmo commit e o mesmo lockfile produzem a mesma árvore de dependências.
- [ ] **C9** `observabilidade` — existe rota de saúde que responde 200 sem depender da API.
- [ ] **C10** `dominio` — a porta do servidor vem de `PORT`, com 3000 como padrão.
- [ ] **C11** `dominio` — `docker compose up` continua funcionando sem ninguém exportar variável.

## Contrato técnico

**O que existe hoje:** `app/services/api.ts` tem
`const BASE_URL = "http://localhost:8080/api/v1"` -- é o único ponto de rede do
front, e ele aponta para a máquina de quem abre o navegador. Em produção,
nenhuma tela autenticada funciona. `app/lib/imagem.ts` tem
`const API = "http://localhost:8080"`, então toda foto do acervo quebra. O
`Dockerfile` roda `npm install` sob um comentário que diz não haver lockfile --
e o `package-lock.json` está commitado desde o CICLO-02.

**C2 e C3 são dois endereços, não um, e só um deles existe.** Em produção a API
não tem entrada da internet: o navegador não alcança nenhum endereço dela, e
por isso o bundle não carrega nenhum. Quem alcança a API é o servidor do web,
na execução, por endereço interno. Confundir os dois já custou um defeito nesta
base -- o sitemap saía sem nenhum anúncio porque `localhost`, dentro do
contêiner, é o próprio contêiner.

O mecanismo que faz C2 e C4 serem verdade é a spec 42: o front como único ponto
de entrada. Esta spec fixa o destino -- mesma origem, sem host fixo --, aquela
constrói o caminho.

Efeito colateral bom: **CORS deixa de ser problema.** Mesma origem não dispara
verificação de origem, e a lista de origens da API passa a existir só para o
desenvolvimento, onde o navegador de fato fala com `localhost:8080`.

C6 existe porque a alternativa silenciosa é pior: sem a variável, o build
embute o padrão de desenvolvimento e o site anuncia `localhost` em canonical,
Open Graph e sitemap -- para o buscador, o site inteiro passa a morar na
máquina de quem fez o deploy.

## Fora de escopo

- **O proxy que torna a mesma origem possível.** É a spec 42, e ela é o
  mecanismo desta: aqui se fixa que o navegador fala com a própria origem, lá
  se constrói por onde.
- **O Terraform.** São as specs 43 e 44, uma por repositório.
- **Renderizar as páginas de imóvel no servidor.** Elas são componentes de
  cliente e entregam casca vazia ao rastreador; é o maior item de SEO que
  sobrou e é spec própria.
- **Trocar `<img>` por `next/image`.**
- **Remover o `remotePatterns` da Unsplash do `next.config.ts`**, que ainda
  serve aos anúncios anteriores à spec 32.

## Plano

1. Um lugar só para os endereços, com o padrão de desenvolvimento explícito —
   `app/lib/ambiente.ts`.
2. Os pontos que hoje têm host fixo passam a ler dali —
   `app/services/api.ts`, `app/lib/imagem.ts`, `app/lib/site.ts`,
   `app/sitemap.ts`, `app/anuncie/detail/[id]/layout.tsx`.
3. Build reprodutível e argumentos de ambiente — `Dockerfile`,
   `../attus-imoveis-back/docker-compose.yml`.
4. Rota de saúde — `app/api/saude/route.ts`.
5. Testes por critério — `app/lib/__tests__/ambiente.test.ts`.

## Perguntas em aberto

Nenhuma.
