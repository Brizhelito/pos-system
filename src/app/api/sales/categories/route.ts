import { NextResponse } from "next/server";
import { prisma } from "@/components/config/db";

/**
 * GET /api/sales/categories
 * Obtiene todas las categorías disponibles
 */
export async function GET() {
  try {
    // Obtener todas las categorías
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Mapear categorías al formato esperado por el cliente
    const mappedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    return NextResponse.json({ categories: mappedCategories });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
