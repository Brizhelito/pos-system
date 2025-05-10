import { NextResponse } from "next/server";
import { prisma } from "@/components/config/db";
import { z } from "zod";

const productDetailSchema = z.object({
  id: z.number().positive("ID de producto inválido"),
});

/**
 * GET /api/sales/products/detail?id=productId
 * Obtiene los detalles completos de un producto por su ID
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de producto requerido" },
        { status: 400 }
      );
    }

    // Validar el ID
    const result = productDetailSchema.safeParse({ id: parseInt(id) });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "ID de producto inválido",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    // Buscar el producto por ID con sus relaciones
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: true,
        provider: true, // Incluimos el proveedor para información adicional
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Obtener las ventas recientes asociadas con este producto (opcional)
    const recentSales = await prisma.saleitem.findMany({
      where: {
        productId: parseInt(id),
      },
      take: 10,
      orderBy: {
        sale: {
          saleDate: "desc",
        },
      },
      include: {
        sale: {
          select: {
            saleDate: true,
            paymentMethod: true,
          },
        },
      },
    });

    // Mapear el producto al formato esperado por el cliente
    const mappedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || "",
      sellingPrice: product.sellingPrice,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      minStock: product.minStock || 0,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : undefined,
      provider: product.provider
        ? {
            id: product.provider.id,
            name: product.provider.name,
          }
        : undefined,
      // Movimientos recientes de ventas
      recentMovements: recentSales.map((item) => ({
        id: item.id,
        type: "OUT", // Salida, ya que son ventas
        quantity: item.quantity,
        date: item.sale.saleDate,
        notes: `Venta - Método de pago: ${item.sale.paymentMethod}`,
      })),
      // Información de inventario
      inventoryStatus:
        product.stock <= (product.minStock || 0)
          ? "LOW"
          : product.stock > (product.minStock || 0) * 3
          ? "NORMAL"
          : "WARNING",
    };

    return NextResponse.json({ product: mappedProduct });
  } catch (error) {
    console.error("Error al obtener detalles del producto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
