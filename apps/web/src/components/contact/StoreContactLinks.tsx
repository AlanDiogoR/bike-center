import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import {
  callAriaLabel,
  telHref,
  whatsappUrl,
  type WhatsAppLine,
} from "@/lib/site";

type Surface = "onLight" | "onDark";

const callClass: Record<Surface, string> = {
  onLight: "btn-call",
  onDark: "btn-call-on-dark",
};

export function CallLink({
  line,
  tone = "onLight",
  className = "",
}: {
  line: WhatsAppLine;
  tone?: Surface;
  className?: string;
}) {
  return (
    <a
      href={telHref(line)}
      className={`${callClass[tone]} min-h-11 min-w-11 gap-1.5 px-4 py-2 text-sm font-semibold ${className}`}
      aria-label={callAriaLabel(line)}
    >
      <Phone size={18} aria-hidden="true" />
      Ligar
    </a>
  );
}

export function WhatsAppLink({
  line,
  text,
  variant = "solid",
  className = "",
  children,
}: {
  line: WhatsAppLine;
  text?: string;
  variant?: "solid" | "outline";
  className?: string;
  children: ReactNode;
}) {
  const variantClass = variant === "outline" ? "btn-whatsapp-outline" : "btn-whatsapp";
  return (
    <a
      href={whatsappUrl(line, text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variantClass} min-h-11 gap-1.5 px-4 py-2 text-sm font-semibold text-center ${className}`}
    >
      {children}
    </a>
  );
}

/** WhatsApp + rótulo Ligar, os dois números da loja, alvo de toque ≥44px. */
export function StoreContactPair({
  line,
  surface,
  variant = "solid",
  text,
  linkClassName = "",
  className = "",
  children,
}: {
  line: WhatsAppLine;
  surface: Surface;
  variant?: "solid" | "outline";
  text?: string;
  linkClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 min-w-0 max-w-full ${className}`}>
      <WhatsAppLink line={line} text={text} variant={variant} className={linkClassName}>
        {children}
      </WhatsAppLink>
      <CallLink line={line} tone={surface} />
    </div>
  );
}
