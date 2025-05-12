import prisma from "@/lib/db/prisma";
import { startOfDay, endOfDay, format, subMonths } from "date-fns";
import {
  ProfitAnalysisData,
  CashFlowData,
  CostVsRevenueData,
  TaxReportData,
  ExpenseBreakdownData,
  FinancialSummaryData,
} from "@/features/reports/types/finances";

/**
 * Servicio para reportes financieros
 */
export class FinancesReportService {
  /**
   * Obtiene análisis de rentabilidad por período
   */
  static async getProfitAnalysis(
    startDate: Date,
    endDate: Date,
    period: "daily" | "weekly" | "monthly" = "monthly"
  ): Promise<ProfitAnalysisData[]> {
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
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calcular ingresos, costos y ganancias
      const profitData: Record<string, ProfitAnalysisData> = {};

      // Procesar cada venta
      sales.forEach((sale) => {
        // Formatear la fecha según el período seleccionado
        let periodoKey;
        switch (period) {
          case "daily":
            periodoKey = format(sale.saleDate, "yyyy-MM-dd");
            break;
          case "weekly":
            periodoKey = `${format(sale.saleDate, "yyyy")}-S${Math.ceil(
              +format(sale.saleDate, "d") / 7
            )}`;
            break;
          case "monthly":
          default:
            periodoKey = format(sale.saleDate, "yyyy-MM");
            break;
        }

        // Inicializar el período si no existe
        if (!profitData[periodoKey]) {
          profitData[periodoKey] = {
            periodo: periodoKey,
            ingresos: 0,
            costos: 0,
            gananciaBruta: 0,
            margenBruto: 0,
            gastos: 0, // Esto debería venir de otra tabla
            gananciaNeta: 0,
            margenNeto: 0,
          };
        }

        // Acumular ingresos
        profitData[periodoKey].ingresos += Number(sale.totalAmount);

        // Calcular costos basados en los items de la venta
        sale.saleitem.forEach((item) => {
          const costo = item.quantity * Number(item.product.purchasePrice);
          profitData[periodoKey].costos += costo;
        });
      });

      // Calcular márgenes y ganancias para cada período
      Object.values(profitData).forEach((periodo) => {
        periodo.gananciaBruta = periodo.ingresos - periodo.costos;
        periodo.margenBruto =
          periodo.ingresos > 0
            ? (periodo.gananciaBruta / periodo.ingresos) * 100
            : 0;

        // Para este ejemplo, asumimos gastos operativos como un 20% de los ingresos
        // En una implementación real, estos deberían venir de una tabla de gastos
        periodo.gastos = periodo.ingresos * 0.2;
        periodo.gananciaNeta = periodo.gananciaBruta - periodo.gastos;
        periodo.margenNeto =
          periodo.ingresos > 0
            ? (periodo.gananciaNeta / periodo.ingresos) * 100
            : 0;
      });

      // Convertir a array y ordenar por período
      return Object.values(profitData).sort((a, b) =>
        a.periodo.localeCompare(b.periodo)
      );
    } catch (error) {
      console.error("Error al obtener análisis de rentabilidad:", error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de flujo de caja
   */
  static async getCashFlowAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<CashFlowData[]> {
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
        },
        orderBy: {
          saleDate: "asc",
        },
      });

      // Agrupar ventas por fecha
      const cashFlowByDate: Record<string, CashFlowData> = {};

      sales.forEach((sale) => {
        const dateStr = format(sale.saleDate, "yyyy-MM-dd");

        if (!cashFlowByDate[dateStr]) {
          cashFlowByDate[dateStr] = {
            fecha: format(sale.saleDate, "dd/MM/yyyy"),
            ingresosVentas: 0,
            otrosIngresos: 0,
            totalIngresos: 0,
            pagosProveedores: 0,
            gastosOperativos: 0,
            otrosEgresos: 0,
            totalEgresos: 0,
            flujoNeto: 0,
            saldoAcumulado: 0,
          };
        }

        // Acumular ingresos por ventas
        cashFlowByDate[dateStr].ingresosVentas += Number(sale.totalAmount);
      });

      // Procesar cada día para simular otros valores
      // En una implementación real, estos deberían venir de tablas específicas
      let saldoAcumulado = 0;
      const resultado = Object.keys(cashFlowByDate)
        .sort()
        .map((dateStr) => {
          const data = cashFlowByDate[dateStr];

          // Simular otros valores (en una implementación real, estos vendrían de la base de datos)
          data.otrosIngresos = data.ingresosVentas * 0.05; // 5% de otros ingresos
          data.totalIngresos = data.ingresosVentas + data.otrosIngresos;

          data.pagosProveedores = data.ingresosVentas * 0.6; // 60% pagos a proveedores
          data.gastosOperativos = data.ingresosVentas * 0.15; // 15% gastos operativos
          data.otrosEgresos = data.ingresosVentas * 0.03; // 3% otros egresos
          data.totalEgresos =
            data.pagosProveedores + data.gastosOperativos + data.otrosEgresos;

          data.flujoNeto = data.totalIngresos - data.totalEgresos;
          saldoAcumulado += data.flujoNeto;
          data.saldoAcumulado = saldoAcumulado;

          return data;
        });

      return resultado;
    } catch (error) {
      console.error("Error al obtener análisis de flujo de caja:", error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de costos vs ingresos por categoría o producto
   */
  static async getCostVsRevenueAnalysis(
    startDate: Date,
    endDate: Date,
    groupBy: "category" | "product" = "category"
  ): Promise<CostVsRevenueData[]> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      // Obtener ventas en el rango de fechas con sus items y productos
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

      // Analizar por categoría o producto
      const analysis: Record<string, CostVsRevenueData> = {};

      sales.forEach((sale) => {
        sale.saleitem.forEach((item) => {
          const key =
            groupBy === "category"
              ? item.product.category.name
              : `${item.product.name}`;

          if (!analysis[key]) {
            analysis[key] = {
              categoria:
                groupBy === "category"
                  ? item.product.category.name
                  : item.product.category.name,
              producto: groupBy === "product" ? item.product.name : undefined,
              ingresos: 0,
              costos: 0,
              margen: 0,
              porcentajeMargen: 0,
              unidadesVendidas: 0,
              puntoEquilibrio: 0,
            };
          }

          // Acumular valores
          analysis[key].ingresos += Number(item.subtotal);
          analysis[key].costos +=
            item.quantity * Number(item.product.purchasePrice);
          analysis[key].unidadesVendidas += item.quantity;
        });
      });

      // Calcular valores derivados
      Object.values(analysis).forEach((item) => {
        item.margen = item.ingresos - item.costos;
        item.porcentajeMargen =
          item.ingresos > 0 ? (item.margen / item.ingresos) * 100 : 0;

        // Calcular punto de equilibrio básico
        // Punto de equilibrio = Costos Fijos / (Precio Unitario - Costo Variable Unitario)
        const precioPromedio =
          item.unidadesVendidas > 0 ? item.ingresos / item.unidadesVendidas : 0;
        const costoPromedio =
          item.unidadesVendidas > 0 ? item.costos / item.unidadesVendidas : 0;

        // Asumimos costos fijos como un 30% de los costos totales
        const costosFijos = item.costos * 0.3;

        item.puntoEquilibrio =
          precioPromedio !== costoPromedio
            ? costosFijos / (precioPromedio - costoPromedio)
            : 0;
      });

      // Convertir a array y ordenar por margen
      return Object.values(analysis).sort((a, b) => b.margen - a.margen);
    } catch (error) {
      console.error("Error al obtener análisis de costos vs ingresos:", error);
      throw error;
    }
  }

  /**
   * Obtiene reportes fiscales (impuestos)
   */
  static async getTaxReport(
    startDate: Date,
    endDate: Date,
    period: "monthly" | "quarterly" | "yearly" = "monthly"
  ): Promise<TaxReportData[]> {
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
      });

      // Agrupar por período
      const taxReport: Record<string, TaxReportData> = {};

      sales.forEach((sale) => {
        // Formatear la fecha según el período seleccionado
        let periodoKey;
        switch (period) {
          case "yearly":
            periodoKey = format(sale.saleDate, "yyyy");
            break;
          case "quarterly":
            const quarter = Math.ceil((sale.saleDate.getMonth() + 1) / 3);
            periodoKey = `${format(sale.saleDate, "yyyy")}-Q${quarter}`;
            break;
          case "monthly":
          default:
            periodoKey = format(sale.saleDate, "yyyy-MM");
            break;
        }

        // Inicializar el período si no existe
        if (!taxReport[periodoKey]) {
          taxReport[periodoKey] = {
            periodo: periodoKey,
            ventasNetas: 0,
            impuestosCobrados: 0,
            impuestosPagados: 0,
            saldoImpuestos: 0,
            baseImponible: 0,
            tasaImpositiva: 16, // Asumimos 16% como tasa de IVA
          };
        }

        // Acumular ventas
        taxReport[periodoKey].ventasNetas += Number(sale.totalAmount);

        // Calcular impuestos (en una implementación real, estos deberían venir directamente de la base de datos)
        const baseImponible = Number(sale.totalAmount) / 1.16; // Asumiendo 16% de IVA
        taxReport[periodoKey].baseImponible += baseImponible;
        taxReport[periodoKey].impuestosCobrados +=
          Number(sale.totalAmount) - baseImponible;
      });

      // Calcular valores derivados
      Object.values(taxReport).forEach((item) => {
        // Simulamos impuestos pagados como un 70% de los impuestos cobrados
        item.impuestosPagados = item.impuestosCobrados * 0.7;
        item.saldoImpuestos = item.impuestosCobrados - item.impuestosPagados;
      });

      // Convertir a array y ordenar por período
      return Object.values(taxReport).sort((a, b) =>
        a.periodo.localeCompare(b.periodo)
      );
    } catch (error) {
      console.error("Error al obtener reporte fiscal:", error);
      throw error;
    }
  }

  /**
   * Obtiene desglose de gastos
   * Nota: Para una implementación real, se requeriría una tabla de gastos
   */
  static async getExpenseBreakdown(
    startDate: Date,
    endDate: Date
  ): Promise<ExpenseBreakdownData[]> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      // Obtener ventas para estimar gastos
      const totalSales = await prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: start,
            lte: end,
          },
          status: "COMPLETED",
        },
        _sum: {
          totalAmount: true,
        },
      });

      // En una implementación real, estos datos vendrían de una tabla de gastos
      // Por ahora, generamos datos simulados basados en las ventas
      const totalIngresos = Number(totalSales._sum.totalAmount || 0);

      // Obtener ventas del periodo anterior para comparar
      const previousStart = subMonths(start, 1);
      const previousEnd = subMonths(end, 1);

      const previousSales = await prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: previousStart,
            lte: previousEnd,
          },
          status: "COMPLETED",
        },
        _sum: {
          totalAmount: true,
        },
      });

      const previousIngresos = Number(previousSales._sum.totalAmount || 0);

      // Distribución simulada de gastos
      const gastos: ExpenseBreakdownData[] = [
        {
          categoria: "Personal",
          monto: totalIngresos * 0.25,
          porcentaje: 25,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.25) / (previousIngresos * 0.25) - 1) * 100
              : 0,
        },
        {
          categoria: "Operaciones",
          subcategoria: "Alquiler",
          monto: totalIngresos * 0.1,
          porcentaje: 10,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.1) / (previousIngresos * 0.1) - 1) * 100
              : 0,
        },
        {
          categoria: "Operaciones",
          subcategoria: "Servicios",
          monto: totalIngresos * 0.05,
          porcentaje: 5,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.05) / (previousIngresos * 0.05) - 1) * 100
              : 0,
        },
        {
          categoria: "Marketing",
          monto: totalIngresos * 0.08,
          porcentaje: 8,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.08) / (previousIngresos * 0.08) - 1) * 100
              : 0,
        },
        {
          categoria: "Tecnología",
          monto: totalIngresos * 0.07,
          porcentaje: 7,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.07) / (previousIngresos * 0.07) - 1) * 100
              : 0,
        },
        {
          categoria: "Impuestos",
          monto: totalIngresos * 0.18,
          porcentaje: 18,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.18) / (previousIngresos * 0.18) - 1) * 100
              : 0,
        },
        {
          categoria: "Otros",
          monto: totalIngresos * 0.07,
          porcentaje: 7,
          tendencia:
            previousIngresos > 0
              ? ((totalIngresos * 0.07) / (previousIngresos * 0.07) - 1) * 100
              : 0,
        },
      ];

      return gastos;
    } catch (error) {
      console.error("Error al obtener desglose de gastos:", error);
      throw error;
    }
  }

  /**
   * Obtiene resumen financiero
   */
  static async getFinancialSummary(
    startDate: Date,
    endDate: Date
  ): Promise<FinancialSummaryData> {
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
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calcular ingresos y costos
      let totalIngresos = 0;
      let totalCostos = 0;

      sales.forEach((sale) => {
        totalIngresos += Number(sale.totalAmount);

        sale.saleitem.forEach((item) => {
          totalCostos += item.quantity * Number(item.product.purchasePrice);
        });
      });

      // En una implementación real, los gastos vendrían de una tabla específica
      // Por ahora, simulamos gastos como un porcentaje de los ingresos
      const totalGastos = totalIngresos * 0.4; // 40% de los ingresos

      // Calcular ganancias y márgenes
      const gananciaBruta = totalIngresos - totalCostos;
      const gananciaNeta = gananciaBruta - totalGastos;

      const margenBruto =
        totalIngresos > 0 ? (gananciaBruta / totalIngresos) * 100 : 0;
      const margenNeto =
        totalIngresos > 0 ? (gananciaNeta / totalIngresos) * 100 : 0;

      // Inversión estimada (en una implementación real vendría de otra tabla)
      const inversionEstimada = totalIngresos * 0.5;
      const roi =
        inversionEstimada > 0 ? (gananciaNeta / inversionEstimada) * 100 : 0;

      // Ratio de liquidez simulado
      const liquidez = 1.5; // En una implementación real, se calcularía con activos y pasivos circulantes

      return {
        totalIngresos,
        totalCostos,
        totalGastos,
        gananciaBruta,
        gananciaNeta,
        margenBruto,
        margenNeto,
        roi,
        liquidez,
      };
    } catch (error) {
      console.error("Error al obtener resumen financiero:", error);
      throw error;
    }
  }
}
