import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: { name: "ACME S.A.", slug: "acme" },
  });

  await prisma.product.createMany({
    data: [
      { tenantId: tenant.id, sku: "A-001", name: "Producto A1", price: 10.5 },
      { tenantId: tenant.id, sku: "A-002", name: "Producto A2", price: 25.0 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completo");
}

main().finally(() => prisma.$disconnect());
