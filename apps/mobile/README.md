# Bike Center — Mobile

[![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo Router](https://img.shields.io/badge/Expo_Router-4-000020?style=flat-square)](https://expo.github.io/router/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=flat-square)](https://zustand-demo.pmnd.rs/)

App de clientes da Bike Center. **Expo**, **Expo Router**, **NativeWind**, **Zustand**, **React Query**.

## Stack

| Tecnologia | Uso |
|------------|-----|
| Expo SDK 54 | Runtime React Native |
| Expo Router | Roteamento baseado em arquivos |
| NativeWind | Tailwind para React Native |
| Zustand | Carrinho (AsyncStorage) |
| TanStack React Query | Dados da API |
| React Native Reanimated | Animações |

## Instalação

```bash
cd apps/mobile
pnpm install
```

## Configuração

```bash
cp .env.example .env
```

`EXPO_PUBLIC_API_URL` — use o IP da sua máquina ao rodar em dispositivo: `http://192.168.x.x:3333`

## Rodar

```bash
pnpm dev
```

Depois:
- **Android:** pressione `a` ou `pnpm android`
- **iOS:** pressione `i` ou `pnpm ios`
- **Dispositivo físico:** escaneie o QR Code com Expo Go

## Rotas

| Rota | Descrição |
|------|-----------|
| `/(tabs)/` | Home (banners + destaques) |
| `/(tabs)/catalog` | Catálogo (suporta `?category=` e `?search=`) |
| `/(tabs)/cart` | Carrinho |
| `/product/[id]` | Detalhe do produto |

## Estado

- **Zustand** — Carrinho persistido com AsyncStorage
- **React Query** — Produtos da API
