import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { RETIRED_PRODUCT_SLUGS, SEED_CATEGORIES, SEED_PRODUCTS } from "@bikecenter/shared";
import { CATALOG_PRODUCT_SLUGS } from "@/lib/catalog";
import { galleryImages, isCutoutImage, pickListingImage } from "@/lib/product-images";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public");

/** Fotos de ambiente usadas na home, fora do array de produto. */
const AMBIENT_CATALOG_IMAGES = [
  "/images/catalog/ambiente/01-showroom-absolute-mtb.webp",
  "/images/catalog/ambiente/02-oficina-tambores-oleo.webp",
  "/images/catalog/ambiente/03-equipe-trio.webp",
];

/** Squad real da loja — manter no repositório mesmo fora da home. */
const SQUAD_PHOTOS = [
  "/images/equipe/equipe.jpg",
  "/images/equipe/atendente.jpg",
  "/images/equipe/atendente-capacetes.jpg",
];

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function publicUrl(file: string): string {
  return `/${path.relative(publicDir, file).split(path.sep).join("/")}`;
}

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

  it("leva 2: Barbie com galeria e MTB azul com outdoor no hero", () => {
    expect(CATALOG_PRODUCT_SLUGS).toContain("bike-infantil-barbie");
    expect(CATALOG_PRODUCT_SLUGS).toContain("mtb-azul");
    expect(CATALOG_PRODUCT_SLUGS).toContain("bicicletas-infantis");
    const barbie = SEED_PRODUCTS.find((p) => p.slug === "bike-infantil-barbie");
    const mtb = SEED_PRODUCTS.find((p) => p.slug === "mtb-azul");
    expect(barbie?.images).toHaveLength(5);
    expect(barbie?.images[0]).toMatch(/01-hero/);
    expect(mtb?.images).toHaveLength(2);
    expect(mtb?.images[0]).toMatch(/01-outdoor/);
    expect(pickListingImage(mtb?.images)).toMatch(/outdoor/);
  });

  it("motos e peças com várias fotos têm galeria", () => {
    const cg = SEED_PRODUCTS.find((p) => p.slug === "honda-cg-fan-vermelha-2010");
    const x11 = SEED_PRODUCTS.find((p) => p.slug === "capacete-x11-revo-preto-fosco");
    expect(cg?.images.length).toBeGreaterThanOrEqual(3);
    expect(x11?.images.length).toBeGreaterThanOrEqual(3);
    expect(pickListingImage(cg?.images)).toMatch(/recorte/);
    expect(pickListingImage(x11?.images)).toMatch(/recorte/);
  });

  it("cada foto do seed e da home existe e o pack não tem arquivo órfão", () => {
    const referenced = new Set<string>([
      ...SEED_PRODUCTS.flatMap((product) => product.images),
      ...AMBIENT_CATALOG_IMAGES,
    ]);

    for (const src of Array.from(referenced)) {
      const file = path.join(publicDir, src.replace(/^\//, ""));
      expect(fs.existsSync(file), src).toBe(true);
      expect(fs.statSync(file).size, src).toBeGreaterThan(0);
      expect(src.includes("WhatsApp")).toBe(false);
    }

    const catalogFiles = walkFiles(path.join(publicDir, "images/catalog")).map(publicUrl);
    expect(catalogFiles.length).toBeGreaterThan(0);
    for (const src of catalogFiles) {
      expect(referenced.has(src), src).toBe(true);
    }

    const legacyFiles = walkFiles(path.join(publicDir, "images/produtos")).map(publicUrl);
    for (const src of legacyFiles) {
      expect(referenced.has(src), src).toBe(true);
    }

    for (const src of SQUAD_PHOTOS) {
      expect(fs.existsSync(path.join(publicDir, src.replace(/^\//, ""))), src).toBe(true);
    }

    const categories = new Set<string>(SEED_CATEGORIES.map((category) => category.slug));
    for (const product of SEED_PRODUCTS) {
      expect(categories.has(product.categorySlug)).toBe(true);
      expect(product.slug).toMatch(/^[a-z0-9-]+$/);
    }
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

  it("separa recorte de foto de showroom", () => {
    expect(isCutoutImage("/images/catalog/motos/honda-cg-fan-vermelha-2010/04-recorte.webp")).toBe(true);
    expect(isCutoutImage("/images/catalog/motos/honda-bros-azul/02-capa-feed.webp")).toBe(false);
    expect(isCutoutImage("/images/catalog/produtos/mtb-azul/01-outdoor.webp")).toBe(false);
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
