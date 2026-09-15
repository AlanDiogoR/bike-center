import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { STORE, WHATSAPP, whatsappUrl } from "@/lib/site";

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <a
        href={STORE.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-brand-primary hover:opacity-90 transition-opacity min-h-11"
        aria-label={`Instagram ${STORE.instagramHandle}`}
      >
        <Instagram size={20} strokeWidth={1.5} />
        <span className="text-sm">{STORE.instagramHandle}</span>
      </a>
      <a
        href={whatsappUrl("claro")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#25D366] hover:opacity-90 transition-opacity min-h-11"
        aria-label={`WhatsApp Claro ${WHATSAPP.claro.display}`}
      >
        <WhatsAppIcon className="w-5 h-5" />
        <span className="text-sm">Claro {WHATSAPP.claro.display}</span>
      </a>
      <a
        href={STORE.tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors min-h-11"
        aria-label="TikTok @bikecenterfartura"
      >
        <TikTokIcon className="w-5 h-5" />
        <span className="text-sm">@bikecenterfartura</span>
      </a>
    </div>
  );
}
