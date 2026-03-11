const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

import { useAuthStore } from "@/store/auth.store";
import type { ApiResponse, Product, Category } from "@bikecenter/shared";

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
  return fetchApi<Product[]>(`/api/v1/products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(id: string, options?: RequestInit): Promise<Product> {
  const response = await fetchApi<Product>(`/api/v1/products/${id}`, options);
  return response.data;
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return fetchApi<Category[]>("/api/v1/categories");
}
