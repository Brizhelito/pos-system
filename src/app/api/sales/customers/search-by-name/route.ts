import { NextResponse } from "next/server";
import { prisma } from "@/components/config/db";
import { z } from "zod";
import { IdType } from "@/features/sales/types";

// Esquema de validación para la búsqueda por nombre
const searchByNameSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

/**
 * GET /api/sales/customers/search-by-name?name=searchTerm
 * Busca clientes por nombre (búsqueda parcial)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";

    // Validar el término de búsqueda
    const result = searchByNameSchema.safeParse({ name });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Término de búsqueda inválido",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    // Buscar clientes que coincidan con el nombre
    const customers = await prisma.customer.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: 10, // Limitar resultados
    });

    // Mapear clientes al formato esperado por el cliente
    const mappedCustomers = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      idType: customer.idType ? customer.idType : IdType.VENEZOLANO,
      idNumber: customer.idNumber || "",
      email: customer.email || undefined,
      phone: customer.phone || undefined,
    }));

    return NextResponse.json({ customers: mappedCustomers });
  } catch (error) {
    console.error("Error al buscar clientes por nombre:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
