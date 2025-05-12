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

// GET: Obtener una venta específica por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado
    if (!session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Obtener ID de la venta de los parámetros de ruta
    const saleId = parseInt(id, 10);

    if (isNaN(saleId)) {
      return NextResponse.json(
        { message: "ID de venta inválido", code: "INVALID_SALE_ID" },
        { status: 400 }
      );
    }

    // Obtener la venta por ID
    const sale = await getSaleById(saleId);

    return NextResponse.json(sale);
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Actualizar una venta existente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado
    if (!session.user) {
      return NextResponse.json(
        { message: "No autorizado para actualizar ventas" },
        { status: 403 }
      );
    }

    // Obtener ID de la venta de los parámetros de ruta
    const saleId = parseInt(id, 10);

    if (isNaN(saleId)) {
      return NextResponse.json(
        { message: "ID de venta inválido", code: "INVALID_SALE_ID" },
        { status: 400 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();

    // Combinar ID de ruta con los datos del cuerpo
    const updateData = {
      ...body,
      id: saleId, // Asegurar que el ID coincida con la ruta
    };

    // Validar datos con Zod schema
    const validatedData = SaleUpdateSchema.parse(updateData);

    // Actualizar venta usando el servicio
    const updatedSale = await updateSaleHandler(validatedData);

    return NextResponse.json(updatedSale);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Eliminar una venta existente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No autorizado para eliminar ventas" },
        { status: 403 }
      );
    }

    // Obtener ID de la venta de los parámetros de ruta
    const saleId = parseInt(id, 10);

    if (isNaN(saleId)) {
      return NextResponse.json(
        { message: "ID de venta inválido", code: "INVALID_SALE_ID" },
        { status: 400 }
      );
    }

    // Eliminar venta usando el servicio
    const deletedSale = await deleteSaleHandler(saleId);

    return NextResponse.json({
      message: "Venta eliminada correctamente",
      sale: deletedSale,
    });
  } catch (error) {
    return handleError(error);
  }
}
