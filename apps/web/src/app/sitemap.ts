import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function fetchProductSlugs(): Promise<string[]> {
  try {
    const slugs: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page < 500) {
      const res = await fetch(
        `${API_URL}/api/v1/products?page=${page}&limit=100`,
        { next: { revalidate: 3600 } }
      );
      const json = (await res.json()) as { data: { slug: string }[]; meta?: { total: number } };
      if (!res.ok || !json.data) break;

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
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/produtos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  const slugs = await fetchProductSlugs();
  const productEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/produtos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
