"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { COPY, STORE, whatsappUrl } from "@/lib/site";

export function ProductGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page: 1, limit: 8 }],
    queryFn: () => getProducts({ page: 1, limit: 8 }),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-200 animate-pulse rounded-[12px]"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  const products = data?.data ?? [];

  if (isError || products.length === 0) {
    return (
      <div className="py-10 px-4 text-center bg-white border border-gray-100 rounded-xl">
        <p className="text-brand-text font-medium mb-2">Vitrine em atualização.</p>
        <p className="text-gray-600 text-sm mb-5">
          Peça orçamento no WhatsApp ou veja o estoque no Mercado Livre.
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
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
