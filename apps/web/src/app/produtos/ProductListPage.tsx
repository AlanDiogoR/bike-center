"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { COPY, STORE, whatsappUrl } from "@/lib/site";
import { ProductFilters } from "./components/ProductFilters";
import { ProductEmptyState } from "./components/ProductEmptyState";
import { ProductPagination } from "./components/ProductPagination";

export function ProductListPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
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
      <section className="bg-gray-900 text-white py-8 sm:py-10">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-wide mb-2 break-words">
            {search
              ? `Busca: ${search}`
              : category
                ? categories.find((c) => c.slug === category)?.name ?? "Produtos"
                : "Catálogo"}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
            Motos, bikes, peças e oficina — loja física em Fartura-SP.
          </p>
          <p className="text-brand-primary font-semibold text-sm mt-2">{COPY.announcementPreferred}</p>
        </div>
      </section>

      <ProductFilters categories={categories} category={category} search={search} />

      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-brand-text font-medium mb-2">Catálogo indisponível no momento.</p>
            <p className="text-gray-600 text-sm mb-6">
              Peça no WhatsApp ou veja os anúncios no Mercado Livre.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl("claro")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#25D366] text-white font-semibold rounded-full"
              >
                {COPY.ctaWhatsApp}
              </a>
              <a
                href={STORE.mercadoLivreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#FFE600] text-[#2B4D9E] font-semibold rounded-full"
              >
                {COPY.ctaMercadoLivre}
              </a>
            </div>
            {process.env.NODE_ENV === "development" && (
              <p className="text-gray-400 text-xs mt-4">
                {error instanceof Error ? error.message : "Erro desconhecido"}
              </p>
            )}
          </div>
        ) : products.length === 0 ? (
          <ProductEmptyState hasCategory={Boolean(category)} />
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-gray-800">{meta?.total ?? 0}</span> produtos encontrados
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
