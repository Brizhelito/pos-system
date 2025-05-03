import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/backend/lib/auth/auth";
import { handleError } from "@/backend/lib/api/error";
import { 
  getCategoryById, 
  updateCategoryHandler, 
  deleteCategoryHandler 
} from "@/backend/Service/CategoryService";
import { CategoryUpdateSchema } from "@/types/Category";

// GET: Obtener una categoría específica por ID
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

    // Verificar que el usuario esté autenticado
    if (!session.user) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener ID de la categoría de los parámetros de ruta
    const categoryId = parseInt(params.id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "ID de categoría inválido", code: "INVALID_CATEGORY_ID" },
        { status: 400 }
      );
    }

    // Obtener la categoría por ID
    const category = await getCategoryById(categoryId);
    
    return NextResponse.json(category);
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

// PUT: Actualizar una categoría existente
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

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "No autorizado para actualizar categorías" },
        { status: 403 }
      );
    }

    // Obtener ID de la categoría de los parámetros de ruta
    const categoryId = parseInt(params.id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "ID de categoría inválido", code: "INVALID_CATEGORY_ID" },
        { status: 400 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Combinar ID de ruta con los datos del cuerpo
    const updateData = {
      ...body,
      id: categoryId, // Asegurar que el ID coincida con la ruta
    };
    
    // Validar datos con Zod schema
    const validatedData = CategoryUpdateSchema.parse(updateData);
    
    // Actualizar categoría usando el servicio
    const updatedCategory = await updateCategoryHandler(validatedData);
    
    return NextResponse.json(updatedCategory);
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

// DELETE: Eliminar una categoría existente
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

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "No autorizado para eliminar categorías" },
        { status: 403 }
      );
    }

    // Obtener ID de la categoría de los parámetros de ruta
    const categoryId = parseInt(params.id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "ID de categoría inválido", code: "INVALID_CATEGORY_ID" },
        { status: 400 }
      );
    }

    // Eliminar categoría usando el servicio
    const deletedCategory = await deleteCategoryHandler(categoryId);
    
    return NextResponse.json(
      { 
        message: "Categoría eliminada correctamente",
        category: deletedCategory 
      }
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
