import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Ya no se crean configuraciones en la base de datos
  // porque ahora se usan las variables de entorno directamente
  console.log("Proceso de inicialización completado");
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
