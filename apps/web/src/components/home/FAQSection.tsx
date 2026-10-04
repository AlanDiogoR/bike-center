"use client";

import { useState } from "react";
import { WHATSAPP, COPY } from "@/lib/site";
import { FAQ_ITEMS } from "@/lib/faq";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-24">
      <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-text uppercase tracking-[0.015em] mb-4">
        Perguntas Frequentes
      </h2>
      <p className="text-gray-600 mb-4">
        Compra local em Fartura, retirada na loja e envio pelo Mercado Livre.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        {COPY.supportHours} WhatsApp Claro {WHATSAPP.claro.display} · Vivo {WHATSAPP.vivo.display}.
      </p>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={item.q}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 min-h-11 p-4 md:p-5 text-left font-semibold text-brand-text hover:bg-gray-50 transition-colors"
            >
              <span className="min-w-0">{item.q}</span>
              <span className="text-brand-orangeText text-xl flex-shrink-0">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <div className="px-4 md:px-5 pb-4 md:pb-5 text-gray-600 text-sm md:text-base">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
