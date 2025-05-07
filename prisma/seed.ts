import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear configuraciones por defecto
  const defaultConfigs = [
    { key: "default_id_type", value: "VENEZOLANO" },
    { key: "default_payment_method", value: "EFECTIVO" },
    { key: "tax_rate", value: "16" },
    { key: "invoice_prefix", value: "FAC-" },
    { key: "receipt_footer", value: "Gracias por su compra" },
  ];

  console.log(`Start seeding default configurations...`);

  for (const config of defaultConfigs) {
    // Upsert para evitar duplicados
    await prisma.config.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: {
        key: config.key,
        value: config.value,
      },
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
