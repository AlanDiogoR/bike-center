"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Por que comprar na Bike Center?",
    a: "Somos uma loja consolidada com mais de 30 anos no mercado. Comprar conosco garante produtos autênticos, garantia oficial e atendimento especializado.",
  },
  {
    q: "Quanto tempo leva para receber meu pedido?",
    a: "A entrega normalmente leva 7 a 10 dias úteis. Oferecemos frete grátis em compras acima de R$ 199.",
  },
  {
    q: "Posso trocar ou devolver meu pedido?",
    a: "Sim. Oferecemos política de devolução ou troca em até 30 dias, caso você não esteja satisfeito com seu pedido.",
  },
  {
    q: "Preciso pagar impostos ou taxas na entrega?",
    a: "Não. Os valores já estão incluídos no preço final. Não há cobranças ocultas na entrega.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-container mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-brand-text uppercase tracking-[0.015em] mb-4">
        Perguntas Frequentes
      </h2>
      <p className="text-gray-600 mb-10">
        Respostas às perguntas mais comuns sobre pedidos, envio, devoluções e garantia.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Atendimento ao Cliente Premium. Disponível de segunda a sexta-feira, das 9h00 às 17h00
        (horário local). Normalmente respondemos a todas as consultas dentro de 24 horas.
      </p>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left font-semibold text-brand-text hover:bg-gray-50 transition-colors"
            >
              {item.q}
              <span className="text-brand-primary text-xl ml-2">
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
