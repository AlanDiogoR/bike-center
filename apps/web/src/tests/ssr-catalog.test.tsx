import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/store/cart.store", () => ({
  useCartStore: (sel: (s: { addItem: () => void }) => unknown) => sel({ addItem: () => {} }),
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

import { ProductListPage } from "@/app/produtos/ProductListPage";
import { ProductGrid } from "@/components/home/ProductGrid";

function pdpLinks(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>("a[href^='/produtos/']")).map(
    (a) => a.getAttribute("href")!
  );
}

describe("SSR do catálogo (PR-2)", () => {
  it("/produtos: 1 H1 e ≥12 links /produtos/<slug> sem depender de JS", async () => {
    const ui = await ProductListPage({ searchParams: {} });
    const { container } = render(ui);
    const h1 = container.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("Catálogo de motos, bikes e peças em Fartura-SP");
    const links = new Set(pdpLinks(container));
    expect(links.size).toBeGreaterThanOrEqual(12);
  });

  it("home: Destaques traz links de PDP no HTML do servidor", async () => {
    const ui = await ProductGrid();
    const { container } = render(ui);
    expect(pdpLinks(container).length).toBeGreaterThanOrEqual(12);
  });

  it("não usa hooks de cliente nem react-query nesses componentes", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    for (const f of ["app/produtos/ProductListPage.tsx", "components/home/ProductGrid.tsx"]) {
      const src = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
      expect(src, f).not.toMatch(/"use client"/);
      expect(src, f).not.toMatch(/useQuery/);
    }
  });
});
