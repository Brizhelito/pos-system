import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  format,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * API para obtener un resumen de ventas por período
 * GET /api/admin/dashboard/sales-summary?period=week|month|year
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
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Semana comienza el lunes
    } else if (period === "month") {
      startDate = startOfMonth(now);
    } else {
      // year
      startDate = startOfYear(now);
    }

    // Obtener ventas del período seleccionado
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
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

    // Agrupar datos según el período
    let data: { fecha: string; ventas: number }[] = [];

    if (period === "week") {
      // Agrupar por día de la semana
      const daysOfWeek = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];
      const salesByDay: Record<string, number> = {};

      // Inicializar todos los días con cero
      daysOfWeek.forEach((day) => {
        salesByDay[day] = 0;
      });

      // Sumar las ventas por día
      sales.forEach((sale) => {
        const dayName = format(sale.saleDate, "EEEE", { locale: es });
        const capitalizedDay =
          dayName.charAt(0).toUpperCase() + dayName.slice(1);
        salesByDay[capitalizedDay] += 1;
      });

      // Convertir a formato esperado
      data = daysOfWeek.map((day) => ({
        fecha: day,
        ventas: salesByDay[day],
      }));
    } else if (period === "month") {
      // Para datos mensuales, agrupar por semana
      const weeksInMonth: Record<string, number> = {};

      // Conseguir el número de semanas en el mes
      const weekCount = Math.ceil(
        (endOfMonth(now).getDate() - startOfMonth(now).getDate() + 1) / 7
      );

      // Inicializar todas las semanas con cero
      for (let i = 1; i <= weekCount; i++) {
        weeksInMonth[`Semana ${i}`] = 0;
      }

      // Sumar ventas por semana
      sales.forEach((sale) => {
        const weekNum = Math.ceil(
          (sale.saleDate.getDate() - startOfMonth(now).getDate() + 1) / 7
        );
        weeksInMonth[`Semana ${weekNum}`] += 1;
      });

      // Convertir a formato esperado
      data = Object.entries(weeksInMonth).map(([semana, ventas]) => ({
        fecha: semana,
        ventas,
      }));
    } else {
      // year
      // Para datos anuales, agrupar por mes
      const monthsInYear: Record<string, number> = {};
      const monthNames = [
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

      // Inicializar todos los meses con cero
      monthNames.forEach((month) => {
        monthsInYear[month] = 0;
      });

      // Sumar ventas por mes
      sales.forEach((sale) => {
        const monthName = format(sale.saleDate, "MMM", { locale: es });
        const capitalizedMonth =
          monthName.charAt(0).toUpperCase() + monthName.slice(1);
        monthsInYear[capitalizedMonth] += 1;
      });

      // Convertir a formato esperado
      data = monthNames.map((month) => ({
        fecha: month,
        ventas: monthsInYear[month],
      }));
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener resumen de ventas:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de ventas" },
      { status: 500 }
    );
  }
}
