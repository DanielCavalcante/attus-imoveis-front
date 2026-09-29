# ---- dependências ----
# Não há lockfile commitado neste repo (yarn.lock foi removido), então é npm install.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* e embutido no bundle aqui, no build -- passar em `environment`
# no runtime nao tem efeito nenhum.
ARG NEXT_PUBLIC_CONTATO_EMAIL
ARG NEXT_PUBLIC_CONTATO_TELEFONE
ENV NEXT_PUBLIC_CONTATO_EMAIL=$NEXT_PUBLIC_CONTATO_EMAIL
ENV NEXT_PUBLIC_CONTATO_TELEFONE=$NEXT_PUBLIC_CONTATO_TELEFONE

RUN npm run build

# ---- runtime ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
