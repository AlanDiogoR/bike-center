"use client";

import Image from "next/image";
import Link from "next/link";

const banners = [
  {
    href: "/produtos?category=bicicletas",
    src: "/images/hero/estoque-absolute.jpg",
    alt: "Mountain bikes Absolute no estoque da Bike Center Fartura",
    label: "Bicicletas Absolute",
  },
  {
    href: "/produtos?category=motos",
    src: "/images/produtos/moto-honda-vermelha.jpg",
    alt: "Motos e capacetes na loja em Fartura",
    label: "Motos e seminovas",
  },
  {
    href: "/produtos?category=pecas",
    src: "/images/produtos/pneus-mtb.jpg",
    alt: "Pneus Pirelli Scorpion e Chaoyang",
    label: "Peças e pneus",
  },
];

export function BannersGridSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {banners.map((b) => (
        <Link
          key={b.href}
          href={b.href}
          className="block relative overflow-hidden rounded-xl bg-gray-900 aspect-[16/10] min-h-[120px] group"
        >
          <Image
            src={b.src}
            alt={b.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <span className="absolute bottom-3 left-3 text-white font-semibold text-sm drop-shadow">
            {b.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function BannersSection() {
  return (
    <section className="space-y-4 md:space-y-8">
      {banners.map((b) => (
        <Link
          key={b.href}
          href={b.href}
          className="block relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-900 aspect-[16/9] sm:aspect-[2.5/1] md:aspect-[21/6] min-h-[140px] md:min-h-[240px] group"
        >
          <Image
            src={b.src}
            alt={b.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <span className="absolute bottom-4 left-4 text-white font-heading font-bold uppercase tracking-wide text-lg sm:text-2xl drop-shadow">
            {b.label}
          </span>
        </Link>
      ))}
    </section>
  );
}
