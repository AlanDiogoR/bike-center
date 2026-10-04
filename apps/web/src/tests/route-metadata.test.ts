import { describe, expect, it } from "vitest";
import { metadata as home } from "@/app/page";
import { metadata as produtos } from "@/app/produtos/page";
import { metadata as oficina } from "@/app/oficina/page";
import { metadata as contato } from "@/app/contato/page";
import { siteUrl } from "@/lib/site";

const routes = { produtos, oficina, contato } as const;

describe("metadata por rota (PR-3)", () => {
  for (const [path, meta] of Object.entries(routes)) {
    it(`/${path}: og:url, og:title e og:description próprios`, () => {
      const og = meta.openGraph as Record<string, unknown>;
      expect(og.url).toBe(siteUrl(path));
      expect(og.title).toBeTruthy();
      expect(og.title).not.toBe("Bike Center Fartura — Motos, bikes e oficina em Fartura-SP");
      expect(og.description).toBe(meta.description);
      expect((meta.twitter as Record<string, unknown>).title).toBe(og.title);
    });

    it(`/${path}: canonical intacto`, () => {
      expect(meta.alternates?.canonical).toBe(siteUrl(path));
    });
  }

  it("title de /produtos difere da home e segue o recomendado", () => {
    expect(produtos.title).toBe("Catálogo de motos, bikes e peças");
    expect((produtos.openGraph as Record<string, unknown>).title).toBe(
      "Catálogo de motos, bikes e peças | Bike Center Fartura"
    );
    expect(JSON.stringify(home.title)).not.toContain("Catálogo");
  });

  it("não introduz preço, garantia, prazo ou frete grátis", () => {
    for (const meta of Object.values(routes)) {
      expect(String(meta.description)).not.toMatch(/R\$|garantia|prazo|frete gr[aá]tis|30 anos/i);
    }
  });
});
