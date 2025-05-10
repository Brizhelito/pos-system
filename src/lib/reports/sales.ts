import { startOfDay, endOfDay } from "date-fns";
import prisma from "@/lib/db/prisma";

/**
 * Obtiene datos de ventas por rango de fechas
 */
export async function getSalesByDateRange(startDate: Date, endDate: Date) {
  try {
    // Asegurar que las fechas incluyan todo el día
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Obtener ventas en el rango de fechas
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end,
        },
        status: "COMPLETED", // Solo ventas completadas
      },
      include: {
        saleitem: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        customer: true,
        user: true,
      },
      orderBy: {
        saleDate: "asc",
      },
    });

    return sales;
  } catch (error) {
    console.error("Error al obtener ventas por rango de fechas:", error);
    throw error;
  }
}

/**
 * Obtiene resumen de ventas mensuales
 */
export async function getMonthlySalesSummary(year: number) {
  try {
    // Obtener todas las ventas del año
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
        status: "COMPLETED",
      },
    });

    // Organizar por mes
    const monthlySales = Array(12)
      .fill(0)
      .map((_, index) => ({
        name: getMesNombre(index),
        ventas: 0,
        ingresos: 0,
      }));

    sales.forEach((sale) => {
      const month = sale.saleDate.getMonth();
      monthlySales[month].ventas += 1;
      monthlySales[month].ingresos += Number(sale.totalAmount);
    });

    return monthlySales;
  } catch (error) {
    console.error("Error al obtener resumen de ventas mensuales:", error);
    throw error;
  }
}

/**
 * Obtiene datos para gráfico de ventas por categoría
 */
export async function getSalesByCategory(startDate: Date, endDate: Date) {
  try {
    // Asegurar que las fechas incluyan todo el día
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Consultar ventas con sus productos y categorías
    const salesWithItems = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end,
        },
        status: "COMPLETED",
      },
      include: {
        saleitem: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Agrupar por categoría
    const categoryMap = new Map();

    salesWithItems.forEach((sale) => {
      sale.saleitem.forEach((item) => {
        const categoryName = item.product.category.name;
        const currentValue = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, currentValue + Number(item.quantity));
      });
    });

    // Convertir a formato para gráfico
    const categoryData = Array.from(categoryMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Ordenar de mayor a menor
    return categoryData.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error("Error al obtener ventas por categoría:", error);
    throw error;
  }
}

/**
 * Obtiene datos para gráfico de tendencia de ventas
 */
export async function getSalesTrend(startDate: Date, endDate: Date) {
  try {
    // Asegurar que las fechas incluyan todo el día
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Obtener ventas en el rango de fechas
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end,
        },
        status: "COMPLETED",
      },
      orderBy: {
        saleDate: "asc",
      },
    });

    // Agrupar por fecha
    const salesByDate = new Map();

    sales.forEach((sale) => {
      const dateStr = formatDateStr(sale.saleDate);
      const currentValue = salesByDate.get(dateStr) || 0;
      salesByDate.set(dateStr, currentValue + 1);
    });

    // Convertir a formato para gráfico
    const trendData = Array.from(salesByDate.entries()).map(
      ([fecha, ventas]) => ({
        fecha,
        ventas,
      })
    );

    return trendData;
  } catch (error) {
    console.error("Error al obtener tendencia de ventas:", error);
    throw error;
  }
}

// Funciones auxiliares
function getMesNombre(index: number): string {
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return meses[index];
}

function formatDateStr(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}
