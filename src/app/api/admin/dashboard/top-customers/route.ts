import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { startOfWeek, startOfMonth, startOfYear } from "date-fns";

/**
 * API para obtener los clientes con más compras
 * GET /api/admin/dashboard/top-customers?limit=5&period=week|month|year
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

    // Obtener clientes top según el número de compras realizadas
    const topCustomersData = await prisma.sale.groupBy({
      by: ["customerId"],
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
        status: "COMPLETED",
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });

    // Obtener información detallada de los clientes
    const customerIds = topCustomersData.map((item) => item.customerId);
    const customerDetails = await prisma.customer.findMany({
      where: {
        id: {
          in: customerIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Combinar datos para el formato esperado
    const data = topCustomersData.map((item) => {
      const customer = customerDetails.find((c) => c.id === item.customerId);
      return {
        name: customer?.name || `Cliente #${item.customerId}`,
        value: item._count.id,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener top clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de clientes" },
      { status: 500 }
    );
  }
}
