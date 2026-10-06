import type { Metadata } from "next";
import Image from "next/image";
import { CallLink, WhatsAppLink } from "@/components/contact/StoreContactLinks";
import { routeMetadata } from "@/lib/metadata";
import { STORE, WHATSAPP } from "@/lib/site";

const title = "Oficina de bikes e motos em Fartura-SP";
const description =
  "Manutenção de bikes e motos na oficina da Bike Center em Fartura-SP. Chame no WhatsApp ou ligue para combinar o horário.";

export const metadata: Metadata = routeMetadata({
  title,
  fullTitle: `${title} | Bike Center Fartura`,
  description,
  path: "oficina",
});

const WORKSHOP_PHOTO = {
  src: "/images/oficina/manutencao-honda.jpg",
  alt: "Mecânico da Bike Center Fartura fazendo manutenção em uma moto Honda na oficina",
} as const;

export default function OficinaPage() {
  return (
    <article className="bg-white text-base text-brand-text">
      <div className="max-w-3xl mx-auto min-w-0 px-4 py-10 sm:px-6 md:py-14">
        <h1 className="font-heading text-3xl font-bold leading-tight text-brand-text md:text-4xl">
          Oficina em Fartura-SP
        </h1>
        <p className="mt-4 text-lg leading-relaxed">A oficina faz manutenção de bikes e motos.</p>

        <figure className="mt-6 min-w-0">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={WORKSHOP_PHOTO.src}
              alt={WORKSHOP_PHOTO.alt}
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              loading="lazy"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="mt-2 text-lg leading-snug">Oficina da Bike Center Fartura</figcaption>
        </figure>

        <section className="mt-8" aria-labelledby="oficina-endereco">
          <h2 id="oficina-endereco" className="font-heading text-2xl font-bold text-brand-text">
            Endereço e horário
          </h2>
          <p className="mt-3 text-lg leading-relaxed">
            {STORE.street} — {STORE.neighborhood}, {STORE.city}/{STORE.state}
          </p>
          <ul className="mt-2 space-y-1 text-lg leading-relaxed">
            {STORE.hoursLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="oficina-chegar">
          <h2 id="oficina-chegar" className="font-heading text-2xl font-bold text-brand-text">
            Como chegar
          </h2>
          <p className="mt-3">
            <a
              href={STORE.mapsDirUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-brand-orange inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-center text-base font-semibold"
            >
              Como chegar
            </a>
          </p>
        </section>

        <section className="mt-8" aria-labelledby="oficina-agendar">
          <h2 id="oficina-agendar" className="font-heading text-2xl font-bold text-brand-text">
            Como agendar
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-lg leading-relaxed">
            <li>Chame no WhatsApp ou ligue.</li>
            <li>Diga o que precisa.</li>
            <li>Combine o horário e leve a bike ou a moto.</li>
          </ol>
          <div className="mt-6 flex max-w-full flex-col gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-lg font-semibold">Claro {WHATSAPP.claro.display}</p>
              <div className="flex max-w-full flex-wrap items-center gap-2">
                <WhatsAppLink line="claro" className="!text-base">
                  WhatsApp
                </WhatsAppLink>
                <CallLink line="claro" className="!text-base" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-lg font-semibold">Vivo {WHATSAPP.vivo.display}</p>
              <div className="flex max-w-full flex-wrap items-center gap-2">
                <WhatsAppLink line="vivo" className="!text-base">
                  WhatsApp
                </WhatsAppLink>
                <CallLink line="vivo" className="!text-base" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
