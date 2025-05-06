import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import { ProductService } from "@/services/ProductService";
import { ProductCreateSchema } from "@/types/Products";
import { z } from "zod";

// Instancia del servicio de productos
const productService = new ProductService();

// Schema para validar los filtros
const ProductFiltersSchema = z
  .object({
    name: z.string().optional(),
    sku: z.string().optional(),
    categoryId: z.string().optional(),
    providerId: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    minStock: z.number().int().min(0).optional(),
    maxStock: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "El precio mínimo debe ser menor o igual al precio máximo",
    }
  )
  .refine(
    (data) => {
      if (data.minStock && data.maxStock) {
        return data.minStock <= data.maxStock;
      }
      return true;
    },
    {
      message: "El stock mínimo debe ser menor o igual al stock máximo",
    }
  );

// GET: Obtener todos los productos o buscar por término de búsqueda con soporte de paginación
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
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Extraer parámetros de la URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "0"); // 0 significa todos
    const searchQuery = searchParams.get("q") || "";

    // Si hay un término de búsqueda y no hay paginación, usar la búsqueda simple
    if (searchQuery && !pageSize) {
      const products = await productService.searchProducts(searchQuery);
      return NextResponse.json(products);
    }

    // Si hay paginación
    if (pageSize > 0) {
      const result = await productService.getProductsPaginated(
        page,
        pageSize,
        searchQuery
      );
      return NextResponse.json(result);
    }

    // Caso por defecto: traer todos los productos
    const products = await productService.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return handleError(error);
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
    if (!session.user || session.user.role !== "ADMIN") {
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
    const newProduct = await productService.createProduct(validatedData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
