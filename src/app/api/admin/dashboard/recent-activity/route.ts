import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { differenceInMinutes } from "date-fns";

/**
 * API para obtener la actividad reciente del sistema
 * GET /api/admin/dashboard/recent-activity
 */
export async function GET() {
  try {
    // Obtener las últimas ventas
    const recentSales = await prisma.sale.findMany({
      where: {
        status: "COMPLETED",
      },
      select: {
        id: true,
        saleDate: true,
        totalAmount: true,
      },
      orderBy: {
        saleDate: "desc",
      },
      take: 3,
    });

    // Obtener los últimos clientes registrados
    const recentCustomers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 2,
    });

    // Preparar los datos combinados
    const now = new Date();

    // Formatear ventas recientes
    const salesActivities = recentSales.map((sale) => ({
      tipo: "venta",
      tiempo: differenceInMinutes(now, sale.saleDate),
      monto: Number(sale.totalAmount),
      id: sale.id,
    }));

    // Formatear nuevos clientes
    const customerActivities = recentCustomers.map((customer) => ({
      tipo: "cliente",
      tiempo: differenceInMinutes(now, customer.createdAt),
      monto: 0,
      id: 0,
      nombre: customer.name,
    }));

    // Combinar y ordenar por tiempo (más reciente primero)
    const allActivities = [...salesActivities, ...customerActivities]
      .sort((a, b) => a.tiempo - b.tiempo)
      .slice(0, 5);

    // Si no hay actividad, proporcionar datos de ejemplo
    if (allActivities.length === 0) {
      return NextResponse.json(
        {
          data: [
            { tipo: "venta", tiempo: 5, monto: 834.25, id: 1001 },
            {
              tipo: "cliente",
              tiempo: 12,
              monto: 0,
              id: 0,
              nombre: "Carmen Rodríguez",
            },
            { tipo: "venta", tiempo: 18, monto: 429.5, id: 1002 },
            {
              tipo: "cliente",
              tiempo: 27,
              monto: 0,
              id: 0,
              nombre: "Roberto Sánchez",
            },
            { tipo: "venta", tiempo: 35, monto: 1245.75, id: 1003 },
          ],
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: allActivities }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener actividad reciente:", error);
    return NextResponse.json(
      {
        error: "Error al obtener datos de actividad reciente",
        data: [
          { tipo: "venta", tiempo: 5, monto: 834.25, id: 1001 },
          {
            tipo: "cliente",
            tiempo: 12,
            monto: 0,
            id: 0,
            nombre: "Carmen Rodríguez",
          },
          { tipo: "venta", tiempo: 18, monto: 429.5, id: 1002 },
          {
            tipo: "cliente",
            tiempo: 27,
            monto: 0,
            id: 0,
            nombre: "Roberto Sánchez",
          },
          { tipo: "venta", tiempo: 35, monto: 1245.75, id: 1003 },
        ],
      },
      { status: 500 }
    );
  }
}
