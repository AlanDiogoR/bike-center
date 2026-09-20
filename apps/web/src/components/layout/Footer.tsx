import Link from "next/link";
import { SocialLinks } from "./footer/SocialLinks";
import { FooterNav } from "./footer/FooterNav";
import { PaymentIcons } from "./footer/PaymentIcons";
import { STORE, WHATSAPP } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-brand-footerBg text-brand-footerText mt-auto overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="sm:col-span-2 lg:col-span-2 min-w-0">
            <h3 className="font-heading font-bold text-xl text-brand-primary uppercase tracking-[0.015em] mb-4">
              {STORE.name}
            </h3>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed mb-3">
              {STORE.tagline}. Motos, bikes novas e seminovas, peças e oficina.
            </p>
            <address className="not-italic text-sm text-gray-400 leading-relaxed mb-4">
              {STORE.street}
              <br />
              {STORE.neighborhood} · {STORE.city}/{STORE.state} · CEP {STORE.postalCode}
              <br />
              <a
                href={STORE.mapsDirUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline"
              >
                Como chegar (Google Maps)
              </a>
              {" · "}
              <a
                href={STORE.hubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline"
              >
                Hub de contato
              </a>
            </address>
            <SocialLinks />
          </div>
          <FooterNav />
        </div>

        <div className="border-t border-gray-700/80 mt-10 pt-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-xs text-gray-500">Formas de pagamento · Mercado Livre · PIX na loja</span>
            <PaymentIcons />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} {STORE.name}. WhatsApp Claro {WHATSAPP.claro.display} · Vivo {WHATSAPP.vivo.display}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <Link href="/aviso-legal" className="hover:text-brand-primary transition-colors min-h-11 inline-flex items-center">
                Aviso Legal
              </Link>
              <Link href="/politica-privacidade" className="hover:text-brand-primary transition-colors min-h-11 inline-flex items-center">
                Privacidade
              </Link>
              <Link href="/termos-uso" className="hover:text-brand-primary transition-colors min-h-11 inline-flex items-center">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
