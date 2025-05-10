import { startOfDay, endOfDay } from "date-fns";
import prisma from "@/lib/db/prisma";

export interface SellerSummary {
  userId: number;
  nombre: string;
  numVentas: number;
  totalVentas: number;
  ticketPromedio: number;
}

export interface SellerTrendItem {
  userId: number;
  nombre: string;
  fecha: string;
  ventas: number;
  monto: number;
}

export interface TopProductBySeller {
  userId: number;
  vendedor: string;
  productoId: number;
  producto: string;
  cantidad: number;
  total: number;
  categoria: string;
}

export class SellerReportService {
  /**
   * Obtiene resumen de ventas por vendedor en un rango de fechas
   */
  static async getSellerSummary(
    startDate: Date,
    endDate: Date
  ): Promise<SellerSummary[]> {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Agrupar ventas completadas por vendedor
    const group = await prisma.sale.groupBy({
      by: ["userId"],
      where: {
        status: "COMPLETED",
        saleDate: { gte: start, lte: end },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    const userIds = group.map((g) => g.userId);
    // Obtener nombres de usuarios
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    return group.map((g) => {
      const user = users.find((u) => u.id === g.userId);
      const total = g._sum.totalAmount || 0;
      const count = g._count.id;
      return {
        userId: g.userId,
        nombre: user?.name || "Desconocido",
        numVentas: count,
        totalVentas: total,
        ticketPromedio: count > 0 ? parseFloat((total / count).toFixed(2)) : 0,
      };
    });
  }

  /**
   * Obtiene la evolución de ventas por vendedor en un rango de fechas (tendencias diarias)
   */
  static async getSellerTrend(
    startDate: Date,
    endDate: Date
  ): Promise<SellerTrendItem[]> {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Obtener ventas en el rango de fechas
    const ventas = await prisma.sale.findMany({
      where: {
        status: "COMPLETED",
        saleDate: { gte: start, lte: end },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        saleDate: "asc",
      },
    });

    // Agrupar por vendedor y fecha
    const ventasPorVendedorYFecha: Map<string, SellerTrendItem> = new Map();

    ventas.forEach((venta) => {
      const fechaStr = venta.saleDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const key = `${venta.userId}-${fechaStr}`;

      if (ventasPorVendedorYFecha.has(key)) {
        const item = ventasPorVendedorYFecha.get(key)!;
        item.ventas += 1;
        item.monto += Number(venta.totalAmount);
      } else {
        ventasPorVendedorYFecha.set(key, {
          userId: venta.userId,
          nombre: venta.user.name,
          fecha: fechaStr,
          ventas: 1,
          monto: Number(venta.totalAmount),
        });
      }
    });

    return Array.from(ventasPorVendedorYFecha.values());
  }

  /**
   * Obtiene los productos más vendidos por cada vendedor
   */
  static async getTopProductsBySeller(
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<TopProductBySeller[]> {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Obtener ventas con detalles de productos
    const ventas = await prisma.sale.findMany({
      where: {
        status: "COMPLETED",
        saleDate: { gte: start, lte: end },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
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

    // Agrupar por vendedor y producto
    const productosPorVendedor: Map<string, TopProductBySeller> = new Map();

    ventas.forEach((venta) => {
      venta.saleitem.forEach((item) => {
        const key = `${venta.userId}-${item.productId}`;

        if (productosPorVendedor.has(key)) {
          const producto = productosPorVendedor.get(key)!;
          producto.cantidad += item.quantity;
          producto.total += Number(item.subtotal);
        } else {
          productosPorVendedor.set(key, {
            userId: venta.userId,
            vendedor: venta.user.name,
            productoId: item.productId,
            producto: item.product.name,
            cantidad: item.quantity,
            total: Number(item.subtotal),
            categoria: item.product.category.name,
          });
        }
      });
    });

    // Convertir a array y ordenar por cantidad
    const result = Array.from(productosPorVendedor.values());

    // Agrupar los productos top por vendedor
    const vendedores = [...new Set(result.map((item) => item.userId))];

    let topProductos: TopProductBySeller[] = [];

    vendedores.forEach((userId) => {
      const productosVendedor = result
        .filter((item) => item.userId === userId)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, limit);

      topProductos = [...topProductos, ...productosVendedor];
    });

    return topProductos;
  }
}
