import { startOfDay, endOfDay } from "date-fns";
import prisma from "@/lib/db/prisma";

export interface CustomerWithPurchases {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  idNumber: string | null;
  idType: string;
  compras: number;
  ultimaCompra: Date | null;
  totalGastado: number;
  tipo: string;
}

export interface CustomerSegment {
  segmento: string;
  cantidad: number;
  porcentaje: number;
  crecimiento: string;
}

export class CustomerReportService {
  /**
   * Obtiene la lista de clientes con información de compras
   */
  static async getCustomersWithPurchases(
    startDate: Date,
    endDate: Date
  ): Promise<CustomerWithPurchases[]> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      // Obtener todos los clientes
      const customers = await prisma.customer.findMany();

      // Para cada cliente, obtener sus compras en el período
      const customersWithData = await Promise.all(
        customers.map(async (customer) => {
          // Obtener ventas del cliente en el rango de fechas
          const sales = await prisma.sale.findMany({
            where: {
              customerId: customer.id,
              saleDate: {
                gte: start,
                lte: end,
              },
              status: "COMPLETED",
            },
          });

          // Calcular estadísticas
          const totalPurchases = sales.length;
          const totalSpent = sales.reduce(
            (sum, sale) => sum + Number(sale.totalAmount),
            0
          );

          // Determinar la última compra (si existe)
          let lastPurchaseDate = null;
          if (sales.length > 0) {
            const sortedSales = [...sales].sort(
              (a, b) => b.saleDate.getTime() - a.saleDate.getTime()
            );
            lastPurchaseDate = sortedSales[0].saleDate;
          }

          // Determinar tipo de cliente según frecuencia de compra
          let customerType = "Sin compras";
          if (totalPurchases > 0) {
            if (totalPurchases === 1) {
              customerType = "Nuevo";
            } else if (totalPurchases < 4) {
              customerType = "Ocasional";
            } else if (totalPurchases < 8) {
              customerType = "Regular";
            } else if (totalPurchases < 15) {
              customerType = "Frecuente";
            } else {
              customerType = "Premium";
            }
          }

          return {
            id: customer.id,
            nombre: customer.name,
            email: customer.email,
            telefono: customer.phone,
            idNumber: customer.idNumber,
            idType: customer.idType,
            compras: totalPurchases,
            ultimaCompra: lastPurchaseDate,
            totalGastado: totalSpent,
            tipo: customerType,
          };
        })
      );

      // Ordenar por total gastado (de mayor a menor)
      return customersWithData.sort((a, b) => b.totalGastado - a.totalGastado);
    } catch (error) {
      console.error("Error al obtener clientes con compras:", error);
      throw error;
    }
  }

  /**
   * Obtiene el análisis de segmentos de clientes
   */
  static async getCustomerSegments(
    startDate: Date,
    endDate: Date
  ): Promise<CustomerSegment[]> {
    try {
      // Obtener clientes con compras
      const customers = await this.getCustomersWithPurchases(
        startDate,
        endDate
      );

      // Definir segmentos
      const segments = [
        {
          segmento: "Sin compras",
          cantidad: 0,
          porcentaje: 0,
          crecimiento: "0%",
        },
        { segmento: "Nuevo", cantidad: 0, porcentaje: 0, crecimiento: "0%" },
        {
          segmento: "Ocasional",
          cantidad: 0,
          porcentaje: 0,
          crecimiento: "0%",
        },
        { segmento: "Regular", cantidad: 0, porcentaje: 0, crecimiento: "0%" },
        {
          segmento: "Frecuente",
          cantidad: 0,
          porcentaje: 0,
          crecimiento: "0%",
        },
        { segmento: "Premium", cantidad: 0, porcentaje: 0, crecimiento: "0%" },
      ];

      // Contar clientes por segmento
      customers.forEach((customer) => {
        const segment = segments.find((s) => s.segmento === customer.tipo);
        if (segment) {
          segment.cantidad += 1;
        }
      });

      // Calcular porcentajes
      const totalCustomers = customers.length;
      segments.forEach((segment) => {
        segment.porcentaje = (segment.cantidad / totalCustomers) * 100;
      });

      // Nota: Para calcular crecimiento real se necesitaría datos históricos
      // Aquí simulamos algunos datos de crecimiento para el ejemplo
      const growthData: { [key: string]: string } = {
        "Sin compras": "-5%",
        Nuevo: "+25%",
        Ocasional: "+10%",
        Regular: "-5%",
        Frecuente: "+8%",
        Premium: "+2%",
      };

      segments.forEach((segment) => {
        segment.crecimiento = growthData[segment.segmento] || "0%";
      });

      return segments;
    } catch (error) {
      console.error("Error al obtener segmentos de clientes:", error);
      throw error;
    }
  }

  /**
   * Obtiene los clientes más valiosos (top spenders)
   */
  static async getTopCustomers(
    startDate: Date,
    endDate: Date,
    limit = 10
  ): Promise<CustomerWithPurchases[]> {
    try {
      const customers = await this.getCustomersWithPurchases(
        startDate,
        endDate
      );

      // Filtrar solo los que tienen compras y ordenar por gasto total
      const customersWithPurchases = customers
        .filter((customer) => customer.compras > 0)
        .sort((a, b) => b.totalGastado - a.totalGastado)
        .slice(0, limit);

      return customersWithPurchases;
    } catch (error) {
      console.error("Error al obtener top clientes:", error);
      throw error;
    }
  }
}
