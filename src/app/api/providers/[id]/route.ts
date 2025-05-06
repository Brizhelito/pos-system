import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import {
  getProviderById,
  updateProviderHandler,
  deleteProviderHandler,
} from "@/services/ProviderService";
import { ProviderUpdateSchema } from "@/types/Provider";

// GET: Obtener un proveedor específico por ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
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

    // Obtener ID del proveedor de los parámetros de ruta
    const providerId = parseInt(context.params.id, 10);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { message: "ID de proveedor inválido", code: "INVALID_PROVIDER_ID" },
        { status: 400 }
      );
    }

    // Obtener el proveedor por ID
    const provider = await getProviderById(providerId);

    return NextResponse.json(provider);
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Actualizar un proveedor existente
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No autorizado para actualizar proveedores" },
        { status: 403 }
      );
    }

    // Obtener ID del proveedor de los parámetros de ruta
    const providerId = parseInt(context.params.id, 10);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { message: "ID de proveedor inválido", code: "INVALID_PROVIDER_ID" },
        { status: 400 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();

    // Combinar ID de ruta con los datos del cuerpo
    const updateData = {
      ...body,
      id: providerId, // Asegurar que el ID coincida con la ruta
    };

    // Validar datos con Zod schema
    const validatedData = ProviderUpdateSchema.parse(updateData);

    // Actualizar proveedor usando el servicio
    const updatedProvider = await updateProviderHandler(validatedData);

    return NextResponse.json(updatedProvider);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Eliminar un proveedor existente
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No autorizado para eliminar proveedores" },
        { status: 403 }
      );
    }

    // Obtener ID del proveedor de los parámetros de ruta
    const providerId = parseInt(context.params.id, 10);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { message: "ID de proveedor inválido", code: "INVALID_PROVIDER_ID" },
        { status: 400 }
      );
    }

    // Eliminar proveedor usando el servicio
    const deletedProvider = await deleteProviderHandler(providerId);

    return NextResponse.json({
      message: "Proveedor eliminado correctamente",
      provider: deletedProvider,
    });
  } catch (error) {
    return handleError(error);
  }
}
