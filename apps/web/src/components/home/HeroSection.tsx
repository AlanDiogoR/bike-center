"use client";

import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      <Link
        href="/produtos"
        className="block relative min-h-[320px] md:min-h-[480px] aspect-[16/9] md:aspect-[21/9] group"
      >
        <Image
          src="/banner-bicicleta.jpg"
          alt="Bike Center - Bicicletas, peças e acessórios"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </Link>
    </section>
  );
}
