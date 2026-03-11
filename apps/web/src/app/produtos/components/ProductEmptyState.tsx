import Link from "next/link";
import { Package } from "lucide-react";

interface ProductEmptyStateProps {
  hasCategory: boolean;
}

export function ProductEmptyState({ hasCategory }: ProductEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="flex justify-center mb-4">
        <Package className="w-16 h-16 text-gray-300" />
      </div>
      <h2 className="font-heading font-bold text-xl text-gray-800 mb-2">
        Nenhum produto encontrado
      </h2>
      <p className="text-gray-600 mb-6">
        {hasCategory
          ? "Não há produtos nesta categoria no momento."
          : "Nenhum produto cadastrado no momento."}
      </p>
      <Link
        href="/produtos"
        className="inline-block px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-gray-700 transition-colors"
      >
        Ver todos os produtos
      </Link>
    </div>
  );
}
