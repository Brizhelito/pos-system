import { NextResponse } from "next/server";
import { ProfitAnalysisData } from "@/features/reports/types/finances";
import prisma from "@/lib/db/prisma";
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
  subMonths,
} from "date-fns";

/**
 * API para obtener datos de análisis de rentabilidad
 * GET /api/admin/dashboard/profit-analysis?period=week|month|year
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    // Definir el rango de fechas según el período
    const now = new Date();
    let startDate: Date;
    const endDate: Date = now;
    let compareStartDate: Date;

    if (period === "week") {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      compareStartDate = subMonths(startDate, 1);
    } else if (period === "month") {
      startDate = startOfMonth(now);
      compareStartDate = subMonths(startDate, 3);
    } else {
      // year
      startDate = startOfYear(now);
      compareStartDate = subMonths(startDate, 12);
    }

    // Obtener datos de ventas para el período actual
    const salesData = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: compareStartDate,
          lte: endDate,
        },
        status: "COMPLETED",
      },
      include: {
        saleitem: {
          include: {
            product: {
              select: {
                purchasePrice: true,
              },
            },
          },
        },
      },
      orderBy: {
        saleDate: "asc",
      },
    });

    // Definir tipo para el período de ventas
    interface PeriodSalesData {
      ingresos: number;
      costos: number;
      gastos: number;
    }

    // Agrupar datos por período (mes)
    const salesByPeriod: Record<string, PeriodSalesData> = {};

    salesData.forEach((sale) => {
      // Usar el formato YYYY-MM como clave del período
      const periodoKey = format(sale.saleDate, "yyyy-MM");

      if (!salesByPeriod[periodoKey]) {
        salesByPeriod[periodoKey] = {
          ingresos: 0,
          costos: 0,
          gastos: 0, // No tenemos datos de gastos, asumimos un 15% de los ingresos
        };
      }

      // Sumar ingresos y costos para este período
      salesByPeriod[periodoKey].ingresos += sale.totalAmount;

      // Calcular costos basados en los precios de compra de productos
      sale.saleitem.forEach((item) => {
        const costoPorUnidad = item.product.purchasePrice;
        salesByPeriod[periodoKey].costos += costoPorUnidad * item.quantity;
      });
    });

    // Procesar los datos para generar el análisis completo
    const trendData: ProfitAnalysisData[] = Object.entries(salesByPeriod)
      .map(([periodo, datos]) => {
        const ingresos = datos.ingresos;
        const costos = datos.costos;
        const gastos = ingresos * 0.15; // Estimamos gastos como 15% de ingresos
        const gananciaBruta = ingresos - costos;
        const gananciaNeta = gananciaBruta - gastos;
        const margenBruto = (gananciaBruta / ingresos) * 100;
        const margenNeto = (gananciaNeta / ingresos) * 100;

        return {
          periodo,
          ingresos,
          costos,
          gastos,
          gananciaBruta,
          gananciaNeta,
          margenBruto,
          margenNeto,
        };
      })
      .sort((a, b) => a.periodo.localeCompare(b.periodo));

    // Obtener último período para el resumen
    const latestPeriod = trendData[trendData.length - 1];
    const previousPeriod = trendData[trendData.length - 2] || latestPeriod;

    // Calcular crecimiento
    const crecimiento =
      previousPeriod.ingresos === 0
        ? 0
        : ((latestPeriod.ingresos - previousPeriod.ingresos) /
            previousPeriod.ingresos) *
          100;

    const summaryData = {
      ingresos: Math.round(latestPeriod.ingresos),
      costos: Math.round(latestPeriod.costos),
      gastos: Math.round(latestPeriod.gastos),
      gananciaNeta: Math.round(latestPeriod.gananciaNeta),
      margenBruto: Math.round(latestPeriod.margenBruto * 10) / 10,
      margenNeto: Math.round(latestPeriod.margenNeto * 10) / 10,
      crecimiento: Math.round(crecimiento * 10) / 10,
    };

    return NextResponse.json({ summaryData, trendData }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener análisis de rentabilidad:", error);
    return NextResponse.json(
      { error: "Error al obtener datos financieros" },
      { status: 500 }
    );
  }
}
