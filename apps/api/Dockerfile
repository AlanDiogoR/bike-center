# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile --filter api...
COPY apps/api ./apps/api
RUN pnpm --filter api build
RUN pnpm --filter api exec prisma generate

# Stage 2 — production
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
ENV NODE_ENV=production
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
