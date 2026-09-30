# Encontrei — site

Frontend do **Encontrei**, portal de imóveis de João Pessoa e da Paraíba.

Next.js **16.2.4** (App Router) · React **19.2.4** · TypeScript strict ·
Tailwind **v4** · TanStack Query v5 · shadcn/ui.

> Este repositório é **metade** do projeto. A API vive em
> [`attus-imoveis-back`](https://github.com/DanielCavalcante/attus-imoveis-back)
> (Spring Boot 3.3.5 / Java 21) e os dois são **o mesmo domínio**: enum, DTO e
> rota mudam nos dois lados na mesma tarefa, nunca num só.

---

## Subir o projeto

O compose que sobe o projeto inteiro mora **no repositório da API** e usa este
diretório como contexto de build. Os dois precisam estar lado a lado.

```bash
git clone git@github.com:DanielCavalcante/attus-imoveis-front.git
git clone git@github.com:DanielCavalcante/attus-imoveis-back.git
cd attus-imoveis-back
docker compose up -d --build     # site :3000 · API :8080 · Postgres :5433
```

### Sem container

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # roda o type check — o dev não roda
npm run lint
npm test             # vitest
```

A API precisa estar de pé em `localhost:8080` para qualquer tela autenticada
funcionar.

**`next dev` não faz type check.** `npm run build` é o único portão de tipos do
repositório; rode antes de dar uma tarefa por encerrada.

## Estrutura

Convenção incomum, e vale saber antes de procurar arquivo: quase tudo mora
**dentro de `app/`**, não na raiz.

| | |
|---|---|
| `app/<rota>/page.tsx` | as rotas |
| `app/api/v1/[...caminho]/route.ts` | o caminho até a API (ver abaixo) |
| `app/api/saude/route.ts` | sonda do contêiner |
| `app/components/` | componentes de domínio |
| `app/services/` | uma função por endpoint, sufixo `.service.ts` |
| `app/hooks/` | wrappers TanStack Query sobre os services, `use-*.ts` |
| `app/schemas/` | Zod — **fonte de verdade dos tipos de formulário** |
| `app/lib/ambiente.ts` | todo endereço do sistema, e só aqui |
| `app/contexts/auth-context.tsx` | sessão |
| `components/ui/` | shadcn/ui — **não editar à mão**, regerar pelo CLI |

Alias: `@/*` → raiz do repositório.

### Rotas

| pública | |
|---|---|
| `/` | home |
| `/imoveis` | busca, com filtro de cidade, bairro, tipo, finalidade e preço |
| `/anuncie` | criar anúncio |
| `/anuncie/detail/[id]` | o imóvel |
| `/anuncie/edit/[id]` | editar — **a mesma tela da criação** |

| portal | |
|---|---|
| `/portal/auth/login` · `/register` | entrar e cadastrar |
| `/portal/dashboard` · `/anuncios` · `/perfil` · `/empresa` | a pessoa |
| `/portal/backoffice` · `/planos` · `/planos-das-empresas` | administração |

## Padrões a seguir

- **Camadas**: componente → hook (`app/hooks`) → service (`app/services`) →
  `api()`. Não chame `fetch` direto num componente.
- **`app/services/api.ts` é o único ponto de rede.** Endpoint protegido recebe
  `{ auth: true }` e ganha o `Authorization: Bearer` da sessão.
- **Endereço nenhum é escrito fora de `app/lib/ambiente.ts`** — há um teste que
  reprova `localhost` em qualquer outro arquivo de `app/`.
- Formulário: `react-hook-form` + `zodResolver` + schema em `app/schemas/`. O
  tipo vem do schema por `z.infer`, **nunca escrito à mão**.
- Tela privada fica dentro de `<PrivateRoute>`.
- Toast por `sonner`. Tokens de estilo em `app/globals.css` — **não existe
  `tailwind.config.js`**, apesar de o `components.json` citá-lo.

## O caminho até a API

Em produção **a API não tem entrada da internet**. O navegador não a alcança:
quem fala com ela é este processo, por `app/api/v1/[...caminho]/route.ts`.

```
navegador ──▶ /api/v1/…  ──▶  site  ──▶  API (entrada interna)
```

O repasse é em fluxo — `multipart` de foto atravessa sem ser remontado e sem
ser lido inteiro na memória. Ele acrescenta a credencial de serviço **junto**, e
não no lugar, do token da pessoa: a API continua sabendo quem fala.

**Nenhuma regra de negócio mora nesse arquivo.** É essa estreiteza que o mantém
um caminho e não um segundo backend — cada decisão que entrasse ali teria de ser
mantida em dois lugares, e um dos dois ficaria para trás.

Em desenvolvimento o mesmo caminho funciona sem credencial nenhuma.

## Ambiente

| variável | quando vale |
|---|---|
| `ATTUS_API_INTERNA` | **execução** — endereço da API visto pelo servidor |
| `ATTUS_CREDENCIAL_DE_SERVICO` | execução — liga a credencial do repasse |
| `NEXT_PUBLIC_SITE_URL` | **build** — vai no canonical, Open Graph e sitemap |

`NEXT_PUBLIC_*` é embutido no bundle durante o build: passá-lo em runtime não
tem efeito nenhum. O build de produção **para** sem `NEXT_PUBLIC_SITE_URL`, de
propósito — sem ele o site anunciaria ao buscador que mora em `localhost`.

## SEO

`robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx` e os ícones
seguem as convenções de arquivo do App Router. Cada imóvel tem título e Open
Graph próprios, por `generateMetadata` — são as páginas de imóvel que alguém
procura, uma por endereço, e é onde está o valor de SEO de um portal.

O sitemap é `force-dynamic`: prerenderizado no build, dentro do contêiner, ele
sairia sem nenhum anúncio.

## Testes

```bash
npm test
```

Vitest. Cobrem o contrato do caminho até a API, os endereços do sistema, os
schemas e as regras de tela que não se veem no tipo.

## Produção

Google Cloud, `terraform/`. **O site é o único ponto de entrada do sistema** —
é o único lugar de todo o domínio onde `allUsers` aparece. A API e o banco não
têm endereço na internet.

O estado deste repositório lê o da API por `terraform_remote_state`: o endereço
interno da API não é copiado aqui, é lido de lá.

O deploy dos dois repositórios é um script só, no repositório da API:

```bash
bash ../attus-imoveis-back/terraform/subir.sh
```

## Armadilhas conhecidas

- **`fullName` no token, `fullname` aqui.** O `JwtService` da API emite a claim
  como `fullName` e `auth-context.tsx` lê `fullname`. Alinhe os dois lados em
  vez de remendar um.
- **Sessão em `localStorage`, não em cookie** — então tudo que depende dela é
  client component, e `api.ts` quebra se importado em contexto de servidor.
- **O token expira em 1 h e não há refresh.** A expiração é tratada num lugar
  só, no `QueryProvider`: a sessão cai, sem tentativa repetida.
- **`page.tsx` do imóvel é client component.** O título renderiza no cliente, e
  não no HTML servido — o metadata do `layout.tsx` cobre o buscador, o corpo
  não.
