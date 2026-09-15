import { CATALOG_PRODUCT_SLUGS as SHARED_SLUGS } from "@bikecenter/shared";

/** Slugs do catálogo seed — usados no sitemap mesmo se a API falhar no build. */
export const CATALOG_PRODUCT_SLUGS = SHARED_SLUGS;

export type CatalogProductSlug = (typeof CATALOG_PRODUCT_SLUGS)[number];
