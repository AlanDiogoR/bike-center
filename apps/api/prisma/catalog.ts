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

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Absolute Nero 3 Amarela Aro 29",
    slug: "absolute-nero-3-amarela",
    sku: "BC-NERO3-YEL",
    brand: "Absolute",
    categorySlug: "bicicletas",
    price: 1199,
    compareAtPrice: 1399,
    stock: 4,
    shortDescription: "MTB Absolute Nero 3 amarela aro 29 — disponível na loja em Fartura. Preço sujeito a confirmação.",
    description:
      "Mountain bike Absolute Nero 3 na cor amarela, aro 29, em estoque no showroom da Bike Center Fartura. Ideal para trilhas e uso urbano. Preço de vitrine — confirme no WhatsApp ou retire na Rua Mário Stella, 355. Envio pelo Mercado Livre.",
    images: ["/images/produtos/absolute-nero-3-amarela.jpg"],
  },
  {
    name: "Absolute Nero 4 Laranja Aro 29",
    slug: "absolute-nero-4-laranja",
    sku: "BC-NERO4-ORG",
    brand: "Absolute",
    categorySlug: "bicicletas",
    price: 1499,
    compareAtPrice: 1699,
    stock: 5,
    shortDescription: "Absolute Nero 4 laranja aro 29 — linha Absolute no showroom de Fartura.",
    description:
      "Mountain bike Absolute Nero 4 laranja, aro 29, fotografada na loja. Freios a disco, grupo de marchas para trilha. Consulte tamanho e disponibilidade no WhatsApp. Retire em Fartura-SP ou peça envio pelo Mercado Livre.",
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
    compareAtPrice: 1599,
    stock: 3,
    shortDescription: "Absolute Nero azul no estoque da Bike Center Fartura.",
    description:
      "Mountain bike Absolute Nero azul, aro 29. Foto real da loja. Peça orçamento no WhatsApp para tamanhos e formas de pagamento. Loja física na Rua Mário Stella, 355, Fartura/SP.",
    images: [
      "/images/produtos/absolute-nero-azul.jpg",
      "/images/produtos/absolute-nero-azul-2.jpg",
    ],
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
    description:
      "Mountain bike Flex 2.0 amarela em estoque na Bike Center. Preço de referência da vitrine — confirme no WhatsApp. Visite a loja ou compre com envio pelo Mercado Livre.",
    images: [
      "/images/produtos/flex-2-0-amarela.jpg",
      "/images/produtos/flex-2-0-amarela-2.jpg",
    ],
  },
  {
    name: "Moto Honda CG vermelha (seminova)",
    slug: "moto-honda-cg-vermelha",
    sku: "BC-HONDA-CG-RED",
    brand: "Honda",
    categorySlug: "motos",
    price: 8900,
    stock: 1,
    shortDescription: "Moto Honda vermelha seminova na loja — consulte ano, km e documentação no WhatsApp.",
    description:
      "Moto Honda na cor vermelha disponível no showroom, com parede de capacetes e vestuário ao fundo. Unidade única — preço placeholder; peça avaliação no WhatsApp Claro ou Vivo. Retire na Bike Center Fartura, Rua Mário Stella, 355.",
    images: ["/images/produtos/moto-honda-vermelha.jpg"],
  },
  {
    name: "Capacetes de moto (Pro Tork, X11 e similares)",
    slug: "capacetes-moto",
    sku: "BC-HELM-MOTO",
    brand: "Misto",
    categorySlug: "capacetes",
    price: 289,
    stock: 12,
    shortDescription: "Capacetes de moto em várias cores e marcas — escolha na loja ou peça no WhatsApp.",
    description:
      "Parede de capacetes de moto (Pro Tork, X11 e outras marcas do estoque), jaquetas e rodas. Preço a partir de — modelos e numeração variam. Fale no WhatsApp para o modelo que você viu na foto.",
    images: ["/images/produtos/capacetes-moto.jpg"],
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
      "Capacetes de ciclismo na parede da loja (várias cores, inclusive infantil). Preço a partir de. Confirme tamanho no WhatsApp ou experimente na Rua Mário Stella, 355.",
    images: ["/images/produtos/capacetes-bike.jpg"],
  },
  {
    name: "Luvas, peças e acessórios de moto",
    slug: "luvas-e-acessorios",
    sku: "BC-ACC-GLOVES",
    brand: "Misto",
    categorySlug: "acessorios",
    price: 79,
    stock: 20,
    shortDescription: "Luvas X11, Daytech e acessórios — estoque na loja de Fartura.",
    description:
      "Expositor de luvas, peças e acessórios de moto (incluindo capacete Brasil). Preços a partir de — peça o item no WhatsApp com a foto. Retire na loja ou envio via Mercado Livre.",
    images: ["/images/produtos/luvas-acessorios.jpg"],
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
      "Cantinho kids da Bike Center: bicicletas infantis (incluindo modelos tipo Barbie/arose). Tag de vitrine a partir de R$ 349 para bikes até 12 anos — confirme o modelo no WhatsApp. Retire em Fartura-SP.",
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
      "Pneus de mountain bike Pirelli Scorpion e Chaoyang no expositor da loja. Preço a partir de, conforme medida (29 e outras). Diga a medida no WhatsApp que separamos. Oficina na mesma loja.",
    images: ["/images/produtos/pneus-mtb.jpg"],
  },
] as const;
