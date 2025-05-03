import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/backend/lib/auth/auth";
import { handleError } from "@/backend/lib/api/error";
import { 
  createProductHandler, 
  getProducts, 
  searchProducts 
} from "@/backend/Service/ProductService";
import { ProductCreateSchema } from "@/types/Products";

// GET: Obtener todos los productos o buscar por término de búsqueda
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

    // Obtener parámetros de búsqueda si existen
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('q');
    
    // Si hay un término de búsqueda, realizar búsqueda
    let products;
    if (searchQuery) {
      products = await searchProducts(searchQuery);
    } else {
      // Si no hay término de búsqueda, obtener todos los productos
      products = await getProducts();
    }

    return NextResponse.json(products);
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

// POST: Crear un nuevo producto
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
        { message: "No autorizado para crear productos" },
        { status: 403 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Validar datos con Zod schema
    const validatedData = ProductCreateSchema.parse(body);
    
    // Crear producto usando el servicio
    const newProduct = await createProductHandler(validatedData);
    
    return NextResponse.json(newProduct, { status: 201 });
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
