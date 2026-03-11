"use client";

import Image from "next/image";
import Link from "next/link";

const banners = [
  {
    href: "/produtos?category=bicicletas",
    src: "/banner-bicicleta.jpg",
    alt: "Bicicletas - OGGI Hacker Sport",
  },
  {
    href: "/produtos?search=motul",
    src: "/banner-oleo.jpg",
    alt: "Óleos Motul - Manutenção",
  },
  {
    href: "/produtos?search=pneu",
    src: "/banner-pneu.jpg",
    alt: "Pneus CEAT Secura Zoom",
  },
];

/** Banners em grid (3 colunas) - usado na página de busca/categoria */
export function BannersGridSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20" />
        </Link>
      ))}
    </div>
  );
}

export function BannersSection() {
  return (
    <section className="space-y-6 md:space-y-8">
      {banners.map((b) => (
        <Link
          key={b.href}
          href={b.href}
          className="block relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-900 aspect-[2.5/1] md:aspect-[21/6] min-h-[180px] md:min-h-[240px] group"
        >
          <Image
            src={b.src}
            alt={b.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20" />
        </Link>
      ))}
    </section>
  );
}
