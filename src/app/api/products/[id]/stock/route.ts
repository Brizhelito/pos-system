import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema para validar la entrada
const updateStockSchema = z.object({
  id: z.number().int().positive(),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Validar y procesar los datos de entrada
    const body = await request.json();
    const validatedData = updateStockSchema.parse({
      ...body,
      id: productId,
    });

    // Actualizar el stock del producto
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: validatedData.stock,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar existencias:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Datos de entrada inválidos", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error al actualizar existencias" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
