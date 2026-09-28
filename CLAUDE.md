@AGENTS.md

# Attus Imóveis — Frontend

Next.js App Router (Next **16.2.4**, React **19.2.4**, TypeScript strict). Este repo é **metade** do projeto: o backend vive em `C:\marcos-code\attus-imoveis-back` (Spring Boot 3.3.5 / Java 21) e os dois são **o mesmo domínio**. Nunca altere um contrato aqui sem conferir o outro lado.

## Comandos

### Stack completa em Docker (caminho padrão)

O compose que sobe o projeto inteiro mora **no repo do backend** e usa este diretório como build context:

```bash
cd ../attus-imoveis-back && docker compose up -d --build   # web :3000 · api :8080 · postgres :5433
```

O `Dockerfile` daqui é multi-stage (deps → build → runner) e roda `next start`. Não há lockfile commitado, então o estágio de deps usa `npm install`.

### Local, sem container

```bash
npm install          # node_modules NÃO vem no checkout
npm run dev          # http://localhost:3000
npm run build        # roda type check — quebra em erro que o dev não pega
npm run lint         # eslint (flat config, eslint.config.mjs)
```

Não há suíte de testes configurada. O backend precisa estar de pé em `http://localhost:8080` para qualquer tela autenticada funcionar (ver `../attus-imoveis-back/CLAUDE.md`).

**`next dev` não faz type check.** Rode `npm run build` antes de dar uma tarefa por encerrada — o build é o único portão de tipos do repo.

## Estrutura

Convenção incomum: quase tudo mora **dentro de `app/`**, não na raiz.

- `app/<rota>/page.tsx` — rotas (`/`, `/imoveis`, `/anuncie`, `/anuncie/detail/[id]`, `/anuncie/edit/[id]`, `/portal/auth/login`, `/portal/auth/register`, `/portal/dashboard`, `/portal/perfil`)
- `app/components/` — componentes de domínio (menu, footer, body-cards, home-busc, private-route, user-menu)
- `app/services/` — chamadas HTTP, uma função por endpoint, sufixo `.service.ts`
- `app/hooks/` — wrappers TanStack Query sobre os services, `use-*.ts`
- `app/schemas/` — schemas Zod (fonte de verdade dos tipos de formulário)
- `app/types/` — tipos derivados dos schemas (`Announcement = AnnouncementFormData & { id }`)
- `app/contexts/auth-context.tsx` — sessão via `localStorage` + `jwt-decode`
- `components/ui/` — shadcn/ui (estilo `radix-nova`, base `neutral`, ícones lucide). **Não editar à mão**; regerar pelo CLI shadcn.
- `lib/utils.ts` — `cn()`

Alias: `@/*` → raiz do repo.

## Padrões a seguir

- **Camadas**: componente → hook (`app/hooks`) → service (`app/services`) → `api()`. Não chame `fetch` direto num componente.
- **`app/services/api.ts`** é o único ponto de rede. `BASE_URL` está **hardcoded** em `http://localhost:8080/api/v1` — se precisar de ambiente, introduza `NEXT_PUBLIC_API_URL` aqui, num lugar só.
- Endpoint protegido → passe `{ auth: true }` para `api()`; ele injeta `Authorization: Bearer <token>` do `localStorage`.
- Formulários: `react-hook-form` + `zodResolver` + schema em `app/schemas/`. O tipo vem do schema via `z.infer`, nunca escrito à mão.
- Telas privadas ficam dentro de `<PrivateRoute>` (`app/components/private-route.tsx`).
- Toasts via `sonner`. Estilo via Tailwind v4 (`@tailwindcss/postcss`; **não existe `tailwind.config.js`** apesar do `components.json` citá-lo — tokens ficam em `app/globals.css`).
- `next.config.ts` só libera imagens remotas de `images.unsplash.com`. Novo host de imagem → adicione em `remotePatterns`.

## Contrato com o backend

Base: `http://localhost:8080/api/v1`. CORS liberado apenas para `http://localhost:3000`.

| Método | Rota | Auth |
|---|---|---|
| POST | `/auth/authenticate` | pública → `{ token }` |
| POST | `/users` | pública (cadastro) |
| GET | `/users`, `/users/{id}` | JWT |
| PUT | `/users/{id}`, DELETE `/users/{id}` | JWT |
| GET | `/announcements`, `/announcements/{id}` | pública |
| GET | `/announcements/me` | JWT |
| POST | `/announcements`, PUT `/announcements/{id}` | JWT |

Enums compartilhados (strings idênticas nos dois repos):
`propertyType`: `HOUSE | APARTMENT | CONDOMINIUM | LAND` · `reason`: `SALE | RENT`.

Mudou DTO no Spring? Atualize o schema Zod correspondente em `app/schemas/` na mesma tarefa.

## Armadilhas conhecidas

- **`fullname` vs `fullName`**: o `JwtService` do backend emite a claim como `fullName`, mas `auth-context.tsx` e os schemas usam `fullname`. Num login novo, `user.fullname` vem `undefined`. Ao mexer em sessão/perfil, alinhe os dois lados em vez de remendar só aqui.
- Token e usuário ficam em `localStorage` (não em cookie), então tudo que depende de sessão é **client component**. `api.ts` toca `localStorage` direto e quebra se importado em contexto server.
- O JWT expira em 1h e não há refresh; não existe tratamento de 401 centralizado.
- `public/` tem `register.jpg` duplicado na raiz e em `public/image/`.
