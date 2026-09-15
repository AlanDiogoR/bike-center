import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "./catalog";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@bikecenter.com.br";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("[FATAL] SEED_ADMIN_PASSWORD env var is required");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin Bike Center",
      phone: "14991667793",
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin Bike Center",
      phone: "14991667793",
      role: "ADMIN",
    },
  });

  const storeAddress = {
    label: "Loja",
    street: "Rua Mário Stella",
    number: "355",
    neighborhood: "Vila Nova",
    city: "Fartura",
    state: "SP",
    zipCode: "18870-000",
    country: "Brasil",
    isDefault: true,
  };

  const existingAddress = await prisma.address.findFirst({
    where: { userId: user.id },
  });
  if (existingAddress) {
    await prisma.address.update({
      where: { id: existingAddress.id },
      data: storeAddress,
    });
  } else {
    await prisma.address.create({
      data: {
        userId: user.id,
        ...storeAddress,
      },
    });
  }

  const categoryIds = new Map<string, string>();
  for (const cat of SEED_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryIds.set(cat.slug, row.id);
  }

  for (const product of SEED_PRODUCTS) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Categoria não encontrada: ${product.categorySlug}`);
    }
    const images = [...product.images];
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        images,
        categoryId,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        sku: product.sku,
        brand: product.brand,
        images,
        categoryId,
        isActive: true,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seed concluído. Admin: ${adminEmail}. ${SEED_CATEGORIES.length} categorias, ${SEED_PRODUCTS.length} produtos. Endereço: Rua Mário Stella, 355, Fartura/SP.`
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
