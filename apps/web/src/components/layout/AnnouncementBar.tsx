"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ANNOUNCEMENTS: { text: string; href: string }[] = [
  { text: "🚴 Promoção: Frete grátis em compras acima de R$ 199 - Aproveite!", href: "/produtos" },
  { text: "⚙️ Mais de 30 anos no mercado - Qualidade e confiança Bike Center", href: "/" },
  { text: "🔧 Óleos Motul, pneus CEAT e peças - Tudo para seu equipamento", href: "/produtos" },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const { text, href } = ANNOUNCEMENTS[index];
  return (
    <div
      className="bg-brand-primary text-white text-center py-2 px-4 text-xs sm:text-sm overflow-hidden"
      role="region"
      aria-label="Anúncio"
    >
      <Link href={href} className="hover:underline transition-colors block">
        {text}
      </Link>
    </div>
  );
}
