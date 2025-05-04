import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import {
  getSaleById,
  updateSaleHandler,
  deleteSaleHandler,
} from "@/services/SaleService";
import { SaleUpdateSchema } from "@/types/Sale";

// GET: Obtener una venta por ID (solo para administradores)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener ID de la venta
    const id = parseInt(params.id);

    // Obtener venta por ID
    const sale = await getSaleById(id);

    // Verificar que la venta existe
    if (!sale) {
      return NextResponse.json(
        { message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(sale);
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

// PUT: Actualizar una venta (solo para administradores)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener ID de la venta
    const id = parseInt(params.id);

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();

    // Validar datos con Zod schema
    const validatedData = SaleUpdateSchema.parse(body);

    // Actualizar venta usando el servicio
    const updatedSale = await updateSaleHandler({
      id,
      ...validatedData,
    });

    return NextResponse.json(updatedSale);
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

// DELETE: Eliminar una venta (solo para administradores)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener ID de la venta
    const id = parseInt(params.id);

    // Eliminar venta usando el servicio
    await deleteSaleHandler(id);

    return NextResponse.json(
      { message: "Venta eliminada correctamente" },
      { status: 200 }
    );
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
