"use client";

import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

/**
 * Trust Bar - Benefícios estilo Pagani Design para conversão de leads orgânicos
 * Frete Grátis, Site Oficial, Devolução 14 dias, Atendimento
 */
const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis para Todo o Mundo",
    description: "Receba seu pedido em até 7 dias úteis, sem custo adicional em compras acima de R$ 250.",
  },
  {
    icon: Shield,
    title: "Site Oficial",
    description: "Bike Center — Loja Oficial. Garantia de qualidade e produtos autênticos.",
  },
  {
    icon: RotateCcw,
    title: "Política de Devolução Fácil em 14 Dias",
    description: "Política de devolução ou troca em até 14 dias caso você não esteja satisfeito com seu pedido por qualquer motivo.",
  },
  {
    icon: Headphones,
    title: "Atendimento ao Cliente",
    description: "Nossa equipe está sempre pronta para ajudar você — onde quer que esteja, garantindo uma experiência tranquila e satisfatória.",
  },
];

export function TrustBar() {
  return (
    <section
      className="border-y border-gray-100 bg-brand-background"
      role="region"
      aria-label="Benefícios da loja"
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl hover:bg-gray-50/80 transition-colors"
            >
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary" aria-hidden>
                <Icon size={24} strokeWidth={1.5} />
              </span>
              <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                <span className="font-semibold text-sm text-brand-text">
                  {title}
                </span>
                <span className="text-xs text-brand-text/80 leading-relaxed">
                  {description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
