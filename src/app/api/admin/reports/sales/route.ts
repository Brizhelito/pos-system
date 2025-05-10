import { NextResponse } from "next/server";
import { SalesReportService } from "@/features/reports/services/sales/salesService";

export async function POST(request: Request) {
  try {
    const { action, startDate, endDate, year, limit } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Se requiere un parámetro 'action'" },
        { status: 400 }
      );
    }

    let data;
    let parsedStartDate;
    let parsedEndDate;

    // Parsear fechas si se proporcionan
    if (startDate) parsedStartDate = new Date(startDate);
    if (endDate) parsedEndDate = new Date(endDate);

    // Ejecutar la acción solicitada
    switch (action) {
      case "getSalesByDateRange":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getSalesByDateRange(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getMonthlySalesSummary":
        if (!year) {
          return NextResponse.json(
            { error: "Se requiere un año" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getMonthlySalesSummary(year);
        break;

      case "getSalesByCategory":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getSalesByCategory(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getSalesTrend":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getSalesTrend(
          parsedStartDate,
          parsedEndDate
        );
        break;

      // Nuevos métodos de análisis
      case "getHourlyAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getHourlyAnalysis(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getWeekdayAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getWeekdayAnalysis(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getComparativeAnalysis":
        // La fecha de fin es opcional, por defecto es la fecha actual
        data = await SalesReportService.getComparativeAnalysis(
          parsedEndDate || new Date()
        );
        break;

      case "getTicketAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getTicketAnalysis(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getAssociatedProducts":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getAssociatedProducts(
          parsedStartDate,
          parsedEndDate,
          limit || 10
        );
        break;

      case "getProfitMarginAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SalesReportService.getProfitMarginAnalysis(
          parsedStartDate,
          parsedEndDate,
          limit || 20
        );
        break;

      default:
        return NextResponse.json(
          { error: "Acción no válida" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error en API de reportes de ventas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
