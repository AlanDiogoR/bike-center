import type { Metadata } from "next";
import { Suspense } from "react";
import { routeMetadata } from "@/lib/metadata";
import { ProductListPage } from "./ProductListPage";

const title = "Catálogo de motos, bikes e peças";
const description =
  "Veja motos, bicicletas, capacetes e peças da Bike Center em Fartura-SP. Peça orçamento no WhatsApp ou retire na loja.";

export const metadata: Metadata = routeMetadata({
  title,
  fullTitle: `${title} | Bike Center Fartura`,
  description,
  path: "produtos",
});

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
      <ProductListPage />
    </Suspense>
  );
}
