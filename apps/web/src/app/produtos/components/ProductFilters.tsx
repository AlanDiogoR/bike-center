"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  category?: string;
  search?: string;
}

export function ProductFilters({ categories, category, search }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30 shadow-sm">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q") as string;
            const params = new URLSearchParams(searchParams);
            if (q?.trim()) params.set("search", q.trim());
            else params.delete("search");
            params.delete("page");
            router.push(`/produtos?${params.toString()}`);
          }}
          className="mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="search"
              name="q"
              defaultValue={search ?? ""}
              placeholder="Buscar produtos (ex: pneu, óleo, bicicleta...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-brand-text"
            />
          </div>
        </form>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/produtos"
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                !category ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produtos?category=${cat.slug}`}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  category === cat.slug ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
