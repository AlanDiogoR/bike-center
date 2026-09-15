import { describe, expect, it } from "vitest";
import { RETIRED_PRODUCT_SLUGS, SEED_PRODUCTS } from "@bikecenter/shared";
import { CATALOG_PRODUCT_SLUGS } from "@/lib/catalog";
import { galleryImages, pickListingImage } from "@/lib/product-images";

describe("catálogo PDP", () => {
  it("tem slugs únicos e cobre o sitemap", () => {
    expect(CATALOG_PRODUCT_SLUGS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(CATALOG_PRODUCT_SLUGS).size).toBe(CATALOG_PRODUCT_SLUGS.length);
    expect(CATALOG_PRODUCT_SLUGS).toEqual(SEED_PRODUCTS.map((p) => p.slug));
  });

  it("não mistura SKUs ambíguos de moto", () => {
    expect(CATALOG_PRODUCT_SLUGS).toContain("honda-pcx");
    expect(CATALOG_PRODUCT_SLUGS).toContain("honda-cg-fan-vermelha-2010");
    expect(CATALOG_PRODUCT_SLUGS).toContain("honda-biz-125-preta");
    expect(CATALOG_PRODUCT_SLUGS).toContain("honda-biz-125-prata");
    expect(CATALOG_PRODUCT_SLUGS).not.toContain("pcx-azul");
    expect(CATALOG_PRODUCT_SLUGS).not.toContain("moto-honda-cg-vermelha");
    for (const retired of RETIRED_PRODUCT_SLUGS) {
      expect(CATALOG_PRODUCT_SLUGS).not.toContain(retired);
    }
  });

  it("mantém shortDescription curta o suficiente para o admin API", () => {
    for (const product of SEED_PRODUCTS) {
      expect(product.shortDescription.length).toBeLessThanOrEqual(200);
      expect(product.images.length).toBeGreaterThan(0);
    }
  });

  it("motos e peças com várias fotos têm galeria", () => {
    const cg = SEED_PRODUCTS.find((p) => p.slug === "honda-cg-fan-vermelha-2010");
    const x11 = SEED_PRODUCTS.find((p) => p.slug === "capacete-x11-revo-preto-fosco");
    expect(cg?.images.length).toBeGreaterThanOrEqual(3);
    expect(x11?.images.length).toBeGreaterThanOrEqual(3);
    expect(pickListingImage(cg?.images)).toMatch(/recorte/);
    expect(pickListingImage(x11?.images)).toMatch(/recorte/);
  });
});

describe("product-images", () => {
  it("card prefere recorte, depois capa-feed", () => {
    expect(
      pickListingImage([
        "/images/catalog/motos/honda-pcx/01-lateral.webp",
        "/images/catalog/motos/honda-pcx/02-capa-feed.webp",
      ])
    ).toMatch(/capa-feed/);
    expect(
      pickListingImage([
        "/images/catalog/motos/honda-cg-fan-vermelha-2010/01-lateral-feed.webp",
        "/images/catalog/motos/honda-cg-fan-vermelha-2010/04-recorte.webp",
      ])
    ).toMatch(/recorte/);
  });

  it("PDP coloca recorte na frente e capa-feed no fim", () => {
    const ordered = galleryImages([
      "/images/x/02-capa-feed.webp",
      "/images/x/01-lateral.webp",
      "/images/x/04-recorte.webp",
    ]);
    expect(ordered[0]).toMatch(/recorte/);
    expect(ordered[1]).toMatch(/lateral/);
    expect(ordered.at(-1)).toMatch(/capa-feed/);
  });
});
