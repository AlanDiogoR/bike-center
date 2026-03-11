# Bike Center — Web

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query/)

Frontend e-commerce da Bike Center. **Next.js 14** (App Router), **Tailwind**, **Zustand**, **React Query**, **Sonner** (toasts).

## Stack

| Tecnologia | Uso |
|------------|-----|
| Next.js 14 | App Router, SSR, SEO |
| Tailwind CSS | Estilização (paleta Bike Center) |
| Zustand | Carrinho |
| TanStack React Query | Dados do servidor |
| Sonner | Notificações toast |
| Framer Motion | Animações |
| React Hook Form + Zod | Formulários e validação |

## Instalação

```bash
cd apps/web
pnpm install
```

## Configuração

```bash
cp .env.example .env.local
```

Variáveis:
- `NEXT_PUBLIC_API_URL` — URL da API (ex: http://localhost:3333)
- `NEXT_PUBLIC_SITE_URL` — URL do site (para sitemap/SEO)

## Rodar

```bash
pnpm dev
```

Acesse `http://localhost:3000`

## Design System

Paleta Bike Center:

| Token | HEX | Uso |
|-------|-----|-----|
| primary | #EC6E37 | CTAs, links, marca |
| cta | #22c55e | Botões de compra |
| footerBg | #0a0a0a | Footer |
| background | #ffffff | Fundos |

## SEO

- `generateMetadata` em páginas de produto
- `sitemap.ts` e `robots.ts`
- JSON-LD (Product, BreadcrumbList) em detalhes de produto
