import Link from "next/link";
import { WhatsAppIcon } from "./WhatsAppIcon";

const LOJA_LINKS = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/produtos?category=bicicletas", label: "Bicicletas" },
  { href: "/carrinho", label: "Carrinho" },
];

const INSTITUCIONAL_LINKS = [
  { href: "/#faq", label: "Perguntas Frequentes" },
  { href: "/aviso-legal", label: "Aviso Legal" },
  { href: "/politica-privacidade", label: "Política de Privacidade" },
  { href: "/termos-uso", label: "Termos de Uso" },
];

export function FooterNav() {
  return (
    <>
      <div>
        <h4 className="font-semibold text-brand-primary mb-4 uppercase tracking-wide text-sm">
          Loja
        </h4>
        <ul className="space-y-3 text-sm text-gray-400">
          {LOJA_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-brand-primary hover:underline transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-brand-primary mb-4 uppercase tracking-wide text-sm">
          Institucional
        </h4>
        <ul className="space-y-3 text-sm text-gray-400">
          {INSTITUCIONAL_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-brand-primary hover:underline transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-brand-primary mb-4 uppercase tracking-wide text-sm">
          Atendimento
        </h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li>
            <a
              href="mailto:bikecenterfartura@gmail.com"
              className="hover:text-brand-primary hover:underline transition-colors"
            >
              bikecenterfartura@gmail.com
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/5514996325919"
              className="hover:text-[#25D366] hover:underline transition-colors flex items-center gap-1.5"
            >
              <WhatsAppIcon className="w-4 h-4" />
              (14) 99632-5919
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/5514991667793"
              className="hover:text-[#25D366] hover:underline transition-colors flex items-center gap-1.5"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Tim (14) 99166-7793
            </a>
          </li>
          <li className="pt-2">
            <p className="text-xs text-gray-500 font-medium mb-1">Horário de atendimento</p>
            <p className="text-xs text-gray-500">Seg a Sex: 8h às 18h</p>
            <p className="text-xs text-gray-500">Sábado: 8h às 13h</p>
            <p className="text-xs text-gray-500">Domingo: Fechado</p>
          </li>
          <li>
            <Link
              href="/contato"
              className="hover:text-brand-primary hover:underline transition-colors"
            >
              Fale conosco
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
