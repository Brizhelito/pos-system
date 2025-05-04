import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import {
  createProviderHandler,
  getProviders,
} from "@/services/ProviderService";
import { ProviderCreateSchema } from "@/types/Provider";

// GET: Obtener todos los proveedores
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      req,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado
    if (!session.user) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener todos los proveedores
    const providers = await getProviders();

    return NextResponse.json(providers);
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

// POST: Crear un nuevo proveedor
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      req,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "No autorizado para crear proveedores" },
        { status: 403 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Validar datos con Zod schema
    const validatedData = ProviderCreateSchema.parse(body);
    
    // Crear proveedor usando el servicio
    const newProvider = await createProviderHandler(validatedData);
    
    return NextResponse.json(newProvider, { status: 201 });
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
