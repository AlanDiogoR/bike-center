import { STORE, WHATSAPP, whatsappUrl } from "@/lib/site";

export const metadata = {
  title: "Fale Conosco",
  description: `Bike Center Fartura — ${STORE.street}. WhatsApp Claro ${WHATSAPP.claro.display} e Vivo ${WHATSAPP.vivo.display}.`,
};

export default function ContatoPage() {
  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-text uppercase tracking-[0.015em] mb-8">
        Fale Conosco
      </h1>
      <div className="max-w-xl space-y-4 text-gray-700">
        <p>
          Loja física em Fartura-SP. Peça orçamento no WhatsApp, visite o showroom ou compre pelo Mercado Livre.
        </p>
        <p>
          <strong>Endereço:</strong> {STORE.street} — {STORE.neighborhood}, {STORE.city}/{STORE.state} · CEP{" "}
          {STORE.postalCode}
        </p>
        <p>
          <strong>Horário:</strong> {STORE.hoursShort}
        </p>
        <p>
          <strong>WhatsApp Claro:</strong>{" "}
          <a href={whatsappUrl("claro")} className="text-brand-primary hover:underline">
            {WHATSAPP.claro.display}
          </a>
        </p>
        <p>
          <strong>WhatsApp Vivo:</strong>{" "}
          <a href={whatsappUrl("vivo")} className="text-brand-primary hover:underline">
            {WHATSAPP.vivo.display}
          </a>
        </p>
        <p className="text-sm text-gray-500">Resposta rápida no horário da loja.</p>
        <p>
          <strong>E-mail:</strong>{" "}
          <a href={`mailto:${STORE.email}`} className="text-brand-primary hover:underline">
            {STORE.email}
          </a>
        </p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a
            href={STORE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            {STORE.instagramHandle}
          </a>
        </p>
        <p>
          <strong>Mercado Livre:</strong>{" "}
          <a
            href={STORE.mercadoLivreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            Ver anúncios da loja
          </a>
        </p>
        <p>
          <strong>Maps:</strong>{" "}
          <a
            href={STORE.mapsDirUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            Como chegar
          </a>
        </p>
        <p>
          <strong>Hub de contatos:</strong>{" "}
          <a
            href={STORE.hubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            contatobikecenter.netlify.app
          </a>
        </p>
      </div>
    </div>
  );
}
