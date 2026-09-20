import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductListPage } from "./ProductListPage";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo Bike Center Fartura: bikes Absolute, motos, capacetes, pneus e acessórios. Retire na loja ou envio pelo Mercado Livre.",
};

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
      <ProductListPage />
    </Suspense>
  );
}
