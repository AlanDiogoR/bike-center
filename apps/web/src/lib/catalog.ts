/** Slugs do catálogo seed — usados no sitemap mesmo se a API falhar no build. */
export const CATALOG_PRODUCT_SLUGS = [
  "absolute-nero-3-amarela",
  "absolute-nero-4-laranja",
  "absolute-nero-azul",
  "flex-2-0-amarela",
  "moto-honda-cg-vermelha",
  "capacetes-moto",
  "capacetes-bike",
  "luvas-e-acessorios",
  "bicicletas-infantis",
  "pneus-mtb-pirelli-chaoyang",
] as const;

export type CatalogProductSlug = (typeof CATALOG_PRODUCT_SLUGS)[number];
