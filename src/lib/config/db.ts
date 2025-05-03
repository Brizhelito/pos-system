import { PrismaClient } from "../../../lib/prisma-client";

// Exportamos la instancia única de PrismaClient para ser usada en toda la aplicación
export const prisma = new PrismaClient();
export const db = prisma; // Alias para mantener compatibilidad con código existente
