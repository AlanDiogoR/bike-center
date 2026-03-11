import Link from "next/link";
import { SocialLinks } from "./footer/SocialLinks";
import { FooterNav } from "./footer/FooterNav";
import { PaymentIcons } from "./footer/PaymentIcons";

export function Footer() {
  return (
    <footer className="bg-brand-footerBg text-brand-footerText mt-auto">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <h3 className="font-heading font-bold text-xl text-brand-primary uppercase tracking-[0.015em] mb-4">
              BIKE CENTER
            </h3>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed mb-4">
              Loja consolidada com mais de 30 anos no mercado. Especialistas em bicicletas, peças,
              acessórios e produtos de manutenção ciclística.
            </p>
            <SocialLinks />
          </div>
          <FooterNav />
        </div>

        <div className="border-t border-gray-700/80 mt-12 pt-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-xs text-gray-500">Formas de pagamento</span>
            <PaymentIcons />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Bike Center. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <Link href="/aviso-legal" className="hover:text-brand-primary transition-colors">
                Aviso Legal
              </Link>
              <Link href="/politica-privacidade" className="hover:text-brand-primary transition-colors">
                Privacidade
              </Link>
              <Link href="/termos-uso" className="hover:text-brand-primary transition-colors">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
