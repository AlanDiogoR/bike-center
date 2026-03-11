import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-4">
      <a
        href="https://www.instagram.com/bikecenterfartura/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-brand-primary hover:opacity-90 transition-opacity"
        aria-label="Instagram @bikecenterfartura"
      >
        <Instagram size={20} strokeWidth={1.5} />
        <span className="text-sm">@bikecenterfartura</span>
      </a>
      <a
        href="https://wa.me/5514996325919"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#25D366] hover:opacity-90 transition-opacity"
        aria-label="WhatsApp (14) 99632-5919"
      >
        <WhatsAppIcon className="w-5 h-5" />
        <span className="text-sm">(14) 99632-5919</span>
      </a>
      <a
        href="https://www.tiktok.com/@bikecenterfartura"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors"
        aria-label="TikTok @bikecenterfartura"
      >
        <TikTokIcon className="w-5 h-5" />
        <span className="text-sm">@bikecenterfartura</span>
      </a>
    </div>
  );
}
