"use client";

import { useState } from "react";
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
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { galleryImages, isCutoutImage } from "@/lib/product-images";
import { useCartStore } from "@/store/cart.store";
import { COPY, STORE, WHATSAPP, formatBRL, whatsappUrl } from "@/lib/site";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const images = galleryImages(product.images);
  const [activeIndex, setActiveIndex] = useState(0);
  const imageUrl = images[activeIndex] ?? images[0];
  const interestText = `Olá! Tenho interesse em ${product.name} (${product.slug}).`;
  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasComparePrice
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const jsonLd = productJsonLd(product);
  const breadcrumbLd = breadcrumbJsonLd(product.name, product.slug);

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

      <div className="bg-gray-50 border-b border-gray-100 overflow-hidden">
        <nav className="max-w-container mx-auto px-4 sm:px-6 py-1 text-sm flex items-center gap-1 min-w-0">
          <Link href="/" className="text-gray-500 hover:text-brand-primary flex-shrink-0 inline-flex min-h-11 items-center">
            Início
          </Link>
          <span className="mx-1 text-gray-400 flex-shrink-0">/</span>
          <Link href="/produtos" className="text-gray-500 hover:text-brand-primary flex-shrink-0 inline-flex min-h-11 items-center">
            Produtos
          </Link>
          <span className="mx-1 text-gray-400 flex-shrink-0">/</span>
          <span className="text-brand-text font-medium truncate min-w-0">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="max-w-container mx-auto min-w-0 px-4 sm:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14">
          <div className="min-w-0">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className={`object-contain object-center ${
                    isCutoutImage(imageUrl) ? "p-3 sm:p-6" : "p-1"
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-50">
                  🚴
                </div>
              )}
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
            {images.length > 1 && (
              <div className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 snap-x">
                {images.slice(0, 12).map((img, i) => (
                  <button
                    type="button"
                    key={`${img}-${i}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Foto ${i + 1} de ${product.name}`}
                    aria-pressed={i === activeIndex}
                    className={`relative h-16 w-16 sm:h-20 sm:w-20 min-h-11 min-w-11 flex-shrink-0 snap-start touch-manipulation rounded-lg overflow-hidden border-2 bg-white ${
                      i === activeIndex ? "border-brand-primary" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="80px"
                      className={`pointer-events-none object-contain object-center ${
                        isCutoutImage(img) ? "p-0.5" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            {product.category && (
              <Link
                href={`/produtos?category=${product.category.slug}`}
                className="text-brand-primary text-sm font-medium hover:underline mb-2 inline-flex min-h-11 items-center"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-4xl text-brand-text uppercase tracking-tight mb-4 break-words">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text">
                {formatBRL(product.price)}
              </span>
              {hasComparePrice && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    {formatBRL(product.compareAtPrice!)}
                  </span>
                  <span className="px-2.5 py-1 bg-brand-onSale/15 text-brand-onSale text-sm font-bold rounded">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Preço de referência da vitrine — confirme no WhatsApp. {COPY.announcementPreferred}.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl("claro", interestText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex flex-col items-center justify-center min-h-12 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-center text-base sm:text-lg shadow-lg leading-tight"
              >
                <span>{COPY.ctaWhatsApp}</span>
                <span className="mt-0.5 text-sm font-semibold text-white/90">
                  Claro {WHATSAPP.claro.display}
                </span>
              </a>
              <a
                href={whatsappUrl("vivo", interestText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center min-h-11 px-4 py-2.5 border-2 border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 font-semibold rounded-xl text-center text-sm sm:text-base"
              >
                WhatsApp Vivo {WHATSAPP.vivo.display}
              </a>
              <button
                type="button"
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: images[0] ?? "",
                    quantity: 1,
                  });
                  toast.success("Adicionado ao carrinho");
                }}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-3 min-h-12 py-3 border-2 border-brand-text/15 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-brand-text font-bold rounded-xl transition-colors text-base"
              >
                <ShoppingCart size={20} />
                Adicionar ao carrinho
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mt-6 py-6 border-y border-gray-100">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={18} className="text-brand-primary flex-shrink-0" />
                {COPY.announcementPreferred}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={18} className="text-brand-primary flex-shrink-0" />
                Loja física em Fartura
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw size={18} className="text-brand-primary flex-shrink-0" />
                Troca em 14 dias via WhatsApp
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={18} className="text-brand-primary flex-shrink-0" />
                {STORE.tagline}
              </span>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-brand-text mb-3">O que está incluído</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-brand-primary flex-shrink-0" />
                  Produto da loja física — conferência no balcão
                </li>
                <li className="flex items-center gap-2">
                  <Package size={18} className="text-brand-primary flex-shrink-0" />
                  Retirada em Fartura ou envio pelo Mercado Livre
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={18} className="text-brand-primary flex-shrink-0" />
                  Orientação da oficina quando fizer sentido
                </li>
              </ul>
            </div>

            <p className="mt-6 text-brand-text leading-relaxed">
              {product.shortDescription ?? product.description}
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-16 max-w-4xl">
          <Accordion.Root type="single" collapsible className="space-y-3">
            <Accordion.Item
              value="description"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between min-h-11 px-4 sm:px-6 py-4 text-left font-semibold hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50">
                  Descrição completa
                  <ChevronDown size={20} className="text-brand-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 sm:px-6 pb-6">
                <div className="prose prose-gray max-w-none text-brand-text">{product.description}</div>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item
              value="specs"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between min-h-11 px-4 sm:px-6 py-4 text-left font-semibold hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50">
                  Especificações
                  <ChevronDown size={20} className="text-brand-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 sm:px-6 pb-6">
                <dl className="space-y-3 text-sm">
                  {product.brand && (
                    <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                      <dt className="text-gray-600">Marca</dt>
                      <dd className="font-medium text-right">{product.brand}</dd>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                      <dt className="text-gray-600">Categoria</dt>
                      <dd className="font-medium text-right">{product.category.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <dt className="text-gray-600">Disponibilidade</dt>
                    <dd className="font-medium">{product.stock > 0 ? "Em estoque na loja" : "Sob consulta"}</dd>
                  </div>
                </dl>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item
              value="shipping"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between min-h-11 px-4 sm:px-6 py-4 text-left font-semibold hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50">
                  Envio e retirada
                  <ChevronDown size={20} className="text-brand-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 sm:px-6 pb-6 text-brand-text">
                <p>
                  {COPY.announcementPreferred}. {COPY.announcementAlt}. {COPY.returns}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
    </>
  );
}
