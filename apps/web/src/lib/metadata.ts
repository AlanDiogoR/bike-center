import type { Metadata } from "next";
import { STORE, siteUrl } from "@/lib/site";

interface RouteMetadataInput {
  /** `<title>` final (já com sufixo/absoluto) — também usado em og:title e twitter:title. */
  fullTitle: string;
  /** Título para o `<title>` quando usa o template do layout ("%s | Bike Center Fartura"). */
  title: Metadata["title"];
  description: string;
  /** Caminho sem barra inicial, ex.: "produtos". */
  path: string;
}

/**
 * Metadata por rota: o Next substitui `openGraph`/`twitter` inteiros quando a página
 * os define, então repetimos url/title/description/imagem próprios da rota.
 * `alternates.canonical` segue o mesmo valor que as páginas já usavam.
 */
export function routeMetadata({ fullTitle, title, description, path }: RouteMetadataInput): Metadata {
  const url = siteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: STORE.name,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: STORE.defaultOgImage,
          width: 1200,
          height: 630,
          alt: "Showroom Absolute — Bike Center Fartura",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [STORE.defaultOgImage],
    },
  };
}
