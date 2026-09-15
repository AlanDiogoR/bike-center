import { STORE, WHATSAPP, getSiteUrl, siteUrl } from "./site";

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
