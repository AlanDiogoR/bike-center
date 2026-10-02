import Link from "next/link";
import { StoreContactPair } from "@/components/contact/StoreContactLinks";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { STORE, WHATSAPP } from "@/lib/site";

const LOJA_LINKS = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/oficina", label: "Oficina" },
  { href: "/produtos?category=bicicletas", label: "Bicicletas" },
  { href: "/produtos?category=motos", label: "Motos" },
  { href: "/carrinho", label: "Carrinho" },
];

const INSTITUCIONAL_LINKS = [
  { href: "/#faq", label: "Perguntas Frequentes" },
  { href: "/contato", label: "Fale conosco" },
  { href: "/aviso-legal", label: "Aviso Legal" },
  { href: "/politica-privacidade", label: "Política de Privacidade" },
  { href: "/termos-uso", label: "Termos de Uso" },
];

export function FooterNav() {
  return (
    <>
      <div className="min-w-0">
        <h4 className="font-semibold text-brand-primary mb-4 uppercase tracking-wide text-sm">
          Loja
        </h4>
        <ul className="space-y-1 text-sm text-gray-400">
          {LOJA_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-brand-primary hover:underline transition-colors min-h-11 inline-flex items-center"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <h4 className="font-semibold text-brand-primary mb-4 uppercase tracking-wide text-sm">
          Institucional
        </h4>
        <ul className="space-y-1 text-sm text-gray-400">
          {INSTITUCIONAL_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-brand-primary hover:underline transition-colors min-h-11 inline-flex items-center"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <h4 className="font-semibold text-brand-primary mb-4 uppercase tracking-wide text-sm">
          Atendimento
        </h4>
        <ul className="space-y-1 text-sm text-gray-400">
          <li>
            <a
              href={`mailto:${STORE.email}`}
              className="hover:text-brand-primary hover:underline transition-colors min-h-11 inline-flex items-center break-all"
            >
              {STORE.email}
            </a>
          </li>
          <li>
            <StoreContactPair line="vivo" surface="onDark" linkClassName="px-3">
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
              Vivo {WHATSAPP.vivo.display}
            </StoreContactPair>
          </li>
          <li>
            <StoreContactPair line="claro" surface="onDark" linkClassName="px-3">
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
              Claro {WHATSAPP.claro.display}
            </StoreContactPair>
          </li>
          <li className="pt-2">
            <p className="text-xs text-gray-500 font-medium mb-1">Horário de atendimento</p>
            {STORE.hoursLines.map((line) => (
              <p key={line} className="text-xs text-gray-500">
                {line}
              </p>
            ))}
            <p className="text-xs text-gray-500 mt-1">Resposta rápida no horário da loja.</p>
          </li>
        </ul>
      </div>
    </>
  );
}
