import { COPY, STORE, WHATSAPP } from "@/lib/site";

/** Fonte única das perguntas visíveis da home (FAQSection) e do JSON-LD FAQPage. */
export const FAQ_ITEMS: ReadonlyArray<{ q: string; a: string; schema?: boolean }> = [
  {
    q: "Como faço para comprar?",
    a: "Peça orçamento no WhatsApp ou compre pelo Mercado Livre. Também pode retirar na loja em Fartura-SP, na Rua Mário Stella, 355.",
  },
  {
    q: "Posso retirar na loja?",
    a: `Sim. ${STORE.street}, ${STORE.city}/${STORE.state}. ${STORE.hoursShort}.`,
  },
  {
    q: "Como funciona o envio?",
    a: "Enviamos pelo Mercado Livre para o Brasil. Compras acima de R$ 250 — frete grátis via Mercado Livre (Brasil). Ou retire na loja em Fartura.",
    // Claim "frete grátis acima de R$ 250" ainda [CONFIRMAR]: visível como hoje, mas fora do JSON-LD.
    schema: false,
  },
  {
    q: "Posso trocar ou devolver?",
    a: COPY.returns,
  },
  {
    q: "Qual o WhatsApp da loja?",
    a: `Claro ${WHATSAPP.claro.display} e Vivo ${WHATSAPP.vivo.display}. ${COPY.supportHours}`,
  },
];

/** FAQPage espelhando as perguntas visíveis (respostas idênticas ao texto da tela). */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.filter((item) => item.schema !== false).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
