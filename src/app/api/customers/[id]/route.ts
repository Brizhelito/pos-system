import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import {
  getCustomerById,
  updateCustomerHandler,
  deleteCustomerHandler,
} from "@/services/CustomerService";
import { CustomerUpdateSchema } from "@/types/Customer";

// GET: Obtener un cliente específico por ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado
    if (!session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Obtener ID del cliente de los parámetros de ruta
    const customerId = parseInt(context.params.id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { message: "ID de cliente inválido", code: "INVALID_CUSTOMER_ID" },
        { status: 400 }
      );
    }

    // Obtener el cliente por ID
    const customer = await getCustomerById(customerId);

    return NextResponse.json(customer);
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Actualizar un cliente existente
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No autorizado para actualizar clientes" },
        { status: 403 }
      );
    }

    // Obtener ID del cliente de los parámetros de ruta
    const customerId = parseInt(context.params.id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { message: "ID de cliente inválido", code: "INVALID_CUSTOMER_ID" },
        { status: 400 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();

    // Combinar ID de ruta con los datos del cuerpo
    const updateData = {
      ...body,
      id: customerId, // Asegurar que el ID coincida con la ruta
    };

    // Validar datos con Zod schema
    const validatedData = CustomerUpdateSchema.parse(updateData);

    // Actualizar cliente usando el servicio
    const updatedCustomer = await updateCustomerHandler(validatedData);

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Eliminar un cliente existente
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );

    // Verificar que el usuario esté autenticado y tenga permisos de administrador
    if (!session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No autorizado para eliminar clientes" },
        { status: 403 }
      );
    }

    // Obtener ID del cliente de los parámetros de ruta
    const customerId = parseInt(context.params.id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { message: "ID de cliente inválido", code: "INVALID_CUSTOMER_ID" },
        { status: 400 }
      );
    }

    // Eliminar cliente usando el servicio
    const deletedCustomer = await deleteCustomerHandler(customerId);

    return NextResponse.json({
      message: "Cliente eliminado correctamente",
      customer: deletedCustomer,
    });
  } catch (error) {
    return handleError(error);
  }
}
