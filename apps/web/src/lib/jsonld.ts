import { galleryImages } from "./product-images";
import { STORE, WHATSAPP, getSiteUrl, siteUrl } from "./site";

export interface ProductJsonLdInput {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  images: string[];
  price: number;
  stock: number;
}

function absoluteAsset(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return siteUrl(src);
}

export function productJsonLd(product: ProductJsonLdInput) {
  const productUrl = siteUrl(`produtos/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    image: galleryImages(product.images).map(absoluteAsset),
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: STORE.name,
    },
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.price.toFixed(2),
      priceCurrency: "BRL",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "LocalBusiness",
        name: STORE.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: STORE.street,
          addressLocality: STORE.city,
          addressRegion: STORE.state,
          postalCode: STORE.postalCode,
          addressCountry: STORE.country,
        },
      },
    },
  };
}

export function breadcrumbJsonLd(name: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: getSiteUrl() },
      { "@type": "ListItem", position: 2, name: "Produtos", item: siteUrl("produtos") },
      { "@type": "ListItem", position: 3, name, item: siteUrl(`produtos/${slug}`) },
    ],
  };
}

export function localBusinessJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store", "Organization"],
    "@id": `${url}#organization`,
    name: STORE.name,
    legalName: STORE.legalName,
    url,
    image: siteUrl(STORE.defaultOgImage),
    logo: siteUrl("/logo.svg"),
    description: STORE.tagline + " — motos, bikes, peças e oficina.",
    email: STORE.email,
    telephone: [`+${WHATSAPP.claro.e164}`, `+${WHATSAPP.vivo.e164}`],
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.street,
      addressLocality: STORE.city,
      addressRegion: STORE.state,
      postalCode: STORE.postalCode,
      addressCountry: STORE.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STORE.latitude,
      longitude: STORE.longitude,
    },
    hasMap: STORE.mapsPlaceUrl,
    sameAs: [STORE.instagramUrl, STORE.tiktokUrl, STORE.hubUrl, STORE.mercadoLivreUrl],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
  };
}

export function websiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STORE.name,
    url,
    description: STORE.tagline,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/produtos?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
