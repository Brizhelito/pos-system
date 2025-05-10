import { NextResponse } from "next/server";
import { CustomerReportService } from "@/features/reports/services/customers/customersService";
import { RFMService } from "@/features/reports/services/customers/rfmService";

export async function POST(request: Request) {
  try {
    const { action, startDate, endDate, limit } = await request.json();

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
      case "getCustomersWithPurchases":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await CustomerReportService.getCustomersWithPurchases(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getCustomerSegments":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await CustomerReportService.getCustomerSegments(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getTopCustomers":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await CustomerReportService.getTopCustomers(
          parsedStartDate,
          parsedEndDate,
          limit || 10
        );
        break;

      // Nuevos métodos de análisis RFM
      case "getRFMAnalysis":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await RFMService.getRFMAnalysis(parsedStartDate, parsedEndDate);
        break;

      case "getCustomerLifecycle":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await RFMService.getCustomerLifecycle(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getRetentionRate":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await RFMService.getRetentionRate(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getSeasonalPatterns":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await RFMService.getSeasonalPatterns(
          parsedStartDate,
          parsedEndDate
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
    console.error("Error en API de reportes de clientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
