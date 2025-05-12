import { NextResponse } from "next/server";
import { FinancesReportService } from "@/features/reports/services/finances/financesService";

export async function POST(request: Request) {
  try {
    const { action, startDate, endDate, period, groupBy } =
      await request.json();

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
      case "getProfitAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de Inicio y Fin" },
            { status: 400 }
          );
        }
        data = await FinancesReportService.getProfitAnalysis(
          parsedStartDate,
          parsedEndDate,
          period
        );
        break;

      case "getCashFlowAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de Inicio y Fin" },
            { status: 400 }
          );
        }
        data = await FinancesReportService.getCashFlowAnalysis(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getCostVsRevenueAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de Inicio y Fin" },
            { status: 400 }
          );
        }
        data = await FinancesReportService.getCostVsRevenueAnalysis(
          parsedStartDate,
          parsedEndDate,
          groupBy
        );
        break;

      case "getTaxReport":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de Inicio y Fin" },
            { status: 400 }
          );
        }
        data = await FinancesReportService.getTaxReport(
          parsedStartDate,
          parsedEndDate,
          period
        );
        break;

      case "getExpenseBreakdown":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de Inicio y Fin" },
            { status: 400 }
          );
        }
        data = await FinancesReportService.getExpenseBreakdown(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getFinancialSummary":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de Inicio y Fin" },
            { status: 400 }
          );
        }
        data = await FinancesReportService.getFinancialSummary(
          parsedStartDate,
          parsedEndDate
        );
        break;

      default:
        return NextResponse.json(
          { error: `Acción no reconocida: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error("Error en API de Reportes Financieros:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      {
        error: errorMessage,
        message: "Ha ocurrido un error al procesar la solicitud",
        success: false,
      },
      { status: 500 }
    );
  }
}
