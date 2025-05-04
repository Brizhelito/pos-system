import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import { createSaleHandler, getSales } from "@/services/SaleService";
import { SaleCreateSchema } from "@/types/Sale";

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

    // Obtener todas las ventas
    const sales = await getSales();

    return NextResponse.json(sales);
  } catch (error) {
    const apiErrorResponse = handleError(error);

    return NextResponse.json(
      {
        message: apiErrorResponse.message,
        code: apiErrorResponse.code,
      },
      { status: apiErrorResponse.statusCode }
    );
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
    const apiErrorResponse = handleError(error);

    return NextResponse.json(
      {
        message: apiErrorResponse.message,
        code: apiErrorResponse.code,
      },
      { status: apiErrorResponse.statusCode }
    );
  }
}
