import { describe, expect, it } from "vitest";
import {
  RETIRED_PRODUCT_SLUGS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from "../../prisma/catalog";

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

  it("cada produto cabe no schema da API e numa categoria do seed", () => {
    const categories = new Set<string>(SEED_CATEGORIES.map((category) => category.slug));
    expect(categories.size).toBe(SEED_CATEGORIES.length);
    for (const product of SEED_PRODUCTS) {
      expect(categories.has(product.categorySlug)).toBe(true);
      expect(product.slug).toMatch(/^[a-z0-9-]+$/);
      expect(product.description.length).toBeGreaterThanOrEqual(10);
      expect(product.shortDescription.length).toBeLessThanOrEqual(200);
      expect(product.price).toBeGreaterThan(0);
      expect(Number.isInteger(product.stock)).toBe(true);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(product.images.length).toBeGreaterThan(0);
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
