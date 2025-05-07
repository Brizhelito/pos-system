import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import { createSaleHandler, getSales } from "@/services/SaleService";
import { SaleCreateSchema } from "@/types/Sale";
import { z } from "zod";
import { SaleFilters } from "@/types/sales";

// Schema para validar los filtros
const SaleFiltersSchema = z
  .object({
    customerId: z.number().positive().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    saleStatus: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
    userId: z.number().positive().optional(),
    paymentMethod: z.enum(["CASH", "CARD", "TRANSFER", "OTHER"]).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "La fecha de inicio debe ser anterior a la fecha de fin",
    }
  );

// GET: Obtener todas las ventas (solo para administradores)
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      req,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y sea administrador
    if (!session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No autorizado. Se requiere rol de administrador" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    // Extraer filtros de los parámetros de búsqueda
    const filters: SaleFilters = {};

    if (searchParams.has("customerId"))
      filters.customerId = parseInt(
        searchParams.get("customerId") as string,
        10
      );

    if (searchParams.has("startDate")) {
      const startDate = new Date(searchParams.get("startDate") as string);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { error: "Fecha de inicio inválida" },
          { status: 400 }
        );
      }
      filters.startDate = startDate;
    }

    if (searchParams.has("endDate")) {
      const endDate = new Date(searchParams.get("endDate") as string);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: "Fecha de fin inválida" },
          { status: 400 }
        );
      }
      filters.endDate = endDate;
    }

    if (searchParams.has("minTotal")) {
      const minTotal = parseFloat(searchParams.get("minTotal") as string);
      if (isNaN(minTotal) || minTotal < 0) {
        return NextResponse.json(
          { error: "Total mínimo inválido" },
          { status: 400 }
        );
      }
    }

    if (searchParams.has("maxTotal")) {
      const maxTotal = parseFloat(searchParams.get("maxTotal") as string);
      if (isNaN(maxTotal) || maxTotal < 0) {
        return NextResponse.json(
          { error: "Total máximo inválido" },
          { status: 400 }
        );
      }
    }

    if (searchParams.has("status")) {
      const status = searchParams.get("status") as
        | "PENDING"
        | "COMPLETED"
        | "CANCELLED";
      if (!["PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      filters.saleStatus = status;
    }

    // Validar los filtros con Zod
    try {
      SaleFiltersSchema.parse(filters);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors[0].message },
          { status: 400 }
        );
      }
      throw error;
    }

    // Obtener todas las ventas con filtros
    const sales = await getSales(filters);

    return NextResponse.json(sales);
  } catch (error) {
    return handleError(error);
  }
}

// POST: Crear una nueva venta (permitido para administradores y vendedores)
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      req,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado
    if (!session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();

    // Validar datos con Zod schema
    const validatedData = SaleCreateSchema.parse({
      ...body,
      userId: session.user.id,
    });

    // Crear venta usando el servicio, con el userId de la sesión
    const newSale = await createSaleHandler({
      ...validatedData,
      userId: session.user.id, // Usar el userId de la sesión
    });

    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
