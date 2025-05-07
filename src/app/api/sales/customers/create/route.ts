import { NextResponse } from "next/server";
import { prisma } from "../../../../../components/config/db";
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  idType: z.enum(["VENEZOLANO", "EXTRANJERO", "PASAPORTE", "JURIDICO", "OTRO"]),
  idNumber: z.string().min(1, "El número de identificación es obligatorio"),
  email: z.string().email("El email debe ser válido").optional(),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar los datos
    const validatedData = createCustomerSchema.parse(body);

    // Verificar si el cliente ya existe
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        idType: validatedData.idType,
        idNumber: validatedData.idNumber,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          message: "Ya existe un cliente con esta identificación",
          customer: existingCustomer,
        },
        { status: 409 } // Conflict
      );
    }

    // Crear el cliente con el campo updatedAt requerido
    const now = new Date();

    const newCustomer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        idType: validatedData.idType,
        idNumber: validatedData.idNumber,
        email: validatedData.email,
        phone: validatedData.phone,
        updatedAt: now, // Campo requerido por el modelo
      },
    });

    return NextResponse.json(
      {
        message: "Cliente creado exitosamente",
        customer: newCustomer,
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error al crear cliente:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Datos inválidos",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Error al crear cliente",
      },
      { status: 500 }
    );
  }
}
