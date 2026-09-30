"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User } from "lucide-react";
import { StoreContactPair } from "@/components/contact/StoreContactLinks";
import { useCartStore } from "@/store/cart.store";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => setMounted(true), []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-headerBg border-b border-gray-800 shadow-lg">
        <div className="max-w-container mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 min-w-0">
            <Link href="/" className="flex items-center gap-2 min-w-0 min-h-11 shrink">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Bike Center Fartura"
                  fill
                  sizes="48px"
                  className="object-contain invert"
                />
              </div>
              <span className="font-heading font-bold text-sm sm:text-lg md:text-xl text-white uppercase tracking-[0.015em] truncate">
                BIKE CENTER
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-200 hover:text-brand-primary transition-colors font-medium min-h-11 inline-flex items-center"
              >
                Início
              </Link>
              <Link
                href="/produtos"
                className="text-gray-200 hover:text-brand-primary transition-colors font-medium min-h-11 inline-flex items-center"
              >
                Produtos
              </Link>
              <Link
                href="/contato"
                className="text-gray-200 hover:text-brand-primary transition-colors font-medium min-h-11 inline-flex items-center"
              >
                Contato
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-gray-200 hover:text-brand-primary transition-colors min-h-11 min-w-11 justify-center"
                aria-label="Minha conta"
              >
                <User size={20} />
              </Link>
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
              <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center gap-1"
              >
                <input
                  type="search"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 md:w-44 min-h-11 px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-brand-primary focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Buscar produtos"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center text-gray-200 hover:text-brand-primary transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
              <button
                type="button"
                onClick={() => setSearchOpen((open) => !open)}
                className="sm:hidden min-h-11 min-w-11 inline-flex items-center justify-center text-gray-200 hover:text-brand-primary transition-colors"
                aria-label="Buscar produtos"
                aria-expanded={searchOpen}
              >
                <Search size={22} />
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative min-h-11 min-w-11 inline-flex items-center justify-center text-gray-200 hover:text-brand-primary transition-colors"
                aria-label={`Carrinho com ${mounted ? totalItems : 0} itens`}
              >
                <ShoppingCart size={22} />
                <span className={`surface-brand-orange absolute top-0.5 right-0.5 text-xs font-bold leading-none whitespace-nowrap min-w-5 h-5 px-1 rounded-full flex items-center justify-center pointer-events-none ${(mounted ? totalItems : 0) > 0 ? "opacity-100" : "opacity-0"}`}>
                  {mounted ? totalItems : 0}
                </span>
              </button>
            </div>
          </div>
          {searchOpen && (
            <form onSubmit={handleSearch} className="sm:hidden pb-3">
              <input
                type="search"
                placeholder="Buscar bikes, capacetes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full min-h-11 px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-brand-primary focus:outline-none"
              />
            </form>
          )}
        </div>
      </header>
      <div className="bg-brand-headerBg border-b border-gray-800">
        <div className="max-w-container mx-auto px-3 sm:px-6">
          <div className="grid grid-cols-1 gap-2 py-2 min-h-[7rem] sm:min-h-[3.75rem] sm:grid-cols-2 lg:flex lg:flex-wrap">
            <StoreContactPair line="claro" surface="onDark" linkClassName="flex-1 sm:flex-none">
              WhatsApp Claro
            </StoreContactPair>
            <StoreContactPair line="vivo" surface="onDark" linkClassName="flex-1 sm:flex-none">
              WhatsApp Vivo
            </StoreContactPair>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
