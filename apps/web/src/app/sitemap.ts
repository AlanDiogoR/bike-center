import type { MetadataRoute } from "next";
import { CATALOG_PRODUCT_SLUGS } from "@/lib/catalog";
import { PUBLIC_PATHS, apiUrl, getSiteUrl, publicSitemapUrls } from "@/lib/site";

async function fetchProductSlugs(): Promise<string[]> {
  try {
    const slugs: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page < 500) {
      const res = await fetch(apiUrl(`/api/v1/products?page=${page}&limit=100`), {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) break;

      const json = (await res.json()) as { data?: { slug: string }[]; meta?: { total: number } };
      if (!json.data) break;

      slugs.push(...json.data.map((p) => p.slug));
      const total = json.meta?.total ?? json.data.length;
      hasMore = slugs.length < total;
      page++;
    }

    return slugs;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fromApi = await fetchProductSlugs();
  const slugs = Array.from(new Set<string>([...CATALOG_PRODUCT_SLUGS, ...fromApi]));
  const urls = publicSitemapUrls(getSiteUrl(), slugs);
  const staticCount = PUBLIC_PATHS.length;

  return urls.map((url, index) => {
    const path = PUBLIC_PATHS[index];
    const isProduct = index >= staticCount;
    return {
      url,
      lastModified: now,
      changeFrequency: path === "" || path === "produtos" ? "daily" : isProduct ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "produtos" ? 0.9 : isProduct ? 0.8 : 0.4,
    };
  });
}
