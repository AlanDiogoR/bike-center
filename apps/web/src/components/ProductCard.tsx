"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/api";
import { pickListingImage } from "@/lib/product-images";
import { formatBRL } from "@/lib/site";
import { useCartStore } from "@/store/cart.store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const imageUrl = pickListingImage(product.images);

  const isOnSale = product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col min-w-0">
      <Link href={`/produtos/${product.slug}`} className="block min-w-0">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              fetchPriority="low"
              className="object-contain object-center p-2"
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
        <div className="p-3 sm:p-4">
          {product.category && (
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-brand-primary transition-colors mt-1">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`text-base sm:text-lg font-bold ${isOnSale ? "text-brand-onSale" : "text-gray-900"}`}>
              {formatBRL(product.price)}
            </span>
            {isOnSale && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatBRL(product.compareAtPrice!)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Vitrine — consulte WhatsApp</p>
        </div>
      </Link>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: pickListingImage(product.images),
              quantity: 1,
            });
            toast.success("Adicionado ao carrinho");
          }}
          className="w-full flex items-center justify-center gap-2 min-h-11 py-2.5 bg-brand-cta hover:bg-brand-ctaHover text-white font-semibold rounded-full transition-colors shadow-sm text-sm"
        >
          <ShoppingCart size={16} />
          Adicionar
        </button>
      </div>
    </article>
  );
}
