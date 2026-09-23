import Image from "next/image";
import { STORE } from "@/lib/site";

/** Fotos reais já no repositório — oficina e equipe, fora do LCP do hero. */
const shots = [
  {
    src: "/images/oficina/manutencao-honda.jpg",
    alt: "Mecânico da Bike Center Fartura fazendo manutenção em uma moto Honda na oficina",
    kicker: "Oficina",
    detail: "Manutenção de moto Honda na bancada, no mesmo endereço da loja.",
    frame: "aspect-[16/10]",
    imageClass: "object-cover object-center",
    sizes: "(max-width: 768px) 100vw, 58vw",
  },
  {
    src: "/images/equipe/equipe.jpg",
    alt: "Três pessoas da equipe da Bike Center na frente da loja, com a placa BIKE CENTER",
    kicker: "Equipe",
    detail: "Quem atende na porta da loja em Fartura.",
    frame: "aspect-[4/5] md:aspect-[3/4]",
    imageClass: "object-cover object-[center_16%]",
    sizes: "(max-width: 768px) 100vw, 42vw",
  },
] as const;

export function SocialProofSection() {
  return (
    <section aria-labelledby="prova-social-titulo" className="border-b border-gray-100 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <p className="text-brand-primary font-semibold text-xs sm:text-sm uppercase tracking-wide">
          {STORE.tagline}
        </p>
        <h2
          id="prova-social-titulo"
          className="mt-2 font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-text uppercase tracking-[0.015em]"
        >
          Oficina e equipe
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600">
          Fotos da loja na {STORE.street}. A equipe na porta e a manutenção na bancada — no mesmo
          endereço.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 items-start">
          {shots.map((shot, index) => (
            <figure key={shot.src} className={`min-w-0 ${index === 0 ? "md:col-span-7" : "md:col-span-5"}`}>
              <div className={`relative overflow-hidden rounded-2xl bg-gray-200 ${shot.frame}`}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes={shot.sizes}
                  loading="lazy"
                  className={shot.imageClass}
                />
              </div>
              <figcaption className="mt-2 text-sm leading-snug text-brand-text">
                <span className="font-semibold">{shot.kicker}</span>
                <span className="text-gray-600"> — {shot.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
