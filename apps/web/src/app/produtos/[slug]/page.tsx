import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { STORE, siteUrl } from "@/lib/site";
import { ProductDetail } from "./ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProduct(slug, { next: { revalidate: 60 } });
    const description =
      product.shortDescription ??
      (product.description.length > 155
        ? product.description.slice(0, 152) + "..."
        : product.description);
    const image = product.images?.[0] || STORE.defaultOgImage;
    return {
      title: product.name,
      description,
      openGraph: {
        images: [{ url: image, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        images: [image],
      },
      alternates: {
        canonical: siteUrl(`produtos/${slug}`),
      },
    };
  } catch {
    return {
      title: "Produto",
      openGraph: { images: [STORE.defaultOgImage] },
    };
  }
}

export default async function ProductPage({ params }: Props) {
  try {
    const { slug } = await params;
    const product = await getProduct(slug, { next: { revalidate: 60 } });
    return <ProductDetail product={product} />;
  } catch {
    notFound();
  }
}
