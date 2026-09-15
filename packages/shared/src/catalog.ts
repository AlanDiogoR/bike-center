export const SEED_CATEGORIES = [
  {
    name: "Bicicletas",
    slug: "bicicletas",
    description: "Mountain bikes Absolute, Flex e outras MTB na loja em Fartura",
    sortOrder: 0,
  },
  {
    name: "Motos",
    slug: "motos",
    description: "Motos novas e seminovas — consulte disponibilidade na loja",
    sortOrder: 1,
  },
  {
    name: "Capacetes",
    slug: "capacetes",
    description: "Capacetes de moto e de bike",
    sortOrder: 2,
  },
  {
    name: "Peças e Componentes",
    slug: "pecas",
    description: "Pneus, câmaras, componentes e peças",
    sortOrder: 3,
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    description: "Luvas, vestuário e acessórios de moto e bike",
    sortOrder: 4,
  },
  {
    name: "Infantil",
    slug: "infantil",
    description: "Bicicletas infantis",
    sortOrder: 5,
  },
  {
    name: "Óleos e Manutenção",
    slug: "oleos-manutencao",
    description: "Lubrificantes e oficina",
    sortOrder: 6,
  },
] as const;

export interface SeedProduct {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  shortDescription: string;
  description: string;
  images: string[];
}

function catalogImages(kind: "produtos" | "motos", slug: string, files: readonly string[]): string[] {
  return files.map((file) => `/images/catalog/${kind}/${slug}/${file}`);
}

const VITRINE =
  "Preço de vitrine — confirme no WhatsApp. Retire na Rua Mário Stella, 355, Fartura/SP, ou envio pelo Mercado Livre.";

/** SKUs genéricos da 1ª leva — desativar no seed para não competir com PDP real. */
export const RETIRED_PRODUCT_SLUGS = [
  "moto-honda-cg-vermelha",
  "capacetes-moto",
  "luvas-e-acessorios",
] as const;

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Absolute Nero 3 Amarela Aro 29",
    slug: "absolute-nero-3-amarela",
    sku: "BC-NERO3-YEL",
    brand: "Absolute",
    categorySlug: "bicicletas",
    price: 1199,
    stock: 4,
    shortDescription: "MTB Absolute Nero 3 amarela aro 29 — na loja em Fartura. Confirme preço no WhatsApp.",
    description:
      "Mountain bike Absolute Nero 3 na cor amarela, aro 29, em estoque no showroom da Bike Center Fartura. Ideal para trilhas e uso urbano. " +
      VITRINE,
    images: ["/images/produtos/absolute-nero-3-amarela.jpg"],
  },
  {
    name: "Absolute Nero 4 Laranja Aro 29",
    slug: "absolute-nero-4-laranja",
    sku: "BC-NERO4-ORG",
    brand: "Absolute",
    categorySlug: "bicicletas",
    price: 1499,
    stock: 5,
    shortDescription: "Absolute Nero 4 laranja aro 29 — linha Absolute no showroom de Fartura.",
    description:
      "Mountain bike Absolute Nero 4 laranja, aro 29, fotografada na loja. Freios a disco, grupo de marchas para trilha. Consulte tamanho no WhatsApp. " +
      VITRINE,
    images: [
      "/images/produtos/absolute-nero-4-laranja.jpg",
      "/images/produtos/absolute-nero-4-laranja-2.jpg",
      "/images/produtos/absolute-nero-4-laranja-3.jpg",
      "/images/produtos/absolute-nero-4-laranja-4.jpg",
    ],
  },
  {
    name: "Absolute Nero Azul Aro 29",
    slug: "absolute-nero-azul",
    sku: "BC-NERO-BLU",
    brand: "Absolute",
    categorySlug: "bicicletas",
    price: 1399,
    stock: 3,
    shortDescription: "Absolute Nero azul no estoque da Bike Center Fartura.",
    description:
      "Mountain bike Absolute Nero azul, aro 29. Foto real da loja. Peça orçamento no WhatsApp para tamanhos e formas de pagamento. " +
      VITRINE,
    images: ["/images/produtos/absolute-nero-azul.jpg", "/images/produtos/absolute-nero-azul-2.jpg"],
  },
  {
    name: "Flex 2.0 Amarela MTB",
    slug: "flex-2-0-amarela",
    sku: "BC-FLEX20-YEL",
    brand: "Flex",
    categorySlug: "bicicletas",
    price: 1090,
    stock: 2,
    shortDescription: "MTB Flex 2.0 amarela — lançamento na vitrine de Fartura.",
    description: "Mountain bike Flex 2.0 amarela em estoque na Bike Center. " + VITRINE,
    images: ["/images/produtos/flex-2-0-amarela.jpg", "/images/produtos/flex-2-0-amarela-2.jpg"],
  },
  {
    name: "Honda Biz 110i preta 2016",
    slug: "honda-biz-125-preta",
    sku: "BC-HONDA-BIZ-110I-2016",
    brand: "Honda",
    categorySlug: "motos",
    price: 11800,
    stock: 1,
    shortDescription: "Biz 110i preta 2016, 79.560 km. Vitrine R$ 11.800 — confirme no WhatsApp.",
    description:
      "Honda Biz 110i preta, ano 2016, cerca de 79.560 km — unidade da loja em Fartura. Slug honda-biz-125-preta (pasta capas/biz preta). Documentação, revisão e valores no WhatsApp. Unidade única. " +
      VITRINE,
    images: catalogImages("motos", "honda-biz-125-preta", ["01-lateral.webp", "02-capa-feed.webp"]),
  },
  {
    name: "Honda Biz 125 KS prata 2008",
    slug: "honda-biz-125-prata",
    sku: "BC-HONDA-BIZ-125KS-2008",
    brand: "Honda",
    categorySlug: "motos",
    price: 8500,
    stock: 1,
    shortDescription: "Biz 125 KS prata 2008. Vitrine R$ 8.500 — confirme no WhatsApp.",
    description:
      "Honda Biz 125 KS prata, ano 2008 — unidade fotografada na Bike Center Fartura. Consulte documentação e estado no WhatsApp. Unidade única. " +
      VITRINE,
    images: catalogImages("motos", "honda-biz-125-prata", ["01-lateral.webp", "02-capa-feed.webp"]),
  },
  {
    name: "Honda Bros 160 azul 2020",
    slug: "honda-bros-azul",
    sku: "BC-HONDA-BROS-160-2020",
    brand: "Honda",
    categorySlug: "motos",
    price: 16000,
    stock: 1,
    shortDescription: "Bros 160 azul 2020. Vitrine R$ 16.000 — confirme no WhatsApp.",
    description:
      "Honda NXR Bros 160 azul, ano 2020, no pátio da loja. Não confundir com outras Bros do estoque — slug honda-bros-azul. Peça avaliação no WhatsApp. Unidade única. " +
      VITRINE,
    images: catalogImages("motos", "honda-bros-azul", ["01-lateral.webp", "02-capa-feed.webp"]),
  },
  {
    name: "Honda PCX 150 DLX 2019",
    slug: "honda-pcx",
    sku: "BC-HONDA-PCX-150-2019",
    brand: "Honda",
    categorySlug: "motos",
    price: 16000,
    stock: 1,
    shortDescription: "PCX 150 DLX 2019, 23.505 km. Vitrine R$ 16.000 — confirme no WhatsApp.",
    description:
      "Honda PCX 150 DLX, ano 2019, cerca de 23.505 km. Slug honda-pcx (não é a PCX azul 2020 da 2ª leva). Consulte no WhatsApp. Unidade única. " +
      VITRINE,
    images: catalogImages("motos", "honda-pcx", ["01-lateral.webp", "02-capa-feed.webp"]),
  },
  {
    name: "Honda CG Fan vermelha 2010",
    slug: "honda-cg-fan-vermelha-2010",
    sku: "BC-HONDA-CG-FAN-2010",
    brand: "Honda",
    categorySlug: "motos",
    price: 6900,
    stock: 1,
    shortDescription: "CG Fan 125 vermelha 2010. Preço: consulte no WhatsApp.",
    description:
      "Honda CG 125 Fan vermelha, ano 2010 — unidade da loja (não é um anúncio genérico de CG). Preço placeholder de vitrine; confirme km, documentos e valor no WhatsApp. Unidade única. " +
      VITRINE,
    images: catalogImages("motos", "honda-cg-fan-vermelha-2010", [
      "04-recorte.webp",
      "01-lateral-feed.webp",
      "02-original-lateral.webp",
      "03-original-frente.webp",
    ]),
  },
  {
    name: "BMW R 1200 GS 2013/2014",
    slug: "suzuki-gs",
    sku: "BC-BMW-R1200GS-2014",
    brand: "BMW",
    categorySlug: "motos",
    price: 59000,
    stock: 1,
    shortDescription: "BMW R 1200 GS 2013/2014, 54.000 km. Vitrine R$ 59.000 — confirme no WhatsApp.",
    description:
      "BMW R 1200 GS (2013/2014), cerca de 54.000 km — unidade na loja. O slug suzuki-gs segue a pasta capas/gs do pack (não misturar com outras GS). Confirme marca, modelo e valor no WhatsApp. Unidade única. " +
      VITRINE,
    images: catalogImages("motos", "suzuki-gs", ["01-lateral.webp", "02-capa-feed.webp"]),
  },
  {
    name: "Capacete X11 Revo preto fosco",
    slug: "capacete-x11-revo-preto-fosco",
    sku: "BC-X11-REVO-FOSCO",
    brand: "X11",
    categorySlug: "capacetes",
    price: 890,
    stock: 2,
    shortDescription: "X11 Revo preto fosco. Vitrine — confirme numeração e preço no WhatsApp.",
    description:
      "Capacete X11 Revo preto fosco em estoque na Bike Center. Hero com recorte da loja; fotos laterais e interior na galeria. Confirme tamanho no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "capacete-x11-revo-preto-fosco", [
      "01-hero-recorte.webp",
      "02-loja-lateral.webp",
      "03-interior.webp",
    ]),
  },
  {
    name: "Capacete X11 Revo azul",
    slug: "capacete-x11-revo-azul",
    sku: "BC-X11-REVO-AZUL",
    brand: "X11",
    categorySlug: "capacetes",
    price: 891,
    stock: 1,
    shortDescription: "X11 Revo azul. Tag da loja R$ 891 em 3x — confirme no WhatsApp.",
    description:
      "Capacete X11 Revo azul fotografado na loja. Tag de vitrine R$ 891,00 em 3x no cartão (sem juros no dia da foto). Confirme numeração e valor atual no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "capacete-x11-revo-azul", ["01-frente.webp", "02-angulo.webp"]),
  },
  {
    name: "Capacete FW3 branco/azul/vermelho",
    slug: "capacete-fw3-branco-azul-vermelho",
    sku: "BC-FW3-TRICO",
    brand: "FW3",
    categorySlug: "capacetes",
    price: 449,
    stock: 1,
    shortDescription: "FW3 tricolor na vitrine. Preço: consulte no WhatsApp.",
    description:
      "Capacete FW3 branco, azul e vermelho na prateleira da loja. Preço placeholder de vitrine — confirme modelo, tamanho e valor no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "capacete-fw3-branco-azul-vermelho", ["01-frente.webp"]),
  },
  {
    name: "Capacete Pro Tork Liberty Three Elite verde",
    slug: "capacete-pro-tork-liberty-three-elite-verde",
    sku: "BC-PROTORK-LIBERTY-GREEN",
    brand: "Pro Tork",
    categorySlug: "capacetes",
    price: 289,
    stock: 2,
    shortDescription: "Liberty Three Elite verde. Preço: consulte tamanho e valor no WhatsApp.",
    description:
      "Capacete Pro Tork Liberty Three Elite verde (aberto). Foto da loja. Confirme numeração no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "capacete-pro-tork-liberty-three-elite-verde", ["01-frente.webp"]),
  },
  {
    name: "Óleo Motul 3000 4T 20W-50 1L",
    slug: "oleo-motul-3000-20w50",
    sku: "BC-MOTUL-3000-20W50",
    brand: "Motul",
    categorySlug: "oleos-manutencao",
    price: 79,
    stock: 8,
    shortDescription: "Motul 3000+ 20W-50 1L. Vitrine — confirme o preço no WhatsApp.",
    description:
      "Óleo Motul 3000+ 4T 20W-50 mineral, 1 litro, no estoque da oficina. Galeria com frente, verso e lateral. " +
      VITRINE,
    images: catalogImages("produtos", "oleo-motul-3000-20w50", ["01-frente.webp", "02-verso.webp", "03-lateral.webp"]),
  },
  {
    name: "Óleo Castrol Power1 Racing 10W-50 1L",
    slug: "oleo-castrol-power1-racing-10w50",
    sku: "BC-CASTROL-P1R-10W50",
    brand: "Castrol",
    categorySlug: "oleos-manutencao",
    price: 109,
    stock: 6,
    shortDescription: "Castrol Power1 Racing 10W-50 1L. Vitrine — confirme no WhatsApp.",
    description:
      "Óleo Castrol Power1 Racing 10W-50 4T, 1 litro. Frente e verso na galeria. Confirme aplicação no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "oleo-castrol-power1-racing-10w50", ["01-frente.webp", "02-verso.webp"]),
  },
  {
    name: "Kit relação Fabreck Premium 1045",
    slug: "kit-relacao-fabreck-premium-1045",
    sku: "BC-FABRECK-1045",
    brand: "Fabreck",
    categorySlug: "pecas",
    price: 189,
    stock: 4,
    shortDescription: "Kit Fabreck Premium 1045 (coroa, pinhão e corrente). Consulte aplicação no WhatsApp.",
    description:
      "Kit de transmissão Fabreck Premium 1045 — coroa, pinhão e corrente. Fotos da caixa e do kit aberto. Confirme modelo da moto no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "kit-relacao-fabreck-premium-1045", ["01-caixa.webp", "02-aberto.webp"]),
  },
  {
    name: "Kit relação TEC 428 Bros 160",
    slug: "kit-relacao-tec-428-bros-160",
    sku: "BC-TEC-428-BROS160",
    brand: "TEC",
    categorySlug: "pecas",
    price: 169,
    stock: 5,
    shortDescription: "Kit TEC 428 para Bros 160. Consulte aplicação e preço no WhatsApp.",
    description:
      "Kit de transmissão TEC 428 para Honda NXR 160 Bros (aço 1045). Caixa e conteúdo aberto na galeria. " +
      VITRINE,
    images: catalogImages("produtos", "kit-relacao-tec-428-bros-160", ["01-caixa.webp", "02-aberto.webp"]),
  },
  {
    name: "Militec-1 condicionador de metais",
    slug: "militec-1-condicionador-metais",
    sku: "BC-MILITEC-1",
    brand: "Militec",
    categorySlug: "oleos-manutencao",
    price: 89,
    stock: 10,
    shortDescription: "Militec-1 condicionador sintético de metais. Consulte o preço no WhatsApp.",
    description:
      "Militec-1 condicionador sintético de metais — foto recorte da loja. Confirme volume e valor no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "militec-1-condicionador-metais", ["01-hero-recorte.webp"]),
  },
  {
    name: "Pastilha de freio GTS DBP-50S",
    slug: "pastilha-freio-gts-dbp-50s",
    sku: "BC-GTS-DBP-50S",
    brand: "GTS",
    categorySlug: "pecas",
    price: 15,
    stock: 12,
    shortDescription: "Pastilha GTS DBP-50S. Tag da loja R$ 15 — confirme aplicação no WhatsApp.",
    description:
      "Pastilha de freio a disco GTS DBP-50S (square type). Tag de vitrine R$ 15,00 no dia da foto. Confirme se serve na sua bike no WhatsApp. " +
      VITRINE,
    images: catalogImages("produtos", "pastilha-freio-gts-dbp-50s", ["01-frente.webp"]),
  },
  {
    name: "Fone Bluetooth Lehmox LEF-K09 para capacete",
    slug: "fone-bluetooth-lehmox-lef-k09",
    sku: "BC-LEHMOX-LEF-K09",
    brand: "Lehmox",
    categorySlug: "acessorios",
    price: 129,
    stock: 3,
    shortDescription: "Lehmox LEF-K09 Bluetooth 5.4 para capacete. Consulte o preço no WhatsApp.",
    description:
      "Fone / intercomunicador Lehmox LEF-K09 Bluetooth 5.4 para capacete de moto. Caixa lacrada na loja. " +
      VITRINE,
    images: catalogImages("produtos", "fone-bluetooth-lehmox-lef-k09", ["01-frente.webp", "02-angulo.webp"]),
  },
  {
    name: "Luva X11 Blackout",
    slug: "luva-x11-blackout",
    sku: "BC-X11-BLACKOUT",
    brand: "X11",
    categorySlug: "acessorios",
    price: 149,
    stock: 4,
    shortDescription: "Luva X11 Blackout. Vitrine — confirme tamanho e preço no WhatsApp.",
    description:
      "Luva X11 Blackout (recorte da loja). Confirme numeração no WhatsApp. " + VITRINE,
    images: catalogImages("produtos", "luva-x11-blackout", ["01-hero-recorte.webp"]),
  },
  {
    name: "Capacetes de bike infantil e adulto",
    slug: "capacetes-bike",
    sku: "BC-HELM-BIKE",
    brand: "Misto",
    categorySlug: "capacetes",
    price: 89,
    stock: 18,
    shortDescription: "Grade de capacetes de bike coloridos — infantil e adulto.",
    description:
      "Capacetes de ciclismo na parede da loja (várias cores, inclusive infantil). Preço a partir de. Confirme tamanho no WhatsApp. " +
      VITRINE,
    images: ["/images/produtos/capacetes-bike.jpg"],
  },
  {
    name: "Bicicletas infantis (arose e aro 12+)",
    slug: "bicicletas-infantis",
    sku: "BC-KIDS-BIKE",
    brand: "Misto",
    categorySlug: "infantil",
    price: 349,
    stock: 8,
    shortDescription: "Bikes infantis a partir de R$ 349 — várias cores na loja.",
    description:
      "Cantinho kids da Bike Center: bicicletas infantis. Tag de vitrine a partir de R$ 349 — confirme o modelo no WhatsApp. " +
      VITRINE,
    images: ["/images/produtos/bikes-infantis.jpg"],
  },
  {
    name: "Pneus MTB Pirelli Scorpion e Chaoyang",
    slug: "pneus-mtb-pirelli-chaoyang",
    sku: "BC-TIRE-MTB",
    brand: "Pirelli / Chaoyang",
    categorySlug: "pecas",
    price: 119,
    stock: 15,
    shortDescription: "Pneus MTB Pirelli Scorpion e Chaoyang — medidas sob consulta.",
    description:
      "Pneus de mountain bike Pirelli Scorpion e Chaoyang no expositor da loja. Diga a medida no WhatsApp. " +
      VITRINE,
    images: ["/images/produtos/pneus-mtb.jpg"],
  },
];

export const CATALOG_PRODUCT_SLUGS = SEED_PRODUCTS.map((p) => p.slug);

export function seedProductBySlug(slug: string): SeedProduct | undefined {
  return SEED_PRODUCTS.find((p) => p.slug === slug);
}
