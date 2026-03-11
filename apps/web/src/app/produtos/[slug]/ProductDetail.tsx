"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Clock,
  ChevronDown,
  Check,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import * as Accordion from "@radix-ui/react-accordion";
import type { Product } from "@/lib/api";
import { useCartStore } from "@/store/cart.store";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const images = product.images ?? [];
  const imageUrl = images[0];
  const productUrl = `${BASE_URL}/produtos/${product.slug}`;
  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasComparePrice
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: (product.images ?? []).map((img) =>
      img.startsWith("http") ? img : `${BASE_URL}${img}`
    ),
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.price,
      priceCurrency: "BRL",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Produtos", item: `${BASE_URL}/produtos` },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <nav className="max-w-container mx-auto px-4 sm:px-6 py-3 text-sm">
          <Link href="/" className="text-gray-500 hover:text-brand-primary">
            Início
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/produtos" className="text-gray-500 hover:text-brand-primary">
            Produtos
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-brand-text font-medium truncate max-w-[200px] sm:max-w-none inline-block">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main product - layout Pagani: full width, grid 50/50 */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Galeria */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-50">
                  🚴
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasComparePrice && (
                  <span className="px-3 py-1.5 bg-brand-onSale text-white text-sm font-bold rounded-lg shadow">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.stock <= 0 && (
                  <span className="px-3 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-lg">
                    Esgotado
                  </span>
                )}
              </div>
            </div>
            {/* Thumbnails */}
            {images.filter((i) => i && (i.startsWith("http") || i.startsWith("/"))).length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images
                  .filter((img) => img && (img.startsWith("http") || img.startsWith("/")))
                  .slice(0, 5)
                  .map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-brand-primary transition-colors"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Info - sticky no desktop */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            {product.category && (
              <Link
                href={`/produtos?category=${product.category.slug}`}
                className="text-brand-primary text-sm font-medium hover:underline mb-2 inline-block"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-heading font-bold text-2xl md:text-4xl text-brand-text uppercase tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Preço - estilo Pagani */}
            <div className="flex flex-wrap items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-brand-text">
                R$ {product.price.toFixed(2)}
              </span>
              {hasComparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    R$ {product.compareAtPrice!.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 bg-brand-onSale/15 text-brand-onSale text-sm font-bold rounded">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Impostos e taxas incluídos. Frete grátis acima de R$ 199.
            </p>

            {/* CTA principal */}
            <button
              type="button"
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.images?.[0] ?? "",
                  quantity: 1,
                });
                toast.success("Adicionado ao carrinho");
              }}
              disabled={product.stock <= 0}
              className="w-full flex items-center justify-center gap-3 py-4 bg-brand-cta hover:bg-brand-ctaHover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg text-lg"
            >
              <ShoppingCart size={24} />
              Adicionar ao carrinho
            </button>

            {/* Trust badges - horizontal */}
            <div className="flex flex-wrap gap-6 mt-6 py-6 border-y border-gray-100">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={18} className="text-brand-primary flex-shrink-0" />
                Frete grátis acima de R$ 199
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={18} className="text-brand-primary flex-shrink-0" />
                Pagamento seguro
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw size={18} className="text-brand-primary flex-shrink-0" />
                Devolução em 14 dias
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={18} className="text-brand-primary flex-shrink-0" />
                30 anos de experiência
              </span>
            </div>

            {/* O que está incluído - estilo Pagani */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-brand-text mb-3">O que está incluído</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-brand-primary flex-shrink-0" />
                  Produto autêntico, inspecionado
                </li>
                <li className="flex items-center gap-2">
                  <Package size={18} className="text-brand-primary flex-shrink-0" />
                  Embalagem padrão
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={18} className="text-brand-primary flex-shrink-0" />
                  Garantia e manual
                </li>
              </ul>
            </div>

            {/* Descrição curta */}
            <p className="mt-6 text-brand-text leading-relaxed">
              {product.shortDescription ?? product.description}
            </p>
          </div>
        </div>

        {/* Accordion - especificações, descrição, envio */}
        <div className="mt-16 max-w-4xl">
          <Accordion.Root type="single" collapsible className="space-y-3">
            <Accordion.Item
              value="description"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 text-left font-semibold hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50">
                  Descrição completa
                  <ChevronDown size={20} className="text-brand-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-6">
                <div className="prose prose-gray max-w-none text-brand-text">{product.description}</div>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item
              value="specs"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 text-left font-semibold hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50">
                  Especificações
                  <ChevronDown size={20} className="text-brand-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-6">
                <dl className="space-y-3 text-sm">
                  {product.category && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Categoria</dt>
                      <dd className="font-medium">{product.category.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">Disponibilidade</dt>
                    <dd className="font-medium">{product.stock > 0 ? "Em estoque" : "Esgotado"}</dd>
                  </div>
                </dl>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item
              value="shipping"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 text-left font-semibold hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50">
                  Envio e entregas
                  <ChevronDown size={20} className="text-brand-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-6 text-brand-text">
                <p>
                  Frete grátis em compras acima de R$ 199. Processamos pedidos em 24-48h. Entrega em
                  7-10 dias úteis para todo o Brasil. Impostos e taxas incluídos no preço.
                </p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
    </>
  );
}
