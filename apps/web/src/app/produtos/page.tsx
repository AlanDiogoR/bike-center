import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { ProductListPage, type ProductListSearchParams } from "./ProductListPage";

export const metadata: Metadata = {
  title: "Motos, bikes e oficina em Fartura-SP",
  description:
    "Catálogo da Bike Center em Fartura-SP: motos, bikes, peças e oficina. Loja na Rua Mário Stella, 355. Retire na loja ou envio pelo Mercado Livre.",
  alternates: {
    canonical: siteUrl("produtos"),
  },
};

export default function ProdutosPage({
  searchParams,
}: {
  searchParams?: ProductListSearchParams;
}) {
  return <ProductListPage searchParams={searchParams} />;
}
