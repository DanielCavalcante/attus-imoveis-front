# 41-web-configuravel-e-build-reprodutivel

## Intenção
O site deixa de falar com `localhost` e passa a ser construído de forma
reprodutível — condição para existir uma imagem de produção.

## Depende de
nenhuma

## Critérios

- [ ] **C1** `dominio` — nenhum arquivo de `app/` contém `localhost` fora de valor padrão de desenvolvimento declarado num lugar só.
- [ ] **C2** `contrato-api` — o endereço que o navegador usa para a API vem do ambiente, no momento do build.
- [ ] **C3** `contrato-api` — o endereço que o servidor usa para a API vem do ambiente, no momento da execução.
- [ ] **C4** `dominio` — as fotos do acervo são carregadas do endereço configurado, e não de um host fixo.
- [ ] **C5** `dominio` — o endereço público do site vem do ambiente, e é ele que aparece em canonical, Open Graph e sitemap.
- [ ] **C6** `seguranca` — o build de produção falha quando o endereço da API não é informado.
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

**C2 e C3 são dois endereços, não um.** O que o navegador alcança e o que o
servidor alcança são coisas diferentes, e confundi-los já custou um defeito
nesta base: o sitemap saía sem nenhum anúncio porque `localhost`, dentro do
contêiner, é o próprio contêiner. `NEXT_PUBLIC_*` é embutido no bundle no
build; o do servidor é lido na execução.

Disso decorre um fato que C2 obriga a encarar: **a imagem do web carrega o
endereço com que foi construída.** Uma imagem por ambiente, e a spec 42 vai
precisar saber disso para não tentar promover a mesma imagem de homologação
para produção.

C6 existe porque a alternativa silenciosa é pior: sem a variável, o build
embute o padrão de desenvolvimento e a imagem sobe funcionando para todo lado,
menos para a API.

## Fora de escopo

- **O Terraform e o pipeline de build.** É a spec 42, e ela depende desta.
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
