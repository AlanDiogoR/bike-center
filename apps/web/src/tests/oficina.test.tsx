import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OficinaPage, { metadata } from "@/app/oficina/page";
import { PUBLIC_PATHS, STORE, publicSitemapUrls, siteUrl } from "@/lib/site";

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(srcRoot, rel), "utf8");
}

describe("página /oficina", () => {
  it("renderiza um h1, a foto da oficina e os dois telefones", () => {
    render(<OficinaPage />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toMatch(/Oficina em Fartura-SP/);
    expect(screen.getByText("A oficina faz manutenção de bikes e motos.")).toBeTruthy();

    const photo = screen.getByRole("img", {
      name: "Mecânico da Bike Center Fartura fazendo manutenção em uma moto Honda na oficina",
    });
    expect(decodeURIComponent(photo.getAttribute("src") ?? "")).toContain(
      "/images/oficina/manutencao-honda.jpg"
    );
    expect(photo.getAttribute("fetchpriority")).not.toBe("high");

    expect(screen.getByText(new RegExp(STORE.street))).toBeTruthy();
    expect(screen.getByText(new RegExp(`${STORE.city}/${STORE.state}`))).toBeTruthy();
    for (const line of STORE.hoursLines) {
      expect(screen.getByText(line)).toBeTruthy();
    }

    const map = screen.getByRole("link", { name: "Como chegar" });
    expect(map.getAttribute("href")).toBe(STORE.mapsDirUrl);
    expect(map.className).toContain("min-h-11");
    expect(map.className).toContain("surface-brand-orange");

    expect(screen.getByText("Chame no WhatsApp ou ligue.")).toBeTruthy();
    expect(screen.getByText("Diga o que precisa.")).toBeTruthy();
    expect(screen.getByText("Combine o horário e leve a bike ou a moto.")).toBeTruthy();

    const tels = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("tel:"));
    expect(tels.map((link) => link.getAttribute("href")).sort()).toEqual([
      "tel:+5514991667793",
      "tel:+5514996325919",
    ]);
    for (const link of tels) {
      expect(link.textContent).toContain("Ligar");
      expect(link.className).toContain("min-h-11");
      expect(link.className).toContain("text-base");
    }

    const whatsapps = screen.getAllByRole("link", { name: "WhatsApp" });
    expect(whatsapps).toHaveLength(2);
    for (const link of whatsapps) {
      expect(link.className).toContain("btn-whatsapp");
      expect(link.className).toContain("min-h-11");
      expect(link.className).toContain("text-base");
    }
  });

  it("limita título e description, usa canonical absoluto e não publica avaliação", () => {
    expect(metadata.title).toBe("Oficina de bikes e motos em Fartura-SP");
    expect(String(metadata.title)).toContain("Fartura-SP");
    expect(String(metadata.title).length).toBeLessThanOrEqual(60);
    expect(`${metadata.title} | Bike Center Fartura`.length).toBeLessThanOrEqual(60);

    expect(metadata.description).toContain("Fartura-SP");
    expect(metadata.description).toMatch(/manutenção de bikes e motos/i);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);

    expect(metadata.alternates?.canonical).toBe(siteUrl("oficina"));
    expect(String(metadata.alternates?.canonical)).toMatch(/^https?:\/\//);

    const src = read("app/oficina/page.tsx");
    expect(src).not.toContain("aggregateRating");
    expect(src).not.toMatch(/\bpriority\b/);
    expect(src).not.toContain("Rua Mário Stella");
    expect(src).not.toMatch(/8h[–-]18h/);
    expect(src).not.toMatch(/garantia|prazo|preço|preco/i);
    expect(src).toContain("STORE.street");
    expect(src).toContain("STORE.hoursLines");
    expect(src).toContain("STORE.mapsDirUrl");
    expect(src).not.toMatch(/\btext-(?:xs|sm)\b/);
  });

  it("entra no sitemap e nos links do header e do rodapé", () => {
    expect(PUBLIC_PATHS).toContain("oficina");
    const urls = publicSitemapUrls("https://bike-center-web.vercel.app/", []);
    expect(urls).toContain("https://bike-center-web.vercel.app/oficina");
    for (const url of urls) {
      expect(url.split("://")[1]).not.toContain("//");
    }

    expect(read("components/layout/Header.tsx")).toContain('href="/oficina"');
    expect(read("components/layout/footer/FooterNav.tsx")).toContain('href: "/oficina"');
    expect(read("app/sitemap.ts")).toContain("PUBLIC_PATHS");
  });
});
