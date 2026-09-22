import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { STORE, WHATSAPP, whatsappUrl } from "@/lib/site";

export const STORE_VISIT_PHOTOS = [
  {
    src: "/images/catalog/ambiente/03-equipe-trio.webp",
    alt: "Equipe da Bike Center Fartura na entrada da loja",
    frame: "col-span-2 aspect-[16/10] sm:aspect-[16/9]",
    sizes: "(max-width: 768px) 100vw, 50vw",
    position: "object-cover object-[center_20%]",
  },
  {
    src: "/images/catalog/ambiente/02-oficina-tambores-oleo.webp",
    alt: "Oficina da Bike Center — tambores de óleo e bancada de ferramentas",
    frame: "aspect-[4/3]",
    sizes: "(max-width: 768px) 50vw, 25vw",
    position: "object-cover",
  },
  {
    src: "/images/oficina/manutencao-honda.jpg",
    alt: "Manutenção de moto Honda na oficina da Bike Center Fartura",
    frame: "aspect-[4/3]",
    sizes: "(max-width: 768px) 50vw, 25vw",
    position: "object-cover object-center",
  },
] as const;

export function StoreVisitSection() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 min-w-0">
            {STORE_VISIT_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className={`relative rounded-2xl overflow-hidden bg-gray-200 ${photo.frame}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={photo.sizes}
                  loading="lazy"
                  fetchPriority="low"
                  className={photo.position}
                />
              </div>
            ))}
            <p className="col-span-2 text-xs text-gray-500 leading-snug">
              Oficina no mesmo endereço — fotos reais da bancada e da manutenção.
            </p>
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-text uppercase tracking-[0.015em] mb-3">
              Visite a loja em Fartura
            </h2>
            <p className="text-gray-600 mb-4">
              {STORE.tagline}. Motos, bikes novas e seminovas, peças e oficina no mesmo endereço.
            </p>
            <p className="flex items-start gap-2 text-brand-text mb-2">
              <MapPin size={20} className="flex-shrink-0 mt-0.5 text-brand-primary" />
              <span>
                {STORE.street} — {STORE.neighborhood}, {STORE.city}/{STORE.state} · CEP {STORE.postalCode}
              </span>
            </p>
            <p className="flex items-start gap-2 text-gray-600 mb-6">
              <Clock size={20} className="flex-shrink-0 mt-0.5 text-brand-primary" />
              <span>{STORE.hoursShort}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={STORE.mapsDirUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-brand-primary text-white font-semibold rounded-full text-center"
              >
                Como chegar
              </a>
              <a
                href={whatsappUrl("claro")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 border-2 border-brand-primary text-brand-primary font-semibold rounded-full text-center"
              >
                WhatsApp Claro {WHATSAPP.claro.display}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
