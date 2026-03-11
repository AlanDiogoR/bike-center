import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin Bike Center",
      phone: "11999999999",
      role: "ADMIN",
    },
  });

  const existingAddress = await prisma.address.findFirst({
    where: { userId: user.id },
  });
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: user.id,
        label: "Casa",
        street: "Av. Paulista",
        number: "1000",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
        isDefault: true,
      },
    });
  }

  const catBikes = await prisma.category.upsert({
    where: { slug: "bicicletas" },
    update: {},
    create: {
      name: "Bicicletas",
      slug: "bicicletas",
      description: "Bicicletas de todos os tipos",
      sortOrder: 0,
    },
  });

  const catPecas = await prisma.category.upsert({
    where: { slug: "pecas" },
    update: {},
    create: {
      name: "Peças e Componentes",
      slug: "pecas",
      description: "Peças e componentes para bicicletas",
      sortOrder: 1,
    },
  });

  const catOleos = await prisma.category.upsert({
    where: { slug: "oleos-manutencao" },
    update: {},
    create: {
      name: "Óleos e Manutenção",
      slug: "oleos-manutencao",
      description: "Lubrificantes e produtos de manutenção",
      sortOrder: 2,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Seed concluído. Admin: ${adminEmail} (senha em SEED_ADMIN_PASSWORD). Categorias criadas. Cadastre produtos pelo painel admin.`);
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
