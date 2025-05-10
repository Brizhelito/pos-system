import {
  startOfDay,
  endOfDay,
  differenceInDays,
  format,
  subMonths,
  parseISO,
} from "date-fns";
import prisma from "@/lib/db/prisma";

export interface RFMAnalysis {
  id: number;
  nombre: string;
  recencia: number; // días desde última compra
  frecuencia: number; // número de compras
  monetizacion: number; // valor total en compras
  puntuacionR: number; // puntuación de recencia (1-5)
  puntuacionF: number; // puntuación de frecuencia (1-5)
  puntuacionM: number; // puntuación de monetización (1-5)
  puntuacionRFM: number; // puntuación combinada
  segmento: string; // segmento asignado
}

export interface CustomerLifecycle {
  id: number;
  nombre: string;
  primerCompra: Date | null;
  ultimaCompra: Date | null;
  diasComoCliente: number;
  comprasPorMes: number;
  valorPromedio: number;
  valorTotal: number;
  estado: string;
}

export interface RetentionData {
  periodo: string;
  nuevos: number;
  recurrentes: number;
  perdidos: number;
  tasaRetencion: number;
}

export interface SeasonalPattern {
  periodo: string;
  clientes: number;
  transacciones: number;
  valorPromedio: number;
  valorTotal: number;
}

export class RFMService {
  /**
   * Analiza a los clientes usando el modelo RFM (Recencia, Frecuencia, Monetización)
   */
  static async getRFMAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<RFMAnalysis[]> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);
      const today = new Date();

      // Obtener todos los clientes con sus ventas en el período
      const customers = await prisma.customer.findMany({
        include: {
          sale: {
            where: {
              saleDate: {
                gte: start,
                lte: end,
              },
              status: "COMPLETED",
            },
            orderBy: {
              saleDate: "desc",
            },
          },
        },
      });

      // Calcular métricas RFM para cada cliente
      const rfmData = customers.map((customer) => {
        // Recencia: días desde la última compra
        const lastPurchaseDate =
          customer.sale.length > 0 ? customer.sale[0].saleDate : null;

        const recencia = lastPurchaseDate
          ? differenceInDays(today, lastPurchaseDate)
          : 999; // Valor alto para clientes sin compras

        // Frecuencia: número total de compras
        const frecuencia = customer.sale.length;

        // Monetización: valor total de compras
        const monetizacion = customer.sale.reduce(
          (sum, sale) => sum + Number(sale.totalAmount),
          0
        );

        return {
          id: customer.id,
          nombre: customer.name,
          recencia,
          frecuencia,
          monetizacion,
          puntuacionR: 0, // Se calculará después
          puntuacionF: 0, // Se calculará después
          puntuacionM: 0, // Se calculará después
          puntuacionRFM: 0, // Se calculará después
          segmento: "", // Se asignará después
        };
      });

      // Filtrar clientes sin compras para el análisis
      const clientesConCompras = rfmData.filter((c) => c.frecuencia > 0);

      // Definir quintiles para puntuación
      const calcularQuintiles = (arr: number[]) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const len = sorted.length;
        const quintiles = [
          sorted[Math.floor(len * 0.2)],
          sorted[Math.floor(len * 0.4)],
          sorted[Math.floor(len * 0.6)],
          sorted[Math.floor(len * 0.8)],
        ];
        return quintiles;
      };

      if (clientesConCompras.length > 0) {
        // Calcular quintiles para cada métrica
        const recenciaQuintiles = calcularQuintiles(
          clientesConCompras.map((c) => c.recencia)
        );

        const frecuenciaQuintiles = calcularQuintiles(
          clientesConCompras.map((c) => c.frecuencia)
        );

        const monetizacionQuintiles = calcularQuintiles(
          clientesConCompras.map((c) => c.monetizacion)
        );

        // Asignar puntuaciones a cada cliente
        clientesConCompras.forEach((cliente) => {
          // Recencia (invertida: menor recencia = mayor puntuación)
          if (cliente.recencia <= recenciaQuintiles[0]) cliente.puntuacionR = 5;
          else if (cliente.recencia <= recenciaQuintiles[1])
            cliente.puntuacionR = 4;
          else if (cliente.recencia <= recenciaQuintiles[2])
            cliente.puntuacionR = 3;
          else if (cliente.recencia <= recenciaQuintiles[3])
            cliente.puntuacionR = 2;
          else cliente.puntuacionR = 1;

          // Frecuencia (mayor frecuencia = mayor puntuación)
          if (cliente.frecuencia >= frecuenciaQuintiles[3])
            cliente.puntuacionF = 5;
          else if (cliente.frecuencia >= frecuenciaQuintiles[2])
            cliente.puntuacionF = 4;
          else if (cliente.frecuencia >= frecuenciaQuintiles[1])
            cliente.puntuacionF = 3;
          else if (cliente.frecuencia >= frecuenciaQuintiles[0])
            cliente.puntuacionF = 2;
          else cliente.puntuacionF = 1;

          // Monetización (mayor monetización = mayor puntuación)
          if (cliente.monetizacion >= monetizacionQuintiles[3])
            cliente.puntuacionM = 5;
          else if (cliente.monetizacion >= monetizacionQuintiles[2])
            cliente.puntuacionM = 4;
          else if (cliente.monetizacion >= monetizacionQuintiles[1])
            cliente.puntuacionM = 3;
          else if (cliente.monetizacion >= monetizacionQuintiles[0])
            cliente.puntuacionM = 2;
          else cliente.puntuacionM = 1;

          // Puntuación RFM combinada
          cliente.puntuacionRFM =
            cliente.puntuacionR * 100 +
            cliente.puntuacionF * 10 +
            cliente.puntuacionM;

          // Asignar segmento basado en puntuación RFM
          // Campeones: Clientes recientes, frecuentes y que gastan mucho
          if (
            cliente.puntuacionR >= 4 &&
            cliente.puntuacionF >= 4 &&
            cliente.puntuacionM >= 4
          ) {
            cliente.segmento = "Campeones";
          }
          // Leales: Gastan regularmente pero no son los que más gastan
          else if (
            cliente.puntuacionR >= 3 &&
            cliente.puntuacionF >= 3 &&
            cliente.puntuacionM >= 3
          ) {
            cliente.segmento = "Leales";
          }
          // Potenciales: Compras recientes pero poca frecuencia/gasto
          else if (
            cliente.puntuacionR >= 4 &&
            cliente.puntuacionF <= 3 &&
            cliente.puntuacionM <= 3
          ) {
            cliente.segmento = "Potenciales";
          }
          // En Riesgo: Anteriormente activos pero sin compras recientes
          else if (
            cliente.puntuacionR <= 2 &&
            cliente.puntuacionF >= 3 &&
            cliente.puntuacionM >= 3
          ) {
            cliente.segmento = "En Riesgo";
          }
          // Necesitan Atención: Gastaron bien pero hace tiempo
          else if (
            cliente.puntuacionR <= 2 &&
            cliente.puntuacionF >= 3 &&
            cliente.puntuacionM <= 3
          ) {
            cliente.segmento = "Necesitan Atención";
          }
          // Nuevos: Compras recientes pero poca frecuencia
          else if (cliente.puntuacionR >= 4 && cliente.puntuacionF <= 2) {
            cliente.segmento = "Nuevos";
          }
          // Durmientes: No compran desde hace tiempo
          else if (cliente.puntuacionR <= 2 && cliente.puntuacionF <= 2) {
            cliente.segmento = "Durmientes";
          } else {
            cliente.segmento = "Ocasionales";
          }
        });
      }

      // Combinar ambos conjuntos y ordenar por puntuación RFM
      const clientesSinCompras = rfmData
        .filter((c) => c.frecuencia === 0)
        .map((c) => ({
          ...c,
          segmento: "Sin Actividad",
        }));

      return [...clientesConCompras, ...clientesSinCompras].sort(
        (a, b) => b.puntuacionRFM - a.puntuacionRFM
      );
    } catch (error) {
      console.error("Error en análisis RFM:", error);
      throw error;
    }
  }

  /**
   * Analiza el ciclo de vida de los clientes
   */
  static async getCustomerLifecycle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startDate: Date,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endDate: Date
  ): Promise<CustomerLifecycle[]> {
    try {
      const today = new Date();

      // Obtener todos los clientes con TODAS sus ventas (no solo en el período)
      const customers = await prisma.customer.findMany({
        include: {
          sale: {
            where: {
              status: "COMPLETED",
            },
            orderBy: {
              saleDate: "asc", // ascendente para encontrar la primera compra
            },
          },
        },
      });

      return customers.map((customer) => {
        const ventas = customer.sale;

        // Primera y última compra
        const primerCompra = ventas.length > 0 ? ventas[0].saleDate : null;
        const ultimaCompra =
          ventas.length > 0 ? ventas[ventas.length - 1].saleDate : null;

        // Días como cliente
        const diasComoCliente = primerCompra
          ? differenceInDays(today, primerCompra)
          : 0;

        // Compras por mes (si tiene días como cliente)
        const comprasPorMes =
          diasComoCliente > 0 ? ventas.length / (diasComoCliente / 30) : 0;

        // Valor promedio y total
        const valorTotal = ventas.reduce(
          (sum, sale) => sum + Number(sale.totalAmount),
          0
        );
        const valorPromedio =
          ventas.length > 0 ? valorTotal / ventas.length : 0;

        // Determinar estado del cliente
        let estado = "Inactivo";
        if (ventas.length === 0) {
          estado = "Sin Compras";
        } else if (
          ultimaCompra &&
          differenceInDays(today, ultimaCompra) <= 30
        ) {
          estado = "Activo";
        } else if (
          ultimaCompra &&
          differenceInDays(today, ultimaCompra) <= 90
        ) {
          estado = "En Riesgo";
        } else if (ultimaCompra && differenceInDays(today, ultimaCompra) > 90) {
          estado = "Perdido";
        }

        return {
          id: customer.id,
          nombre: customer.name,
          primerCompra,
          ultimaCompra,
          diasComoCliente,
          comprasPorMes: parseFloat(comprasPorMes.toFixed(2)),
          valorPromedio: parseFloat(valorPromedio.toFixed(2)),
          valorTotal: parseFloat(valorTotal.toFixed(2)),
          estado,
        };
      });
    } catch (error) {
      console.error("Error al analizar ciclo de vida:", error);
      throw error;
    }
  }

  /**
   * Calcula la tasa de retención de clientes por períodos
   */
  static async getRetentionRate(
    startDate: Date,
    endDate: Date
  ): Promise<RetentionData[]> {
    try {
      // Definir períodos para análisis (últimos 6 meses)
      const periodos: RetentionData[] = [];

      // Crear períodos mensuales desde la fecha de inicio hacia atrás
      let currentMonth = endDate;
      for (let i = 0; i < 6; i++) {
        const monthStart = startOfDay(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        );
        const monthEnd = endOfDay(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        );

        const prevMonthStart = startOfDay(
          new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1)
        );
        const prevMonthEnd = endOfDay(
          new Date(monthStart.getFullYear(), monthStart.getMonth(), 0)
        );

        // Obtener ventas del mes actual y anterior
        const ventasMesActual = await prisma.sale.findMany({
          where: {
            saleDate: { gte: monthStart, lte: monthEnd },
            status: "COMPLETED",
          },
          select: { customerId: true, saleDate: true },
          orderBy: { saleDate: "asc" },
        });

        const ventasMesAnterior = await prisma.sale.findMany({
          where: {
            saleDate: { gte: prevMonthStart, lte: prevMonthEnd },
            status: "COMPLETED",
          },
          select: { customerId: true },
        });

        // Identificar clientes únicos en cada período
        const clientesMesActual = [
          ...new Set(ventasMesActual.map((v) => v.customerId)),
        ];
        const clientesMesAnterior = [
          ...new Set(ventasMesAnterior.map((v) => v.customerId)),
        ];

        // Clientes nuevos: no existían en el mes anterior
        const nuevos = clientesMesActual.filter(
          (id) => !clientesMesAnterior.includes(id)
        ).length;

        // Clientes recurrentes: existían en ambos meses
        const recurrentes = clientesMesActual.filter((id) =>
          clientesMesAnterior.includes(id)
        ).length;

        // Clientes perdidos: existían en el mes anterior pero no en el actual
        const perdidos = clientesMesAnterior.filter(
          (id) => !clientesMesActual.includes(id)
        ).length;

        // Tasa de retención: recurrentes / (recurrentes + perdidos)
        const tasaRetencion =
          clientesMesAnterior.length > 0
            ? parseFloat(
                ((recurrentes / clientesMesAnterior.length) * 100).toFixed(2)
              )
            : 0;

        periodos.push({
          periodo: format(monthStart, "MMM yyyy"),
          nuevos,
          recurrentes,
          perdidos,
          tasaRetencion,
        });

        currentMonth = subMonths(monthStart, 1);
      }

      // Revertir para que el orden sea cronológico
      return periodos.reverse();
    } catch (error) {
      console.error("Error al calcular tasa de retención:", error);
      throw error;
    }
  }

  /**
   * Analiza patrones estacionales de compra de clientes
   */
  static async getSeasonalPatterns(
    startDate: Date,
    endDate: Date
  ): Promise<SeasonalPattern[]> {
    try {
      // Obtener todas las ventas en el período
      const ventas = await prisma.sale.findMany({
        where: {
          saleDate: { gte: startDate, lte: endDate },
          status: "COMPLETED",
        },
        select: {
          id: true,
          customerId: true,
          saleDate: true,
          totalAmount: true,
        },
      });

      // Crear mapa para agrupar por períodos
      // Usaremos meses como períodos
      const periodoMap = new Map<
        string,
        {
          clientes: Set<number>;
          transacciones: number;
          valorTotal: number;
        }
      >();

      // Procesar cada venta
      ventas.forEach((venta) => {
        const fecha = venta.saleDate;
        const periodo = format(fecha, "MMM yyyy");

        if (!periodoMap.has(periodo)) {
          periodoMap.set(periodo, {
            clientes: new Set<number>(),
            transacciones: 0,
            valorTotal: 0,
          });
        }

        const data = periodoMap.get(periodo)!;
        data.clientes.add(venta.customerId);
        data.transacciones += 1;
        data.valorTotal += Number(venta.totalAmount);
      });

      // Convertir mapa a array de resultados
      const resultado: SeasonalPattern[] = [];

      for (const [periodo, data] of periodoMap.entries()) {
        const valorPromedio =
          data.transacciones > 0
            ? parseFloat((data.valorTotal / data.transacciones).toFixed(2))
            : 0;

        resultado.push({
          periodo,
          clientes: data.clientes.size,
          transacciones: data.transacciones,
          valorPromedio,
          valorTotal: parseFloat(data.valorTotal.toFixed(2)),
        });
      }

      // Ordenar cronológicamente
      return resultado.sort((a, b) => {
        const dateA = new Date(parseISO(`01 ${a.periodo}`));
        const dateB = new Date(parseISO(`01 ${b.periodo}`));
        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      console.error("Error al analizar patrones estacionales:", error);
      throw error;
    }
  }
}
