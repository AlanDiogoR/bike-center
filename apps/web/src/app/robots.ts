import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/cadastro", "/conta/", "/admin/", "/carrinho", "/checkout"],
    },
    sitemap: siteUrl("sitemap.xml"),
  };
}
