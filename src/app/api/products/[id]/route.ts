import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import {
  getProductById,
  updateProductHandler,
  deleteProductHandler,
} from "@/services/ProductService";
import { ProductUpdateSchema } from "@/types/Products";

// GET: Obtener un producto específico por ID
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

    // Obtener ID del producto de los parámetros de ruta
    const productId = parseInt(params.id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "ID de producto inválido", code: "INVALID_PRODUCT_ID" },
        { status: 400 }
      );
    }

    // Obtener el producto por ID
    const product = await getProductById(productId);
    
    return NextResponse.json(product);
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

// PUT: Actualizar un producto existente
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
        { message: "No autorizado para actualizar productos" },
        { status: 403 }
      );
    }

    // Obtener ID del producto de los parámetros de ruta
    const productId = parseInt(params.id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "ID de producto inválido", code: "INVALID_PRODUCT_ID" },
        { status: 400 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Combinar ID de ruta con los datos del cuerpo
    const updateData = {
      ...body,
      id: productId, // Asegurar que el ID coincida con la ruta
    };
    
    // Validar datos con Zod schema
    const validatedData = ProductUpdateSchema.parse(updateData);
    
    // Actualizar producto usando el servicio
    const updatedProduct = await updateProductHandler(validatedData);
    
    return NextResponse.json(updatedProduct);
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

// DELETE: Eliminar un producto existente
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
        { message: "No autorizado para eliminar productos" },
        { status: 403 }
      );
    }

    // Obtener ID del producto de los parámetros de ruta
    const productId = parseInt(params.id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "ID de producto inválido", code: "INVALID_PRODUCT_ID" },
        { status: 400 }
      );
    }

    // Eliminar producto usando el servicio
    const deletedProduct = await deleteProductHandler(productId);
    
    return NextResponse.json(
      { 
        message: "Producto eliminado correctamente",
        product: deletedProduct 
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
