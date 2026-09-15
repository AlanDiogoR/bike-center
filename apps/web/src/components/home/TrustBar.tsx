import { MapPin, MessageCircle, RotateCcw, Wrench } from "lucide-react";
import { COPY, STORE } from "@/lib/site";

const benefits = [
  {
    icon: MapPin,
    title: COPY.trustStore,
    description: `${STORE.hoursShort}. Como chegar no Maps.`,
  },
  {
    icon: MessageCircle,
    title: COPY.trustChannels,
    description: COPY.announcementPreferred,
  },
  {
    icon: RotateCcw,
    title: "Troca em até 14 dias",
    description: COPY.returns,
  },
  {
    icon: Wrench,
    title: "Atendimento na loja",
    description: COPY.supportHours,
  },
];

export function TrustBar() {
  return (
    <section
      className="border-y border-gray-100 bg-brand-background"
      role="region"
      aria-label="Benefícios da loja"
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 py-5 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 items-stretch">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-row items-start gap-3 p-3 sm:p-4 rounded-xl"
            >
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary" aria-hidden>
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-1 min-w-0 text-left">
                <span className="font-semibold text-sm text-brand-text leading-snug">
                  {title}
                </span>
                <span className="text-xs text-brand-text/80 leading-relaxed">
                  {description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
