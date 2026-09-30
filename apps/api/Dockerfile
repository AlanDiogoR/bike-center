# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
# `npm install -g pnpm` installs pnpm 11, which then tries to switch to the
# monorepo packageManager (pnpm@10.0.0) through @pnpm/exe. That package ships
# no native binary for linux-x64-musl, so `pnpm install` fails with
# ERR_PNPM_PNPM_ENGINE_NO_NATIVE_BINARY. Corepack activates the pinned pnpm
# before install and skips that engine switch.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json ./
RUN corepack enable && corepack prepare --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile --filter api...
COPY apps/api ./apps/api
RUN pnpm --filter api build
RUN pnpm --filter api exec prisma generate

# Stage 2 — production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json ./
RUN corepack enable && corepack prepare --activate
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY apps/api/package.json ./apps/api/
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
EXPOSE 3333
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:3333/api/v1/health || exit 1
CMD ["node", "apps/api/dist/index.js"]
