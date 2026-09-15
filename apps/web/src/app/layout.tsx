import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { EmailSignup } from "@/components/layout/EmailSignup";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { COPY, STORE, getSiteUrl } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/jsonld";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const site = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  icons: {
    icon: "/logo.svg",
  },
  title: {
    default: COPY.metaTitle,
    template: "%s | Bike Center Fartura",
  },
  description: COPY.metaDescription,
  keywords: [
    "Bike Center Fartura",
    "bicicletas Fartura",
    "motos Fartura",
    "oficina de bikes",
    "Absolute",
    "Mercado Livre",
    "Rua Mário Stella",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: STORE.name,
    title: COPY.metaTitle,
    description: COPY.metaDescription,
    url: site,
    images: [
      {
        url: STORE.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Showroom Absolute — Bike Center Fartura",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: COPY.metaTitle,
    description: COPY.metaDescription,
    images: [STORE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="overflow-x-hidden">
      <body className="min-h-screen flex flex-col font-sans overflow-x-hidden max-w-[100vw]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <a
          href="#main"
          className="absolute -left-[9999px] focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-[60px] focus:outline-none"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1 min-w-0" role="main">
            {children}
          </main>
          <EmailSignup />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
