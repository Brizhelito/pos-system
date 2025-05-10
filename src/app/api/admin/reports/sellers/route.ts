import { NextResponse } from "next/server";
import { SellerReportService } from "@/features/reports/services/sellers/sellersService";

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
    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;
    if (startDate) parsedStartDate = new Date(startDate);
    if (endDate) parsedEndDate = new Date(endDate);

    switch (action) {
      case "getSellerSummary":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SellerReportService.getSellerSummary(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getSellerTrend":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SellerReportService.getSellerTrend(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getTopProductsBySeller":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await SellerReportService.getTopProductsBySeller(
          parsedStartDate,
          parsedEndDate,
          limit || 10
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
    console.error("Error en API de reportes de vendedores:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
