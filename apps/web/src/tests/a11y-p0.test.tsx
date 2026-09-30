import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CallLink } from "@/components/contact/StoreContactLinks";
import { contrastRatio } from "@/lib/contrast";
import { COPY, callAriaLabel, telHref } from "@/lib/site";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = path.join(webRoot, "src");

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full;
  });
}

function read(rel: string): string {
  return fs.readFileSync(path.join(srcRoot, rel), "utf8");
}

describe("tel: da loja", () => {
  it("usa os hrefs exatos dos dois números", () => {
    expect(telHref("claro")).toBe("tel:+5514991667793");
    expect(telHref("vivo")).toBe("tel:+5514996325919");
    expect(callAriaLabel("claro")).toBe("Ligar para Claro (14) 99166-7793");
    expect(callAriaLabel("vivo")).toBe("Ligar para Vivo (14) 99632-5919");
  });

  it("renderiza Ligar com alvo de toque e aria-label", () => {
    render(
      <>
        <CallLink line="claro" />
        <CallLink line="vivo" tone="onDark" />
      </>
    );
    const claro = screen.getByRole("link", { name: "Ligar para Claro (14) 99166-7793" });
    const vivo = screen.getByRole("link", { name: "Ligar para Vivo (14) 99632-5919" });
    expect(claro.getAttribute("href")).toBe("tel:+5514991667793");
    expect(vivo.getAttribute("href")).toBe("tel:+5514996325919");
    expect(claro.textContent).toContain("Ligar");
    expect(vivo.textContent).toContain("Ligar");
    expect(claro.className).toContain("min-h-11");
    expect(vivo.className).toContain("min-h-11");
    expect(claro.className).toContain("btn-call");
    expect(vivo.className).toContain("btn-call-on-dark");
  });

  it("coloca os dois números no topo, no rodapé e na PDP, ao lado do WhatsApp", () => {
    const surfaces = [
      "components/layout/Header.tsx",
      "components/layout/footer/FooterNav.tsx",
      "app/produtos/[slug]/ProductDetail.tsx",
    ];
    for (const file of surfaces) {
      const src = read(file);
      expect(src, file).toContain('line="claro"');
      expect(src, file).toContain('line="vivo"');
      expect(src, file).toContain("StoreContactPair");
    }
    const pair = read("components/contact/StoreContactLinks.tsx");
    expect(pair).toContain("telHref");
    expect(pair).toContain("\n      Ligar\n");
    expect(pair).toContain("WhatsAppLink");
  });
});

describe("placeholder de feed", () => {
  it("não deixa a palavra embed visível no app", () => {
    const files = walk(path.join(srcRoot, "app")).concat(walk(path.join(srcRoot, "components")));
    const hits = files.filter((file) => /embed/i.test(fs.readFileSync(file, "utf8")));
    expect(hits).toEqual([]);
  });
});

describe("SEO local nas páginas-chave", () => {
  it("home, produtos, contato e PDP citam Fartura-SP, motos, bikes e oficina", () => {
    expect(COPY.metaTitle).toContain("Fartura-SP");
    expect(COPY.metaTitle).toMatch(/motos/i);
    expect(COPY.metaTitle).toMatch(/bikes/i);
    expect(COPY.metaTitle).toMatch(/oficina/i);
    expect(COPY.metaDescription).toContain("Fartura-SP");
    expect(COPY.metaDescription).toMatch(/motos/i);
    expect(COPY.metaDescription).toMatch(/bikes/i);
    expect(COPY.metaDescription).toMatch(/oficina/i);

    const home = read("app/page.tsx");
    expect(home).toContain("canonical: siteUrl()");
    expect(home).toContain("COPY.metaTitle");
    expect(home).toContain("COPY.metaDescription");

    const produtos = read("app/produtos/page.tsx");
    expect(produtos).toContain('canonical: siteUrl("produtos")');
    expect(produtos).toContain("Fartura-SP");
    expect(produtos).toMatch(/motos/i);
    expect(produtos).toMatch(/bikes/i);
    expect(produtos).toMatch(/oficina/i);

    const contato = read("app/contato/page.tsx");
    expect(contato).toContain('canonical: siteUrl("contato")');
    expect(contato).toContain("Fartura-SP");
    expect(contato).toMatch(/motos/i);
    expect(contato).toMatch(/bikes/i);
    expect(contato).toMatch(/oficina/i);
    expect(contato).toContain("Como chegar");

    const pdp = read("app/produtos/[slug]/page.tsx");
    expect(pdp).toContain("canonical: siteUrl(`produtos/${slug}`)");
    expect(pdp).toContain("Fartura-SP");
    expect(pdp).toMatch(/motos, bikes e oficina/i);

    const footer = read("components/layout/Footer.tsx");
    expect(footer).toContain("Como chegar");
    expect(footer).toContain("STORE.mapsDirUrl");
  });
});

describe("contraste dos botões de WhatsApp e Ligar", () => {
  const css = fs.readFileSync(path.join(srcRoot, "app/globals.css"), "utf8");
  const vars: Record<string, string> = {};
  const varPattern = /--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g;
  let varMatch: RegExpExecArray | null;
  while ((varMatch = varPattern.exec(css)) !== null) {
    vars[varMatch[1]] = varMatch[2].toLowerCase();
  }

  it("mede cada par fg/bg dos estados em pelo menos 4,5:1", () => {
    const foregrounds = Object.keys(vars).filter((name) => name.endsWith("-fg"));
    expect(foregrounds.length).toBeGreaterThanOrEqual(16);
    const measured = foregrounds.map((name) => {
      const key = name.slice(0, -3);
      const background = vars[`${key}-bg`];
      const foreground = vars[name];
      expect(background, name).toBeTruthy();
      const ratio = contrastRatio(foreground, background!);
      return { state: key, foreground, background, ratio: Math.round(ratio * 100) / 100 };
    });
    for (const row of measured) {
      expect(row.ratio, `${row.state} ${row.foreground} sobre ${row.background}`).toBeGreaterThanOrEqual(
        4.5
      );
    }
    expect(measured).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ state: "wa-solid", ratio: 5.07 }),
        expect.objectContaining({ state: "wa-solid-hover", ratio: 7.65 }),
        expect.objectContaining({ state: "wa-solid-focus", ratio: 5.07 }),
        expect.objectContaining({ state: "wa-solid-disabled", ratio: 10.37 }),
        expect.objectContaining({ state: "wa-outline", ratio: 5.07 }),
        expect.objectContaining({ state: "wa-outline-hover", ratio: 7.65 }),
        expect.objectContaining({ state: "wa-outline-focus", ratio: 5.07 }),
        expect.objectContaining({ state: "wa-outline-disabled", ratio: 7.81 }),
      ])
    );
  });

  it("não usa os verdes que falham com texto branco", () => {
    expect(contrastRatio("#ffffff", "#25D366")).toBeCloseTo(1.98, 2);
    expect(contrastRatio("#ffffff", "#20bd5a")).toBeCloseTo(2.47, 2);
    expect(contrastRatio("#ffffff", "#128C7E")).toBeCloseTo(4.14, 2);
    expect(contrastRatio("#0a0a0a", "#25D366")).toBeCloseTo(9.98, 2);
    expect(contrastRatio("#ffffff", "#1a7f3c")).toBeCloseTo(5.07, 2);

    const sourceFiles = walk(srcRoot).filter(
      (file) => /\.(tsx|css)$/.test(file) && !file.includes(`${path.sep}tests${path.sep}`)
    );
    for (const file of sourceFiles) {
      const src = fs.readFileSync(file, "utf8");
      expect(src, file).not.toMatch(/#25D366/i);
      expect(src, file).not.toMatch(/#20bd5a/i);
      expect(src, file).not.toMatch(/#128C7E/i);
    }
    expect(css).toContain(".btn-whatsapp");
    expect(css).toContain(".btn-whatsapp-outline");
    expect(css).toContain(".link-whatsapp");
  });
});
