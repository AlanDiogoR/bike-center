"use client";

import { Instagram } from "lucide-react";
import { STORE } from "@/lib/site";

export function InstagramSection() {
  return (
    <section className="bg-gray-900 text-white py-12 md:py-24">
      <div className="max-w-container mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.015em] mb-4">
          {STORE.instagramHandle}
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-2">
          Fotos reais da loja em Fartura — bikes Absolute, motos, oficina e novidades de estoque.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Fotos e stories da loja — o embed do feed entra em um próximo passo.
        </p>
        <a
          href={STORE.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-full transition-all shadow-lg"
        >
          <Instagram size={24} />
          {STORE.instagramHandle}
        </a>
      </div>
    </section>
  );
}
