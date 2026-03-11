# Bike Center — API

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square)](https://zod.dev/)

API REST do ecossistema Bike Center. **Express**, **Prisma**, **MongoDB**, **Zod**, **bcryptjs**.

## Stack

| Tecnologia | Papel |
|------------|-------|
| Express | Framework HTTP |
| Prisma | ORM (MongoDB) |
| Zod | Validação de entrada |
| bcryptjs | Hash de senhas |
| Helmet | Segurança |
| CORS | Controle de origens |

## Instalação

```bash
cd apps/api
pnpm install
```

## Configuração

```bash
cp .env.example .env
```

Preencha `DATABASE_URL` com a string do MongoDB Atlas. Use o formato:

```
mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/bikecenter?retryWrites=true&w=majority
```

**Importante:** Se a senha tiver caracteres especiais (`@`, `#`, `$`, `%`, etc.), codifique em URL (ex: `@` → `%40`).

## Banco de Dados

```bash
pnpm db:push
pnpm db:seed
```

O seed cria: **3 categorias** (Bicicletas, Peças e Componentes, Óleos e Manutenção), **3 produtos** e usuário admin.

Após o seed: **admin@bikecenter.com.br** / **Senha123!**

### Erro "Authentication failed" / "SCRAM failure: bad auth"

1. **Senha incorreta** – Confira usuário e senha no MongoDB Atlas (Database Access).
2. **Caracteres especiais** – Codifique a senha (ex: `P@ss#123` → `P%40ss%23123`).
3. **IP não liberado** – Em Network Access, adicione `0.0.0.0/0` para permitir qualquer IP (ou o IP da sua rede).
4. **Usuário sem permissão** – O usuário precisa de permissão de leitura e escrita no banco.

## Rodar

```bash
pnpm dev
```

API disponível em `http://localhost:3333`

## Rotas CRUD

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/register` | Cadastro de cliente |
| POST | `/api/v1/auth/login` | Login |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/users` | Listagem (page, limit, search, role) |
| GET | `/api/v1/users/:id` | Detalhe |
| POST | `/api/v1/users` | Criar |
| PUT | `/api/v1/users/:id` | Atualizar |
| DELETE | `/api/v1/users/:id` | Remover |

### Endereços (por usuário)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/users/:userId/addresses` | Listar |
| POST | `/api/v1/users/:userId/addresses` | Criar |
| PUT | `/api/v1/addresses/:id` | Atualizar |
| DELETE | `/api/v1/addresses/:id` | Remover |

### Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/categories` | Listagem |
| GET | `/api/v1/categories/:id` | Detalhe |
| POST | `/api/v1/categories` | Criar |
| PUT | `/api/v1/categories/:id` | Atualizar |
| DELETE | `/api/v1/categories/:id` | Remover |

### Produtos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/products` | Listagem (filtros, paginação) |
| GET | `/api/v1/products/:id` | Detalhe (aceita id ou slug) |
| POST | `/api/v1/products` | Criar |
| PUT | `/api/v1/products/:id` | Atualizar |
| DELETE | `/api/v1/products/:id` | Remover |

### Pedidos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/orders` | Listagem |
| GET | `/api/v1/orders/:id` | Detalhe |
| PUT | `/api/v1/orders/:id` | Atualizar status |

### Carrinho / Checkout
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/cart/validate` | Validar itens |
| POST | `/api/v1/checkout` | Criar pedido |

## Validação Cadastro

- **Email**: único, formato válido
- **Senha**: mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
- **Telefone**: formato BR (ex: 11999999999)
- **CPF**: opcional, formato válido
