import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductListPage } from "./ProductListPage";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Catálogo completo de bicicletas, peças e acessórios - Bike Center",
};

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
      <ProductListPage />
    </Suspense>
  );
}
