import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { startOfWeek, startOfMonth, startOfYear } from "date-fns";

/**
 * API para obtener la distribución de ventas por categoría de producto
 * GET /api/admin/dashboard/sales-distribution?period=week|month|year
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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

    // Consultar ventas por categoría de producto
    const salesByCategory = await prisma.saleitem.groupBy({
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
      },
    });

    // Obtener información de productos y categorías
    const productIds = salesByCategory.map((item) => item.productId);
    const productsWithCategories = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Agrupar por categoría
    const categorySales: Record<string, number> = {};

    // Relacionar productos vendidos con sus categorías
    salesByCategory.forEach((item) => {
      const product = productsWithCategories.find(
        (p) => p.id === item.productId
      );
      if (product) {
        const categoryName = product.category.name;
        if (!categorySales[categoryName]) {
          categorySales[categoryName] = 0;
        }
        categorySales[categoryName] += item._sum.quantity || 0;
      }
    });

    // Calcular el total para obtener porcentajes
    const totalSales = Object.values(categorySales).reduce(
      (sum, value) => sum + value,
      0
    );

    // Formatear datos para el gráfico
    const data = Object.entries(categorySales).map(([name, value]) => ({
      name,
      value: Math.round((value / totalSales) * 100), // Porcentaje redondeado
    }));

    // Si no hay datos, proporcionar algunos datos de ejemplo
    if (data.length === 0) {
      return NextResponse.json(
        {
          data: [
            { name: "Electrónicos", value: 35 },
            { name: "Ropa", value: 25 },
            { name: "Hogar", value: 20 },
            { name: "Deportes", value: 15 },
            { name: "Otros", value: 5 },
          ],
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener distribución de ventas:", error);
    return NextResponse.json(
      {
        error: "Error al obtener datos de distribución de ventas",
        data: [
          { name: "Electrónicos", value: 35 },
          { name: "Ropa", value: 25 },
          { name: "Hogar", value: 20 },
          { name: "Deportes", value: 15 },
          { name: "Otros", value: 5 },
        ],
      },
      { status: 500 }
    );
  }
}
