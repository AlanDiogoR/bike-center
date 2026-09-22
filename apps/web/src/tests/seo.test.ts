import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, localBusinessJsonLd, productJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { STORE, WHATSAPP } from "@/lib/site";

describe("JSON-LD LocalBusiness", () => {
  it("mantém NAP, WhatsApp Claro/Vivo e endereço de Fartura", () => {
    const data = localBusinessJsonLd();
    expect(data["@type"]).toContain("LocalBusiness");
    expect(data.name).toBe(STORE.name);
    expect(data.address.streetAddress).toBe("Rua Mário Stella, 355");
    expect(data.address.addressLocality).toBe("Fartura");
    expect(data.address.postalCode).toBe("18870-000");
    expect(data.telephone).toEqual([`+${WHATSAPP.claro.e164}`, `+${WHATSAPP.vivo.e164}`]);
    expect(String(data.url).split("://")[1]).not.toContain("//");
    expect(String(data.image).split("://")[1]).not.toContain("//");
  });
});

describe("JSON-LD WebSite", () => {
  it("aponta a busca para /produtos sem barra dupla", () => {
    const data = websiteJsonLd();
    expect(data["@type"]).toBe("WebSite");
    expect(data.potentialAction.target).toMatch(/\/produtos\?search=/);
    expect(String(data.potentialAction.target).split("://")[1]).not.toContain("//");
  });
});

describe("JSON-LD Product e Breadcrumb", () => {
  const product = {
    name: "Honda Bros 160 azul",
    slug: "honda-bros-azul",
    description: "Descrição longa da moto na loja.",
    shortDescription: "Bros azul seminova. Confirme no WhatsApp.",
    images: [
      "/images/catalog/motos/honda-bros-azul/01-lateral.webp",
      "/images/catalog/motos/honda-bros-azul/02-capa-feed.webp",
    ],
    price: 16000,
    stock: 1,
  };

  it("publica oferta em BRL, fotos absolutas e vendedor local", () => {
    const data = productJsonLd(product);
    expect(data["@type"]).toBe("Product");
    expect(data.sku).toBe(product.slug);
    expect(data.description).toBe(product.shortDescription);
    expect(data.offers.price).toBe("16000.00");
    expect(data.offers.priceCurrency).toBe("BRL");
    expect(data.offers.availability).toBe("https://schema.org/InStock");
    expect(data.offers.seller["@type"]).toBe("LocalBusiness");
    expect(data.offers.seller.address.streetAddress).toBe(STORE.street);
    expect(data.url).toMatch(/\/produtos\/honda-bros-azul$/);
    expect(data.image[0]).toMatch(/01-lateral\.webp$/);
    expect(data.image.at(-1)).toMatch(/02-capa-feed\.webp$/);
    for (const image of data.image) {
      expect(image.startsWith("http")).toBe(true);
      expect(image.split("://")[1]).not.toContain("//");
    }
  });

  it("marca esgotado quando o estoque é zero", () => {
    const data = productJsonLd({ ...product, stock: 0, price: 9.9 });
    expect(data.offers.availability).toBe("https://schema.org/OutOfStock");
    expect(data.offers.price).toBe("9.90");
  });

  it("monta trilha Início / Produtos / produto", () => {
    const data = breadcrumbJsonLd(product.name, product.slug);
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((item) => item.name)).toEqual([
      "Início",
      "Produtos",
      product.name,
    ]);
    expect(data.itemListElement[1]?.item).toMatch(/\/produtos$/);
    expect(data.itemListElement[2]?.item).toMatch(/\/produtos\/honda-bros-azul$/);
    for (const item of data.itemListElement) {
      expect(String(item.item).split("://")[1]).not.toContain("//");
    }
  });
});
