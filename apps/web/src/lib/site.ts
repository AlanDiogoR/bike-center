/** Dados oficiais da loja física — fonte única para copy, NAP, SEO e JSON-LD. */

export const STORE = {
  name: "Bike Center Fartura",
  legalName: "Bike Center Fartura Comércio de Bicicletas Ltda",
  tagline: "Há mais de 30 anos em Fartura",
  street: "Rua Mário Stella, 355",
  neighborhood: "Vila Nova",
  city: "Fartura",
  state: "SP",
  postalCode: "18870-000",
  country: "BR",
  latitude: -23.3883268,
  longitude: -49.5062797,
  email: "bikecenterfartura@gmail.com",
  instagramHandle: "@bikecenterfartura",
  instagramUrl: "https://www.instagram.com/bikecenterfartura/",
  tiktokUrl: "https://www.tiktok.com/@bikecenterfartura",
  hubUrl: "https://contatobikecenter.netlify.app",
  mercadoLivreUrl: "https://lista.mercadolivre.com.br/_CustId_569984748",
  mapsDirUrl:
    "https://www.google.com/maps/dir/?api=1&destination=-23.3883268%2C-49.5062797",
  mapsPlaceUrl:
    "https://www.google.com/maps/place/Bike+Center+Fartura/@-23.3883268,-49.5062797,17z",
  hoursShort: "Seg–Sex 8h–18h · Sáb 8h–13h · Dom fechado",
  hoursLines: ["Seg a Sex: 8h às 18h", "Sábado: 8h às 13h", "Domingo: Fechado"],
  defaultOgImage: "/images/og-default.jpg",
  heroImage: "/images/hero/showroom-absolute.jpg",
} as const;

export const WHATSAPP = {
  claro: {
    label: "Claro",
    display: "(14) 99166-7793",
    e164: "5514991667793",
  },
  vivo: {
    label: "Vivo",
    display: "(14) 99632-5919",
    e164: "5514996325919",
  },
} as const;

const WHATSAPP_QUOTE_TEXT =
  "Olá! Gostaria de pedir um orçamento na Bike Center Fartura.";

export function whatsappUrl(
  line: keyof typeof WHATSAPP = "claro",
  text: string = WHATSAPP_QUOTE_TEXT
): string {
  const phone = WHATSAPP[line].e164;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Remove barras finais para evitar `vercel.app//produtos`. */
export function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
}

export function getApiUrl(): string {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333");
}

export function joinUrl(base: string, path = ""): string {
  const root = stripTrailingSlash(base);
  const suffix = path.replace(/^\/+/, "");
  if (!suffix) return root;
  return `${root}/${suffix}`;
}

export function siteUrl(path = ""): string {
  return joinUrl(getSiteUrl(), path);
}

export function apiUrl(path = ""): string {
  return joinUrl(getApiUrl(), path);
}

export const COPY = {
  announcementPreferred: "Envio pelo Mercado Livre · Retire na loja em Fartura-SP",
  announcementAlt: "Compras acima de R$ 250 — frete grátis via Mercado Livre (Brasil)",
  heroTitle: "Motos, bikes e oficina em Fartura-SP",
  heroSubtitle: "Há mais de 30 anos · novas, seminovas, peças e manutenção",
  ctaWhatsApp: "Pedir orçamento no WhatsApp",
  ctaMercadoLivre: "Ver no Mercado Livre",
  trustStore: "Bike Center Fartura — loja física na Rua Mário Stella, 355",
  trustChannels: "WhatsApp · Mercado Livre · oficina e peças",
  returns: "Troca ou devolução em até 14 dias — fale no WhatsApp que a gente resolve.",
  supportHours: `${STORE.hoursShort}. Resposta rápida no horário da loja.`,
  metaTitle: "Bike Center Fartura — Motos, bikes e oficina",
  metaDescription:
    "Bike Center Fartura na Rua Mário Stella, 355. Motos, bikes novas e seminovas, peças e oficina. Há mais de 30 anos. Envio pelo Mercado Livre ou retire na loja.",
} as const;
