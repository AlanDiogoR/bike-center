import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FAQ_ITEMS, faqJsonLd } from "@/lib/faq";

const src = (f: string) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");

describe("limpeza SEO (PR-7)", () => {
  it("gaveta do carrinho não usa <h2> (fica fora do fluxo de headings)", () => {
    const drawer = src("components/layout/CartDrawer.tsx");
    expect(drawer).not.toMatch(/<h[1-6]\b/);
    expect(drawer).toContain('aria-label="Carrinho de compras"');
  });

  it("miniaturas da galeria têm alt descritivo (sem alt vazio)", () => {
    expect(src("app/produtos/[slug]/ProductDetail.tsx")).not.toContain('alt=""');
  });

  it("logo.svg do header carrega eager (acima da dobra)", () => {
    const header = src("components/layout/Header.tsx");
    expect(header).toMatch(/src="\/logo\.svg"[\s\S]*?loading="eager"/);
    expect(header).not.toMatch(/loading="lazy"/);
  });

  it("FAQPage espelha as perguntas visíveis, sem o claim de frete grátis não confirmado", () => {
    const ld = faqJsonLd();
    expect(ld["@type"]).toBe("FAQPage");
    const visible = FAQ_ITEMS.filter((i) => i.schema !== false);
    expect(ld.mainEntity.map((e) => e.name)).toEqual(visible.map((i) => i.q));
    expect(ld.mainEntity.map((e) => e.acceptedAnswer.text)).toEqual(visible.map((i) => i.a));
    expect(JSON.stringify(ld)).not.toMatch(/frete gr[aá]tis|30 anos/i);
  });

  it("home injeta o FAQPage e a FAQSection usa a mesma fonte", () => {
    expect(src("app/page.tsx")).toContain("faqJsonLd()");
    expect(src("components/home/FAQSection.tsx")).toContain("FAQ_ITEMS");
  });
});
