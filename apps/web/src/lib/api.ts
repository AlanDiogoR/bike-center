const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

import { useAuthStore } from "@/store/auth.store";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  type ApiResponse,
  type Product,
  type Category,
  type SeedProduct,
} from "@bikecenter/shared";

function seedAsProduct(product: SeedProduct): Product {
  const category = SEED_CATEGORIES.find((c) => c.slug === product.categorySlug);
  return {
    id: product.slug,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    stock: product.stock,
    images: [...product.images],
    brand: product.brand,
    category: category ? { name: category.name, slug: category.slug } : undefined,
  };
}

function paginateSeed(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}): ApiResponse<Product[]> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const q = params?.search?.trim().toLowerCase();
  let items = SEED_PRODUCTS.map(seedAsProduct);
  if (params?.category) {
    items = items.filter((p) => p.category?.slug === params.category);
  }
  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q)
    );
  }
  if (params?.minPrice != null) items = items.filter((p) => p.price >= params.minPrice!);
  if (params?.maxPrice != null) items = items.filter((p) => p.price <= params.maxPrice!);
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

function seedCategories(): ApiResponse<Category[]> {
  return {
    data: SEED_CATEGORIES.map((c) => ({
      id: c.slug,
      name: c.name,
      slug: c.slug,
      description: c.description,
      sortOrder: c.sortOrder,
    })),
  };
}

export type { ApiResponse, Product, Category };

/** Obtém headers de autenticação do auth store (client-side, em memória) */
function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token = useAuthStore.getState().getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });

    const json = (await res.json()) as
      | ApiResponse<T>
      | { error: { code: string; message: string } };

    if (!res.ok) {
      const err = json as { error: { code: string; message: string } };
      throw new Error(err.error?.message ?? "Erro na requisição");
    }

    return json as ApiResponse<T>;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Erro desconhecido");
  }
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ApiResponse<Product[]>> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.category) search.set("category", params.category);
  if (params?.search) search.set("search", params.search);
  if (params?.minPrice != null) search.set("minPrice", String(params.minPrice));
  if (params?.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
  const qs = search.toString();
  try {
    const res = await fetchApi<Product[]>(`/api/v1/products${qs ? `?${qs}` : ""}`);
    if (res.data?.length) return res;
  } catch {
    // API fora / ainda sem seed — vitrine local do pack PDP.
  }
  return paginateSeed(params);
}

export async function getProduct(id: string, options?: RequestInit): Promise<Product> {
  try {
    const response = await fetchApi<Product>(`/api/v1/products/${id}`, options);
    if (response.data) return response.data;
  } catch {
    // fallback seed
  }
  const local = SEED_PRODUCTS.find((p) => p.slug === id);
  if (!local) throw new Error("Produto não encontrado");
  return seedAsProduct(local);
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const res = await fetchApi<Category[]>("/api/v1/categories");
    if (res.data?.length) return res;
  } catch {
    // fallback seed
  }
  return seedCategories();
}
