import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
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
    return {
      title: product.name,
      description,
      openGraph: {
        images: product.images?.[0] ? [product.images[0]] : [],
      },
      twitter: {
        card: "summary_large_image",
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/produtos/${slug}`,
      },
    };
  } catch {
    return { title: "Produto" };
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
