import Image from "next/image";
import Link from "next/link";

const tiles = [
  {
    href: "/produtos?category=bicicletas",
    src: "/images/catalog/ambiente/01-showroom-absolute-mtb.webp",
    alt: "Fila de mountain bikes Absolute no showroom da Bike Center Fartura",
    label: "Bicicletas",
    caption: "Absolute e MTB na loja",
  },
  {
    href: "/produtos",
    src: "/images/hero/loja-vestuario.jpg",
    alt: "Absolute, manequim e vestuário de ciclismo na loja em Fartura",
    label: "Loja e vestuário",
    caption: "Peças, kits e acessórios",
  },
  {
    href: "/produtos?category=motos",
    src: "/images/catalog/motos/honda-bros-azul/02-capa-feed.webp",
    alt: "Honda Bros 160 azul seminova na Bike Center Fartura",
    label: "Motos e seminovas",
    caption: "Consulte no WhatsApp",
  },
];

function TileGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {tiles.map((b) => (
        <Link
          key={b.label}
          href={b.href}
          className="group block relative overflow-hidden rounded-xl bg-gray-900 aspect-[4/5] min-h-[220px]"
        >
          <Image
            src={b.src}
            alt={b.alt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            loading="lazy"
            fetchPriority="low"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <span className="absolute bottom-4 left-4 right-4 text-white drop-shadow">
            <span className="block font-heading font-bold uppercase tracking-wide text-lg sm:text-xl">
              {b.label}
            </span>
            <span className="block text-sm text-white/85 mt-0.5">{b.caption}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function BannersSection() {
  return (
    <section>
      <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-text uppercase tracking-[0.015em] mb-4 sm:mb-6">
        Na loja agora
      </h2>
      <TileGrid />
    </section>
  );
}
