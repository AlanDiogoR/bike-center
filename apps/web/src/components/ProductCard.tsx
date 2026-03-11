"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/api";
import { useCartStore } from "@/store/cart.store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const imageUrl = product.images?.[0] ?? "";

  const isOnSale = product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/produtos/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
              🚴
            </div>
          )}
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-brand-onSale text-white text-xs font-bold px-2 py-1 rounded">
              Oferta
            </span>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-primary transition-colors mt-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-lg font-bold ${isOnSale ? "text-brand-onSale" : "text-gray-900"}`}>
              R$ {product.price.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                R$ {product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.images?.[0] ?? "",
              quantity: 1,
            });
            toast.success("Adicionado ao carrinho");
          }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-brand-cta hover:bg-brand-ctaHover text-white font-semibold rounded-full transition-colors shadow-sm hover:shadow"
        >
          <ShoppingCart size={18} />
          Adicionar
        </button>
      </div>
    </article>
  );
}
