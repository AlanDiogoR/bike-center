"use client";

import { useCartStore } from "@/store/cart.store";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-brand-text opacity-50 mb-4" />
        <h2 className="font-heading font-bold text-xl uppercase tracking-[0.015em] mb-2">Carrinho vazio</h2>
        <p className="text-brand-text mb-6">
          Adicione produtos para continuar.
        </p>
        <Link
          href="/produtos"
          className="inline-flex px-6 py-3 bg-brand-cta hover:bg-brand-ctaHover text-white font-semibold rounded-full transition-colors"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading font-bold text-2xl mb-8 uppercase tracking-[0.015em]">
        Carrinho ({totalItems()})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-brand-dialog rounded-[12px] border border-gray-100"
            >
              <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {item.imageUrl && (item.imageUrl.startsWith("http") || item.imageUrl.startsWith("/")) ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🚴
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-brand-text font-bold">
                  R$ {item.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(0, item.quantity - 1))
                    }
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-brand-onSale hover:underline text-sm self-start"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 bg-brand-dialog rounded-[12px] border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Resumo</h3>
            <p className="text-xl font-bold text-brand-text mb-6">
              Total: R$ {totalPrice().toFixed(2)}
            </p>
            <Link
              href="/checkout"
              className="block w-full py-3 bg-brand-cta hover:bg-brand-ctaHover text-white font-semibold rounded-full transition-colors text-center"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
