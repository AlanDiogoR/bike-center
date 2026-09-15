"use client";

import Image from "next/image";
import Link from "next/link";
import { COPY, STORE, whatsappUrl } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative min-h-[420px] h-[min(70svh,640px)] sm:min-h-[480px] md:min-h-[560px]">
        <Image
          src={STORE.heroImage}
          alt="Fila de mountain bikes Absolute no showroom da Bike Center Fartura"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 flex items-end sm:items-center">
          <div className="w-full max-w-container mx-auto px-4 sm:px-6 pb-8 sm:pb-0">
            <p className="text-brand-primary font-semibold text-xs sm:text-sm uppercase tracking-wide mb-2">
              {STORE.tagline}
            </p>
            <h1 className="font-heading font-bold text-white text-[1.65rem] leading-tight sm:text-4xl md:text-5xl uppercase tracking-tight max-w-2xl">
              {COPY.heroTitle}
            </h1>
            <p className="mt-3 text-gray-100 text-sm sm:text-lg max-w-xl">
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
