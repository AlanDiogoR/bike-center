const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

import type { ApiResponse, Product } from "@bikecenter/shared";

export type { ApiResponse, Product };

export async function fetchApi<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    const json = (await res.json()) as ApiResponse<T> | { error: { message: string } };

    if (!res.ok) {
      const err = json as { error: { message: string } };
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
}): Promise<ApiResponse<Product[]>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.category) qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return fetchApi<Product[]>(`/api/v1/products${query ? `?${query}` : ""}`);
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetchApi<Product>(`/api/v1/products/${id}`);
  return response.data;
}
