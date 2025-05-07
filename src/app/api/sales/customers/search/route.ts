import { NextResponse } from "next/server";
import { CustomerSearchSchema } from "@/features/sales/api/validation";
import { IdType } from "@/features/sales/types";
import { prisma } from "@/components/config/db";
/**
 * POST /api/sales/customers/search
 * Busca un cliente por su tipo y número de identificación
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const result = CustomerSearchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Datos de búsqueda inválidos",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    const { idNumber } = result.data;
    // idType se validará pero no se usará hasta completar la migración

    // Buscar cliente - adaptado a la estructura actual de la base de datos
    const customer = await prisma.customer.findFirst({
      where: {
        idNumber: idNumber,
      },
    });

    if (!customer) {
      return NextResponse.json({ customer: null });
    }

    // Mapear cliente de la base de datos al formato de la aplicación
    const mappedCustomer = {
      id: customer.id,
      name: customer.name,
      idType: IdType.VENEZOLANO, // Valor predeterminado hasta que la migración se complete
      idNumber: customer.idNumber || "",
      email: customer.email || undefined,
      phone: customer.phone || undefined,
    };

    return NextResponse.json({ customer: mappedCustomer });
  } catch (error) {
    console.error("Error al buscar cliente:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
