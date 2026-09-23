import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl(),
  },
};
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { TrustBar } from "@/components/home/TrustBar";
import { BannersSection } from "@/components/home/BannersSection";
import { StoreVisitSection } from "@/components/home/StoreVisitSection";
import { FAQSection } from "@/components/home/FAQSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { websiteJsonLd } from "@/lib/jsonld";

const ProductGrid = dynamic(() => import("@/components/home/ProductGrid").then((m) => ({ default: m.ProductGrid })), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />,
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd()),
        }}
      />
      <HeroSection />
      <SocialProofSection />
      <TrustBar />
      <section className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <BannersSection />
      </section>
      <section className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-text uppercase tracking-[0.015em] mb-6 sm:mb-8">
          Destaques
        </h2>
        <ProductGrid />
      </section>
      <StoreVisitSection />
      <FAQSection />
      <InstagramSection />
    </>
  );
}
