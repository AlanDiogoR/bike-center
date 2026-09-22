import { describe, expect, it } from "vitest";
import { COPY, formatBRL, joinUrl, publicSitemapUrls, stripTrailingSlash, WHATSAPP } from "@/lib/site";
import { CATALOG_PRODUCT_SLUGS } from "@/lib/catalog";

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
