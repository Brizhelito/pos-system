import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ProductSearchSchema } from "@/features/sales/api/validation";

const prisma = new PrismaClient();

/**
 * GET /api/sales/products/search?term=searchTerm
 * Busca productos por nombre, descripción o categoría
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term") || "";

    // Validar el término de búsqueda
    const result = ProductSearchSchema.safeParse({ term });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Término de búsqueda inválido",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    // Buscar productos que coincidan con el término de búsqueda
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        category: true,
      },
      take: 20, // Limitar resultados
    });

    // Mapear productos al formato esperado por el cliente
    const mappedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || "",
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : undefined,
    }));

    return NextResponse.json({ products: mappedProducts });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
