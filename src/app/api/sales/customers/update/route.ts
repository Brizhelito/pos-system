import { NextResponse } from "next/server";
import { prisma } from "@/components/config/db";
import { z } from "zod";

const updateCustomerSchema = z.object({
  id: z.number().positive("ID de cliente inválido"),
  name: z.string().min(1, "El nombre es obligatorio"),
  idType: z.enum(["VENEZOLANO", "EXTRANJERO", "PASAPORTE", "JURIDICO", "OTRO"]),
  idNumber: z.string().min(1, "El número de identificación es obligatorio"),
  email: z.string().email("El email debe ser válido").optional().nullable(),
  phone: z.string().optional().nullable(),
});

/**
 * PUT /api/sales/customers/update
 * Actualiza la información de un cliente existente
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validar los datos
    const validatedData = updateCustomerSchema.parse(body);

    // Verificar si el cliente existe
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          message: "Cliente no encontrado",
        },
        { status: 404 } // Not Found
      );
    }

    // Verificar si el idNumber actualizado ya está en uso por otro cliente
    if (validatedData.idNumber !== existingCustomer.idNumber) {
      const customerWithSameId = await prisma.customer.findFirst({
        where: {
          idNumber: validatedData.idNumber,
          id: { not: validatedData.id },
        },
      });

      if (customerWithSameId) {
        return NextResponse.json(
          {
            message: "Ya existe otro cliente con este número de identificación",
          },
          { status: 409 } // Conflict
        );
      }
    }

    // Actualizar el cliente
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        idType: validatedData.idType,
        idNumber: validatedData.idNumber,
        email: validatedData.email,
        phone: validatedData.phone,
        updatedAt: new Date(), // Actualizar timestamp
      },
    });

    return NextResponse.json({
      message: "Cliente actualizado exitosamente",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);

    // Si es un error de validación, devolver errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Datos de cliente inválidos",
          errors: error.format(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
