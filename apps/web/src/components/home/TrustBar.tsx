import { MapPin, MessageCircle, RotateCcw, Clock } from "lucide-react";
import { COPY, STORE } from "@/lib/site";

const benefits = [
  {
    icon: MapPin,
    title: "Loja física em Fartura",
    description: COPY.trustStore,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp e Mercado Livre",
    description: COPY.trustChannels,
  },
  {
    icon: RotateCcw,
    title: "Troca em 14 dias",
    description: COPY.returns,
  },
  {
    icon: Clock,
    title: "Horário da loja",
    description: `${STORE.hoursShort}. Resposta rápida no horário da loja.`,
  },
];

export function TrustBar() {
  return (
    <section
      className="border-y border-gray-100 bg-brand-background"
      role="region"
      aria-label="Benefícios da loja"
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 py-5 md:py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 items-stretch">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-row items-start gap-3 p-2 sm:p-3">
              <span
                className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary"
                aria-hidden
              >
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-1 min-w-0 text-left">
                <span className="font-semibold text-sm text-brand-text leading-snug">{title}</span>
                <span className="text-xs text-brand-text/80 leading-relaxed">{description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
