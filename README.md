# 🚲 Bike Center

[![CI](https://github.com/SEU_USUARIO/bikecenter/actions/workflows/ci.yml/badge.svg)](https://github.com/SEU_USUARIO/bikecenter/actions/workflows/ci.yml)
[![Deploy](https://github.com/SEU_USUARIO/bikecenter/actions/workflows/deploy.yml/badge.svg)](https://github.com/SEU_USUARIO/bikecenter/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Expo](https://img.shields.io/badge/Expo-54-000?logo=expo)](https://expo.dev)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-orange?logo=pnpm)](https://pnpm.io)

> Plataforma completa de e-commerce para loja de bicicletas — API REST, loja web e app mobile.

## 📋 Índice

- [Stack](#-stack)
- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [Pré-requisitos](#-pré-requisitos)
- [Setup Local](#-setup-local)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts](#-scripts)
- [Deploy](#-deploy)
- [Arquitetura](#-arquitetura)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🛠 Stack

| Camada    | Tecnologia                              |
|-----------|-----------------------------------------|
| API       | Node.js 20 + Express 4 + Prisma 6       |
| Banco     | MongoDB Atlas                           |
| Auth      | JWT + bcryptjs                          |
| Web       | Next.js 14 App Router + Tailwind CSS    |
| Mobile    | Expo 54 + Expo Router + NativeWind       |
| Estado    | Zustand 5 + TanStack Query 5             |
| Validação | Zod                                     |
| Deploy    | Railway (API) + Vercel (Web)            |
| CI/CD     | GitHub Actions                          |
| Container | Docker + docker-compose                 |

## 📁 Estrutura do Monorepo

```
bikecenter/
├── apps/
│   ├── api/      # REST API Express/Prisma
│   ├── web/      # Next.js storefront
│   └── mobile/   # Expo React Native app
├── packages/
│   ├── shared/   # Tipos TypeScript compartilhados
│   └── cart-store/ # Zustand cart store universal
├── .github/
│   └── workflows/ # CI/CD pipelines
└── docker-compose.yml
```

## 📦 Pré-requisitos

- Node.js >= 20
- pnpm >= 9
- Docker (opcional, para rodar localmente com container)
- MongoDB Atlas (ou instância local)

## 🚀 Setup Local

```bash
# 1. Clonar e instalar
git clone https://github.com/SEU_USUARIO/bikecenter.git
cd bikecenter
pnpm install

# 2. Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Editar os arquivos .env com suas configurações

# 3. Preparar banco de dados
pnpm --filter api db:migrate
pnpm --filter api db:seed

# 4. Iniciar em desenvolvimento
pnpm dev
```

## 🔧 Variáveis de Ambiente

### API (apps/api/.env)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| DATABASE_URL | ✅ | Connection string MongoDB Atlas |
| JWT_SECRET | ✅ | Secret para assinar tokens JWT (min 32 chars) |
| PORT | ❌ | Porta da API (padrão: 3333) |
| CORS_ORIGIN | ✅ | Origin permitida pelo CORS |
| API_URL | ✅ | URL pública da API (para URLs de imagens) |
| SEED_ADMIN_EMAIL | ❌ | Email do admin seed (padrão: admin@...) |
| SEED_ADMIN_PASSWORD | ✅ | Senha do admin seed |
| NODE_ENV | ✅ | production / development |

### Web (apps/web/.env.local)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| NEXT_PUBLIC_API_URL | ✅ | URL da API (acessada pelo browser) |
| NEXT_PUBLIC_API_HOSTNAME | ✅ | Hostname da API (para next/image) |

## 📜 Scripts

```bash
pnpm dev                    # Inicia todos os apps em modo desenvolvimento
pnpm build                  # Build de todos os apps
pnpm --filter api test      # Testes da API
pnpm --filter api test:coverage  # Coverage da API
pnpm --filter web test      # Testes do Web
pnpm --filter api db:migrate    # Aplica migrations (dev)
pnpm --filter api db:deploy     # Aplica migrations (produção)
pnpm --filter api db:seed       # Popula banco com dados iniciais
docker compose up -d        # Sobe API em container Docker
```

## 🌐 Deploy

- **API — Railway**: Conectar repositório, configurar env vars, push para main dispara deploy.
- **Web — Vercel**: Importar repo, Root Directory: apps/web, configurar env vars.

### Secrets GitHub necessários

- RAILWAY_TOKEN
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

## 🏗 Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Next.js Web   │────▶│   Express API     │────▶│  MongoDB Atlas │
│   (Vercel)      │     │   (Railway)       │     │   (Cloud)      │
└─────────────────┘     └──────────────────┘     └────────────────┘
                                 ▲
┌─────────────────┐              │
│   Expo Mobile   │──────────────┘
│   (EAS Build)   │
└─────────────────┘
```

Fluxo de autenticação: POST /api/v1/auth/login → JWT. Web: Zustand (memória). Mobile: SecureStore.

## 🤝 Contribuindo

1. Faça fork do repositório
2. Crie sua branch: `git checkout -b feat/nome-da-feature`
3. Commit: `git commit -m "feat: descrição clara"`
4. Push: `git push origin feat/nome-da-feature`
5. Abra um Pull Request para develop

## 📄 Licença

MIT © Seu Nome
