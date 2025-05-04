import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import { 
  createCategoryHandler, 
  getCategories 
} from "@/services/CategoryService";
import { CategoryCreateSchema } from "@/types/Category";

// GET: Obtener todas las categorías
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

    // Obtener todas las categorías
    const categories = await getCategories();

    return NextResponse.json(categories);
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

// POST: Crear una nueva categoría
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
        { message: "No autorizado para crear categorías" },
        { status: 403 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Validar datos con Zod schema
    const validatedData = CategoryCreateSchema.parse(body);
    
    // Crear categoría usando el servicio
    const newCategory = await createCategoryHandler(validatedData);
    
    return NextResponse.json(newCategory, { status: 201 });
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
