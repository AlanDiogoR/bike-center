"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => setMounted(true), []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/produtos?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
    } else {
      router.push("/produtos");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-headerBg border-b border-gray-800 shadow-lg">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/logo.svg"
                  alt="Bike Center"
                  fill
                  sizes="48px"
                  priority
                  className="object-contain invert"
                />
              </div>
              <span className="font-heading font-bold text-lg md:text-xl text-white uppercase tracking-[0.015em] hidden sm:block">
                BIKE CENTER
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-200 hover:text-brand-primary transition-colors font-medium"
              >
                Início
              </Link>
              <Link
                href="/produtos"
                className="text-gray-200 hover:text-brand-primary transition-colors font-medium"
              >
                Produtos
              </Link>
              <Link
                href="/carrinho"
                className="text-gray-200 hover:text-brand-primary transition-colors font-medium"
              >
                Carrinho
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-gray-200 hover:text-brand-primary transition-colors"
                aria-label="Minha conta"
              >
                <User size={20} />
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center gap-1"
              >
                <input
                  type="search"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 md:w-44 px-3 py-1.5 text-sm bg-gray-800 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-brand-primary focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Buscar produtos"
                  className="p-2 text-gray-200 hover:text-brand-primary transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
              <Link
                href="/produtos"
                className="sm:hidden p-2 text-gray-200 hover:text-brand-primary transition-colors"
                aria-label="Buscar produtos"
              >
                <Search size={22} />
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-200 hover:text-brand-primary transition-colors"
                aria-label={`Carrinho com ${mounted ? totalItems : 0} itens`}
              >
                <ShoppingCart size={22} />
                <span className={`absolute -top-1 -right-1 bg-brand-primary text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none ${(mounted ? totalItems : 0) > 0 ? "opacity-100" : "opacity-0"}`}>
                  {mounted ? totalItems : 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
