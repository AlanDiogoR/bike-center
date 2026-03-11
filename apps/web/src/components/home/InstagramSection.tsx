"use client";

import { Instagram } from "lucide-react";

export function InstagramSection() {
  return (
    <section className="bg-gray-900 text-white py-16 md:py-24">
      <div className="max-w-container mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl uppercase tracking-[0.015em] mb-4">
          Mantenha-se conectado
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-2">
          Siga-nos no Instagram — não perca lançamentos, reposições e ofertas exclusivas.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Receba fotos reais, atualizações dos bastidores e alertas antecipados antes que
          esgotem.
        </p>
        <a
          href="https://www.instagram.com/bikecenterfartura/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-full transition-all shadow-lg"
        >
          <Instagram size={24} />
          @bikecenterfartura
        </a>
        <p className="text-gray-500 text-xs mt-4">
          Últimos posts aparecem aqui em breve.
        </p>
      </div>
    </section>
  );
}
