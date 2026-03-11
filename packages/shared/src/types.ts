export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images: string[];
  category?: { name: string; slug: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder?: number;
}

export interface Order {
  id: string;
  userId?: string | null;
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: unknown;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: { total: number; page: number; limit: number; totalPages?: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
