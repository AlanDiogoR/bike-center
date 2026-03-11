import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { BannersSection } from "@/components/home/BannersSection";
import { FAQSection } from "@/components/home/FAQSection";
import { InstagramSection } from "@/components/home/InstagramSection";

const ProductGrid = dynamic(() => import("@/components/home/ProductGrid").then((m) => ({ default: m.ProductGrid })), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />,
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bike Center",
  url: BASE_URL,
  description: "Loja especializada em bicicletas, peças, acessórios e produtos de manutenção ciclística.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/produtos?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bike Center",
  url: BASE_URL,
  description: "Bike Center - Loja especializada em bicicletas, peças, acessórios e produtos de manutenção ciclística.",
  sameAs: ["https://www.instagram.com/bikecenterfartura/"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, organizationSchema]),
        }}
      />
      <HeroSection />
      <TrustBar />
      <section className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <BannersSection />
      </section>
      <section className="max-w-container mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-brand-text uppercase tracking-[0.015em] mb-8">
          Destaques
        </h2>
        <ProductGrid />
      </section>
      <FAQSection />
      <InstagramSection />
    </>
  );
}
