import { describe, expect, it } from "vitest";
import { RETIRED_PRODUCT_SLUGS, SEED_PRODUCTS } from "../../../../packages/shared/src/catalog.ts";

describe("seed catalog", () => {
  it("não reutiliza slug/sku e aposenta SKUs genéricos", () => {
    const slugs = SEED_PRODUCTS.map((p) => p.slug);
    const skus = SEED_PRODUCTS.map((p) => p.sku);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(skus).size).toBe(skus.length);
    for (const retired of RETIRED_PRODUCT_SLUGS) {
      expect(slugs).not.toContain(retired);
    }
  });

  it("PDP de moto usa só pastas do pack (não WhatsApp raw)", () => {
    const motos = SEED_PRODUCTS.filter((p) => p.categorySlug === "motos");
    expect(motos.length).toBe(6);
    for (const moto of motos) {
      expect(moto.images.every((src) => src.startsWith("/images/catalog/motos/"))).toBe(true);
      expect(moto.images.some((src) => src.includes("WhatsApp"))).toBe(false);
    }
  });
});
