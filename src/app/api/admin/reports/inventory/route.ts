import { NextResponse } from "next/server";
import { InventoryReportService } from "@/features/reports/services/inventory/inventoryService";

export async function POST(request: Request) {
  try {
    const { action, startDate, endDate } = await request.json();

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

    // Verificar si se necesitan fechas para la acción
    const actionsRequiringDates = [
      "getInventoryTurnover",
      "getStockPrediction",
      "getEarlyAlerts",
      "getExcessInventory",
      "getInventoryVelocity",
    ];

    if (
      actionsRequiringDates.includes(action) &&
      (!parsedStartDate || !parsedEndDate)
    ) {
      return NextResponse.json(
        { error: "Se requieren fechas de inicio y fin para esta acción" },
        { status: 400 }
      );
    }

    // Ejecutar la acción solicitada
    switch (action) {
      case "getAllInventory":
        data = await InventoryReportService.getAllInventory();
        break;

      case "getLowStockInventory":
        data = await InventoryReportService.getLowStockInventory();
        break;

      case "getInventoryValue":
        data = await InventoryReportService.getInventoryValue();
        break;

      case "getInventoryItems":
        if (!parsedStartDate || !parsedEndDate) {
          return NextResponse.json(
            { error: "Se requieren fechas de inicio y fin" },
            { status: 400 }
          );
        }
        data = await InventoryReportService.getInventoryItems(
          parsedStartDate,
          parsedEndDate
        );
        break;

      case "getInventoryByCategory":
        // Obtener la información de categorías usando el servicio
        data = await InventoryReportService.getInventoryByCategory();
        break;

      case "getInventoryTurnover":
        data = await InventoryReportService.getInventoryTurnover(
          parsedStartDate!,
          parsedEndDate!
        );
        break;

      // Nuevas acciones para reportes avanzados
      case "getStockPrediction":
        data = await InventoryReportService.getStockPrediction(
          parsedStartDate!,
          parsedEndDate!
        );
        break;

      case "getEarlyAlerts":
        data = await InventoryReportService.getEarlyAlerts(
          parsedStartDate!,
          parsedEndDate!
        );
        break;

      case "getExcessInventory":
        data = await InventoryReportService.getExcessInventory(
          parsedStartDate!,
          parsedEndDate!
        );
        break;

      case "getInventoryVelocity":
        data = await InventoryReportService.getInventoryVelocity(
          parsedStartDate!,
          parsedEndDate!
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
    console.error("Error en API de reportes de inventario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
