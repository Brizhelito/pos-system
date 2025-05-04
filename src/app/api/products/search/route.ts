import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import { searchProducts } from "@/services/ProductService";

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

    // Obtener query de búsqueda
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { message: "Query de búsqueda requerida" },
        { status: 400 }
      );
    }

    // Buscar productos
    const products = await searchProducts(query);

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
