import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

/**
 * API para obtener el estado actual del inventario
 * GET /api/admin/dashboard/inventory-status
 */
export async function GET() {
  try {
    // Consultar datos reales de la base de datos
    const [
      allProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
    ] = await Promise.all([
      // Total de productos
      prisma.product.count(),

      // Productos con stock bajo
      prisma.product.count({
        where: {
          stock: {
            lte: prisma.product.fields.minStock,
          },
        },
      }),

      // Productos sin stock
      prisma.product.count({
        where: {
          stock: 0,
        },
      }),

      // Valor total del inventario
      prisma.product.aggregate({
        _sum: {
          sellingPrice: true,
        },
      }),
    ]);

    // Producto con mayor rotación (más ventas)
    const topSellingProduct = await prisma.product.findFirst({
      select: {
        name: true,
        _count: {
          select: {
            saleitem: true,
          },
        },
      },
      orderBy: {
        saleitem: {
          _count: "desc",
        },
      },
    });

    const inventoryStatus = {
      totalProducts: allProducts,
      lowStockItems: lowStockProducts,
      outOfStockItems: outOfStockProducts,
      highestTurnover: topSellingProduct?.name || "Sin datos",
      totalValue: totalInventoryValue._sum.sellingPrice || 0,
    };

    return NextResponse.json(inventoryStatus, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estado del inventario:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del inventario" },
      { status: 500 }
    );
  }
}
