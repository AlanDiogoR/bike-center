import Image from "next/image";
import Link from "next/link";
import { COPY, STORE, whatsappUrl } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative w-full min-w-full aspect-[3/4] max-h-[640px] sm:aspect-[16/10] lg:aspect-[2/1] bg-black">
        <Image
          src={STORE.heroImage}
          alt="Fila de mountain bikes Absolute no showroom da Bike Center Fartura"
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover object-[72%_42%] md:object-[78%_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-black/10" />
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full max-w-container mx-auto px-4 sm:px-6 pb-8 md:pb-0">
            <p className="text-brand-primary font-semibold text-xs sm:text-sm uppercase tracking-wide mb-2">
              {STORE.tagline}
            </p>
            <h1 className="font-heading font-bold text-white text-[1.65rem] leading-[1.15] sm:text-4xl md:text-5xl uppercase tracking-tight max-w-xl">
              Motos, bikes e oficina
              <span className="block whitespace-nowrap">em Fartura-SP</span>
            </h1>
            <p className="mt-3 text-gray-100 text-sm sm:text-lg max-w-md">
              {COPY.heroSubtitle}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-none">
              <a
                href={whatsappUrl("claro")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-full text-center text-sm sm:text-base"
              >
                {COPY.ctaWhatsApp}
              </a>
              <a
                href={STORE.mercadoLivreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center px-5 py-3 bg-[#FFE600] hover:bg-[#f5dc00] text-[#2B4D9E] font-semibold rounded-full text-center text-sm sm:text-base"
              >
                {COPY.ctaMercadoLivre}
              </a>
            </div>
            <Link
              href="/produtos"
              className="mt-4 inline-flex min-h-11 items-center text-white/90 hover:text-white text-sm underline underline-offset-4"
            >
              Ver produtos na loja
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
