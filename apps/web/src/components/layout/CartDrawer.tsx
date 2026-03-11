"use client";

import { useCartStore } from "@/store/cart.store";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrinho de compras"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-heading font-bold text-lg uppercase tracking-[0.015em]">
              Carrinho ({totalItems()})
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar carrinho"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-brand-text text-center py-8">
                Seu carrinho está vazio.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-brand-text font-bold">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(0, item.quantity - 1))
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-brand-onSale hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t">
              <p className="font-bold text-lg mb-4">
                Total: R$ {totalPrice().toFixed(2)}
              </p>
              <Link
                href="/carrinho"
                onClick={onClose}
                className="block w-full py-3 bg-brand-cta hover:bg-brand-ctaHover text-white font-semibold text-center rounded-full transition-colors"
              >
                Finalizar compra
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
