import {
  startOfDay,
  endOfDay,
  subMonths,
  subYears,
  format,
  parseISO,
} from "date-fns";
import prisma from "@/lib/db/prisma";

export interface MonthlySalesData {
  name: string;
  ventas: number;
  ingresos: number;
}

export interface CategorySalesData {
  name: string;
  value: number;
}

export interface SalesTrendData {
  fecha: string;
  ventas: number;
}

// Interfaces para las nuevas estadísticas
export interface HourlyAnalysisData {
  hora: string;
  ventas: number;
  porcentaje: number;
}

export interface WeekdayAnalysisData {
  dia: string;
  ventas: number;
  porcentaje: number;
}

export interface ComparativeAnalysisData {
  periodo: string;
  actual: number;
  anterior: number;
  diferencia: number;
  porcentaje: number;
}

export interface TicketAnalysisData {
  fecha: string;
  promedio: number;
  minimo: number;
  maximo: number;
}

export interface AssociatedProductData {
  producto1: string;
  producto2: string;
  frecuencia: number;
  correlacion: number;
}

export interface ProfitMarginData {
  nombre: string;
  categoria: string;
  unidades: number;
  ingresos: number;
  costos: number;
  margen: number;
  porcentajeMargen: number;
}

export class SalesReportService {
  /**
   * Obtiene datos de ventas por rango de fechas
   */
  static async getSalesByDateRange(startDate: Date, endDate: Date) {
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
  static async getMonthlySalesSummary(
    year: number
  ): Promise<MonthlySalesData[]> {
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
          name: this.getMesNombre(index),
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
  static async getSalesByCategory(
    startDate: Date,
    endDate: Date
  ): Promise<CategorySalesData[]> {
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
  static async getSalesTrend(
    startDate: Date,
    endDate: Date
  ): Promise<SalesTrendData[]> {
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
        const dateStr = this.formatDateStr(sale.saleDate);
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

  /**
   * Obtiene análisis de ventas por hora del día
   */
  static async getHourlyAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<HourlyAnalysisData[]> {
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
        select: {
          id: true,
          saleDate: true,
        },
      });

      // Inicializar array con 24 horas (0-23)
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hora: i.toString().padStart(2, "0") + ":00",
        ventas: 0,
        porcentaje: 0,
      }));

      // Contar ventas por hora
      sales.forEach((sale) => {
        const hour = sale.saleDate.getHours();
        hourlyData[hour].ventas += 1;
      });

      // Calcular porcentaje
      const totalVentas = sales.length;
      hourlyData.forEach((item) => {
        item.porcentaje =
          totalVentas > 0 ? (item.ventas / totalVentas) * 100 : 0;
      });

      return hourlyData;
    } catch (error) {
      console.error("Error al obtener análisis por hora:", error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de ventas por día de la semana
   */
  static async getWeekdayAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<WeekdayAnalysisData[]> {
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
        select: {
          id: true,
          saleDate: true,
        },
      });

      // Inicializar array con los días de la semana
      const weekdays = [
        { dia: "Lunes", ventas: 0, porcentaje: 0 },
        { dia: "Martes", ventas: 0, porcentaje: 0 },
        { dia: "Miércoles", ventas: 0, porcentaje: 0 },
        { dia: "Jueves", ventas: 0, porcentaje: 0 },
        { dia: "Viernes", ventas: 0, porcentaje: 0 },
        { dia: "Sábado", ventas: 0, porcentaje: 0 },
        { dia: "Domingo", ventas: 0, porcentaje: 0 },
      ];

      // Contar ventas por día de la semana (0 = Domingo, 1 = Lunes, etc.)
      sales.forEach((sale) => {
        let dayIndex = sale.saleDate.getDay();
        // Ajustar para que 0 = Lunes, 1 = Martes, ..., 6 = Domingo
        dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        weekdays[dayIndex].ventas += 1;
      });

      // Calcular porcentaje
      const totalVentas = sales.length;
      weekdays.forEach((item) => {
        item.porcentaje =
          totalVentas > 0 ? (item.ventas / totalVentas) * 100 : 0;
      });

      return weekdays;
    } catch (error) {
      console.error("Error al obtener análisis por día de la semana:", error);
      throw error;
    }
  }

  /**
   * Obtiene comparativas de periodos (este mes vs anterior, este año vs anterior)
   */
  static async getComparativeAnalysis(
    endDate: Date = new Date()
  ): Promise<ComparativeAnalysisData[]> {
    try {
      // Fechas para comparativa mensual
      const currentMonthEnd = endOfDay(endDate);
      const currentMonthStart = startOfDay(
        new Date(endDate.getFullYear(), endDate.getMonth(), 1)
      );
      const previousMonthEnd = endOfDay(subMonths(currentMonthEnd, 1));
      const previousMonthStart = startOfDay(
        new Date(previousMonthEnd.getFullYear(), previousMonthEnd.getMonth(), 1)
      );

      // Fechas para comparativa anual
      const currentYearEnd = currentMonthEnd;
      const currentYearStart = startOfDay(
        new Date(endDate.getFullYear(), 0, 1)
      );
      const previousYearEnd = endOfDay(subYears(currentYearEnd, 1));
      const previousYearStart = startOfDay(
        new Date(previousYearEnd.getFullYear(), 0, 1)
      );

      // Obtener datos para el mes actual
      const currentMonthSales = await prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
          status: "COMPLETED",
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      });

      // Obtener datos para el mes anterior
      const previousMonthSales = await prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
          status: "COMPLETED",
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      });

      // Obtener datos para el año actual
      const currentYearSales = await prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: currentYearStart,
            lte: currentYearEnd,
          },
          status: "COMPLETED",
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      });

      // Obtener datos para el año anterior
      const previousYearSales = await prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: previousYearStart,
            lte: previousYearEnd,
          },
          status: "COMPLETED",
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      });

      // Preparar resultados
      const result: ComparativeAnalysisData[] = [
        {
          periodo: "Ventas este mes",
          actual: currentMonthSales._count.id || 0,
          anterior: previousMonthSales._count.id || 0,
          diferencia:
            (currentMonthSales._count.id || 0) -
            (previousMonthSales._count.id || 0),
          porcentaje: previousMonthSales._count.id
            ? ((currentMonthSales._count.id - previousMonthSales._count.id) /
                previousMonthSales._count.id) *
              100
            : 0,
        },
        {
          periodo: "Ingresos este mes",
          actual: Number(currentMonthSales._sum.totalAmount || 0),
          anterior: Number(previousMonthSales._sum.totalAmount || 0),
          diferencia:
            Number(currentMonthSales._sum.totalAmount || 0) -
            Number(previousMonthSales._sum.totalAmount || 0),
          porcentaje: Number(previousMonthSales._sum.totalAmount)
            ? ((Number(currentMonthSales._sum.totalAmount) -
                Number(previousMonthSales._sum.totalAmount)) /
                Number(previousMonthSales._sum.totalAmount)) *
              100
            : 0,
        },
        {
          periodo: "Ventas este año",
          actual: currentYearSales._count.id || 0,
          anterior: previousYearSales._count.id || 0,
          diferencia:
            (currentYearSales._count.id || 0) -
            (previousYearSales._count.id || 0),
          porcentaje: previousYearSales._count.id
            ? ((currentYearSales._count.id - previousYearSales._count.id) /
                previousYearSales._count.id) *
              100
            : 0,
        },
        {
          periodo: "Ingresos este año",
          actual: Number(currentYearSales._sum.totalAmount || 0),
          anterior: Number(previousYearSales._sum.totalAmount || 0),
          diferencia:
            Number(currentYearSales._sum.totalAmount || 0) -
            Number(previousYearSales._sum.totalAmount || 0),
          porcentaje: Number(previousYearSales._sum.totalAmount)
            ? ((Number(currentYearSales._sum.totalAmount) -
                Number(previousYearSales._sum.totalAmount)) /
                Number(previousYearSales._sum.totalAmount)) *
              100
            : 0,
        },
      ];

      return result;
    } catch (error) {
      console.error("Error al obtener análisis comparativo:", error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de ticket promedio por fecha
   */
  static async getTicketAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<TicketAnalysisData[]> {
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
        select: {
          id: true,
          saleDate: true,
          totalAmount: true,
        },
        orderBy: {
          saleDate: "asc",
        },
      });

      // Agrupar por fecha
      const ticketsByDate = new Map();

      sales.forEach((sale) => {
        const dateStr = format(sale.saleDate, "yyyy-MM-dd");
        if (!ticketsByDate.has(dateStr)) {
          ticketsByDate.set(dateStr, {
            tickets: [],
            fecha: format(sale.saleDate, "dd/MM/yyyy"),
          });
        }
        ticketsByDate.get(dateStr).tickets.push(Number(sale.totalAmount));
      });

      // Procesar y calcular estadísticas
      const result: TicketAnalysisData[] = [];

      ticketsByDate.forEach((value) => {
        const { tickets, fecha } = value;
        if (tickets.length > 0) {
          const sum = tickets.reduce((a: number, b: number) => a + b, 0);
          const promedio = sum / tickets.length;
          const minimo = Math.min(...tickets);
          const maximo = Math.max(...tickets);

          result.push({
            fecha,
            promedio,
            minimo,
            maximo,
          });
        }
      });

      // Ordenar por fecha
      return result.sort((a, b) => {
        const dateA = parseISO(a.fecha.split("/").reverse().join("-"));
        const dateB = parseISO(b.fecha.split("/").reverse().join("-"));
        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      console.error("Error al obtener análisis de ticket promedio:", error);
      throw error;
    }
  }

  /**
   * Obtiene productos que se venden frecuentemente juntos
   */
  static async getAssociatedProducts(
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<AssociatedProductData[]> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      // Obtener ventas con sus productos
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: start,
            lte: end,
          },
          status: "COMPLETED",
        },
        select: {
          id: true,
          saleitem: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      // Contar co-ocurrencias de productos
      const productPairs = new Map();
      const productCounts = new Map();

      sales.forEach((sale) => {
        // Obtener productos únicos en la venta
        const products = sale.saleitem.map((item) => ({
          id: item.product.id,
          name: item.product.name,
        }));

        // Incrementar conteo individual de productos
        products.forEach((product) => {
          productCounts.set(
            product.id,
            (productCounts.get(product.id) || 0) + 1
          );
        });

        // Crear pares de productos y contar co-ocurrencias
        for (let i = 0; i < products.length; i++) {
          for (let j = i + 1; j < products.length; j++) {
            const pair = [products[i], products[j]].sort((a, b) => a.id - b.id);
            const pairKey = `${pair[0].id}-${pair[1].id}`;

            if (!productPairs.has(pairKey)) {
              productPairs.set(pairKey, {
                producto1: pair[0].name,
                producto2: pair[1].name,
                frecuencia: 0,
                correlacion: 0,
              });
            }

            productPairs.get(pairKey).frecuencia += 1;
          }
        }
      });

      // Calcular correlación usando algoritmo básico de soporte
      productPairs.forEach((value, key) => {
        const [id1, id2] = key.split("-");
        const count1 = productCounts.get(parseInt(id1)) || 0;
        const count2 = productCounts.get(parseInt(id2)) || 0;

        // Correlación como proporción de co-ocurrencias sobre el total de apariciones individuales
        const totalPossibleOccurrences = Math.min(count1, count2);
        value.correlacion =
          totalPossibleOccurrences > 0
            ? (value.frecuencia / totalPossibleOccurrences) * 100
            : 0;
      });

      // Convertir el mapa a array y ordenar por correlación
      const result = Array.from(productPairs.values())
        .sort(
          (a, b) => b.correlacion - a.correlacion || b.frecuencia - a.frecuencia
        )
        .slice(0, limit);

      return result;
    } catch (error) {
      console.error("Error al obtener productos asociados:", error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de márgenes de ganancia por producto
   */
  static async getProfitMarginAnalysis(
    startDate: Date,
    endDate: Date,
    limit: number = 20
  ): Promise<ProfitMarginData[]> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      // Obtener ventas con detalles de productos
      const sales = await prisma.sale.findMany({
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

      // Estructura para almacenar datos agregados por producto
      const productData = new Map();

      // Procesar datos de ventas
      sales.forEach((sale) => {
        sale.saleitem.forEach((item) => {
          const productId = item.product.id;
          const unitPrice = Number(item.unitPrice);
          // Usamos purchasePrice para el costo del producto
          const costPrice = Number(item.product.purchasePrice || 0);
          const quantity = Number(item.quantity);
          const subtotal = unitPrice * quantity;
          const subtotalCost = costPrice * quantity;

          if (!productData.has(productId)) {
            productData.set(productId, {
              id: productId,
              nombre: item.product.name,
              categoria: item.product.category?.name || "Sin categoría",
              unidades: 0,
              ingresos: 0,
              costos: 0,
              margen: 0,
              porcentajeMargen: 0,
            });
          }

          const data = productData.get(productId);
          data.unidades += quantity;
          data.ingresos += subtotal;
          data.costos += subtotalCost;
        });
      });

      // Calcular márgenes
      const result: ProfitMarginData[] = [];

      productData.forEach((product) => {
        product.margen = product.ingresos - product.costos;
        product.porcentajeMargen =
          product.ingresos > 0 ? (product.margen / product.ingresos) * 100 : 0;
        result.push(product);
      });

      // Ordenar por margen total (de mayor a menor) y limitar resultados
      return result.sort((a, b) => b.margen - a.margen).slice(0, limit);
    } catch (error) {
      console.error("Error al obtener análisis de márgenes:", error);
      throw error;
    }
  }

  // Funciones auxiliares
  private static getMesNombre(index: number): string {
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

  private static formatDateStr(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  }
}
