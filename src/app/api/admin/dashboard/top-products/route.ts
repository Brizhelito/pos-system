import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { startOfWeek, startOfMonth, startOfYear } from "date-fns";

/**
 * API para obtener los productos más vendidos
 * GET /api/admin/dashboard/top-products?limit=5&period=week|month|year
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const period = searchParams.get("period") || "week";

    // Definir el rango de fechas según el período
    const now = new Date();
    let startDate: Date;
    const endDate: Date = now;

    if (period === "week") {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
    } else if (period === "month") {
      startDate = startOfMonth(now);
    } else {
      // year
      startDate = startOfYear(now);
    }

    // Obtener los productos más vendidos agrupando las ventas del período
    const topProducts = await prisma.saleitem.groupBy({
      by: ["productId"],
      where: {
        sale: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    // Obtener detalles completos de los productos
    const productIds = topProducts.map((item) => item.productId);
    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Combinar datos para el formato esperado
    const data = topProducts.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId);
      return {
        name: product?.name || `Producto #${item.productId}`,
        ventas: item._sum.quantity || 0,
        ingresos: item._sum.subtotal || 0,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener top productos:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de productos" },
      { status: 500 }
    );
  }
}
