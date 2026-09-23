import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COPY, formatBRL, joinUrl, publicSitemapUrls, STORE, stripTrailingSlash, WHATSAPP } from "@/lib/site";
import { CATALOG_PRODUCT_SLUGS } from "@/lib/catalog";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public");
const webSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("joinUrl / stripTrailingSlash", () => {
  it("remove barra final da origem", () => {
    expect(stripTrailingSlash("https://bike-center-web.vercel.app/")).toBe(
      "https://bike-center-web.vercel.app"
    );
    expect(stripTrailingSlash("https://bike-center-web.vercel.app///")).toBe(
      "https://bike-center-web.vercel.app"
    );
  });

  it("não gera barra dupla em /produtos", () => {
    expect(joinUrl("https://bike-center-web.vercel.app/", "/produtos")).toBe(
      "https://bike-center-web.vercel.app/produtos"
    );
    expect(joinUrl("https://bike-center-web.vercel.app/", "produtos")).toBe(
      "https://bike-center-web.vercel.app/produtos"
    );
    expect(joinUrl("https://bike-center-web.vercel.app", "/produtos/absolute-nero-3-amarela")).toBe(
      "https://bike-center-web.vercel.app/produtos/absolute-nero-3-amarela"
    );
  });

  it("origem sem path extra", () => {
    expect(joinUrl("https://bike-center-web.vercel.app/", "")).toBe(
      "https://bike-center-web.vercel.app"
    );
  });
});

describe("sitemap público", () => {
  const origin = "https://bike-center-web.vercel.app/";

  it("inclui a home, a listagem e cada slug do catálogo sem barra dupla", () => {
    const urls = publicSitemapUrls(origin, CATALOG_PRODUCT_SLUGS);
    expect(urls[0]).toBe("https://bike-center-web.vercel.app");
    expect(urls).toContain("https://bike-center-web.vercel.app/produtos");
    expect(urls).toContain("https://bike-center-web.vercel.app/contato");
    for (const slug of CATALOG_PRODUCT_SLUGS) {
      expect(urls).toContain(`https://bike-center-web.vercel.app/produtos/${slug}`);
    }
    for (const url of urls) {
      expect(url.split("://")[1]).not.toContain("//");
    }
  });
});

describe("catálogo seed", () => {
  it("tem slugs únicos para o sitemap de /produtos/[slug]", () => {
    expect(CATALOG_PRODUCT_SLUGS.length).toBeGreaterThanOrEqual(8);
    expect(new Set(CATALOG_PRODUCT_SLUGS).size).toBe(CATALOG_PRODUCT_SLUGS.length);
  });
});

describe("formatBRL", () => {
  it("formata em real brasileiro", () => {
    const compact = (value: number) => formatBRL(value).replace(/\s/g, "");
    expect(compact(2590)).toBe("R$2.590,00");
    expect(compact(9.9)).toBe("R$9,90");
  });
});

describe("hero LCP", () => {
  it("usa um WebP comprimido do showroom Absolute, sem o JPG antigo", () => {
    expect(STORE.heroImage).toBe("/images/hero/showroom-absolute.webp");
    const webp = path.join(publicDir, STORE.heroImage.replace(/^\//, ""));
    expect(fs.existsSync(webp)).toBe(true);
    expect(fs.statSync(webp).size).toBeGreaterThan(0);
    expect(fs.statSync(webp).size).toBeLessThan(150_000);
    expect(fs.existsSync(path.join(publicDir, "images/hero/showroom-absolute.jpg"))).toBe(false);
  });

  it("reserva aspect ratio e deixa um único priority no hero", () => {
    const hero = fs.readFileSync(path.join(webSrc, "components/home/HeroSection.tsx"), "utf8");
    expect(hero.match(/\bpriority\b/g)).toEqual(["priority"]);
    expect(hero).not.toMatch(/fetchPriority/);
    expect(hero).toContain('sizes="100vw"');
    expect(hero).toContain("aspect-[3/4]");
    expect(hero).toContain("lg:aspect-[2/1]");

    const belowFold = [
      "components/home/SocialProofSection.tsx",
      "components/home/BannersSection.tsx",
      "components/home/StoreVisitSection.tsx",
      "components/home/ProductGrid.tsx",
      "components/ProductCard.tsx",
    ];
    for (const file of belowFold) {
      const src = fs.readFileSync(path.join(webSrc, file), "utf8");
      expect(src, file).not.toMatch(/\bpriority\b/);
      expect(src, file).not.toMatch(/fetchPriority=["']high["']/);
    }
    expect(fs.readFileSync(path.join(webSrc, "components/home/BannersSection.tsx"), "utf8")).toContain(
      'loading="lazy"'
    );
    expect(fs.readFileSync(path.join(webSrc, "components/home/StoreVisitSection.tsx"), "utf8")).toContain(
      'loading="lazy"'
    );
  });
});

describe("prova social pós-hero", () => {
  it("mostra oficina e equipe logo após o hero, com fotos reais e sem priority", () => {
    const page = fs.readFileSync(path.join(webSrc, "app/page.tsx"), "utf8");
    const heroAt = page.indexOf("<HeroSection");
    const proofAt = page.indexOf("<SocialProofSection");
    const trustAt = page.indexOf("<TrustBar");
    expect(heroAt).toBeGreaterThanOrEqual(0);
    expect(proofAt).toBeGreaterThan(heroAt);
    expect(trustAt).toBeGreaterThan(proofAt);

    const proof = fs.readFileSync(path.join(webSrc, "components/home/SocialProofSection.tsx"), "utf8");
    const paths = [
      "/images/oficina/manutencao-honda.jpg",
      "/images/equipe/equipe.jpg",
    ];
    for (const src of paths) {
      expect(proof).toContain(src);
      const file = path.join(publicDir, src.replace(/^\//, ""));
      expect(fs.existsSync(file), src).toBe(true);
      expect(fs.statSync(file).size, src).toBeGreaterThan(0);
    }
    expect(proof).toContain('loading="lazy"');
    expect(proof).not.toMatch(/\bpriority\b/);
    expect(proof).toContain("Oficina");
    expect(proof).toContain("Equipe");
  });
});

describe("copy v1", () => {
  it("não usa tom worldwide / Tim", () => {
    expect(COPY.announcementPreferred).toMatch(/Mercado Livre/);
    expect(COPY.announcementPreferred).not.toMatch(/Todo o Mundo/i);
    expect(COPY.trustStore).toMatch(/Mário Stella/);
    expect(COPY.returns).toMatch(/14 dias/);
    expect(WHATSAPP.claro.label).toBe("Claro");
    expect(WHATSAPP.vivo.label).toBe("Vivo");
  });
});
