"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { BannersGridSection } from "@/components/home/BannersSection";
import { ProductFilters } from "./components/ProductFilters";
import { ProductEmptyState } from "./components/ProductEmptyState";
import { ProductPagination } from "./components/ProductPagination";

export function ProductListPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const hasSearch = Boolean(search || category);

  const { data: productsData, isLoading, isError, error } = useQuery({
    queryKey: ["products", { page, limit: 12, category, search }],
    queryFn: () => getProducts({ page, limit: 12, category, search }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const products = productsData?.data ?? [];
  const meta = productsData?.meta;
  const categories = categoriesData?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide mb-4">
            {search
              ? `Busca: ${search}`
              : category
                ? categories.find((c) => c.slug === category)?.name ?? "Produtos"
                : "Catálogo de Produtos"}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-2">
            Bicicletas, peças, acessórios e tudo para sua aventura sobre duas rodas.
          </p>
          <p className="text-brand-primary font-semibold">Frete grátis em compras acima de R$ 199</p>
        </div>
      </section>

      {hasSearch && (
        <section className="max-w-container mx-auto px-4 sm:px-6 py-8">
          <BannersGridSection />
        </section>
      )}

      <ProductFilters categories={categories} category={category} search={search} />

      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-96 animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-brand-error font-medium mb-2">Não foi possível carregar os produtos.</p>
            <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
            <p className="text-gray-500 text-sm mt-2">Verifique se a API está rodando em http://localhost:3333</p>
          </div>
        ) : products.length === 0 ? (
          <ProductEmptyState hasCategory={Boolean(category)} />
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-gray-800">{meta?.total ?? 0}</span> produtos encontrados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <ProductPagination
              page={page}
              total={meta?.total ?? 0}
              limit={12}
              category={category}
              search={search}
            />
          </>
        )}
      </div>
    </div>
  );
}
