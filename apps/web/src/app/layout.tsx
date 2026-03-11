import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { EmailSignup } from "@/components/layout/EmailSignup";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/logo.svg",
  },
  title: {
    default: "Bike Center - Bicicletas e Peças Para o Ciclista",
    template: "%s | Bike Center",
  },
  description:
    "Bike Center - Loja especializada em bicicletas, peças, acessórios e produtos de manutenção ciclística. Mais de 30 anos no mercado. Frete grátis acima de R$ 199.",
  keywords: ["bicicletas", "peças", "acessórios", "ciclismo", "loja", "Bike Center", "Fartura"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Bike Center",
  },
  twitter: {
    card: "summary_large_image",
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
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col font-sans">
        <a
          href="#main"
          className="absolute -left-[9999px] focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-[60px] focus:outline-none"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1" role="main">
            {children}
          </main>
          <EmailSignup />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
