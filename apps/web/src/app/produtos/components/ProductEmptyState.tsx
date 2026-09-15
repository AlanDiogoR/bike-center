import { COPY, STORE, whatsappUrl } from "@/lib/site";

interface ProductEmptyStateProps {
  hasCategory: boolean;
}

export function ProductEmptyState({ hasCategory }: ProductEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
      <h2 className="font-heading font-bold text-xl text-gray-800 mb-2">
        Nenhum produto nesta lista
      </h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasCategory
          ? "Nada cadastrado nesta categoria agora. Fale no WhatsApp que a gente confirma o estoque."
          : "Vitrine em atualização. Peça orçamento no WhatsApp ou veja os anúncios no Mercado Livre."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappUrl("claro")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#25D366] text-white font-semibold rounded-full"
        >
          {COPY.ctaWhatsApp}
        </a>
        <a
          href={STORE.mercadoLivreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#FFE600] text-[#2B4D9E] font-semibold rounded-full"
        >
          {COPY.ctaMercadoLivre}
        </a>
      </div>
    </div>
  );
}
