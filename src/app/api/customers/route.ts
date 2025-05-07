import { NextRequest, NextResponse } from "next/server";
import {
  createCustomer,
  getCustomers,
  parseCustomerFilters,
  validateCustomerData,
} from "@/services/CustomerService";
import { handleError } from "@/lib/api/error";
import { CustomerCreate } from "@/types/Customer";

// GET /api/customers - Obtener todos los clientes con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Utilizar el servicio para parsear y validar los filtros
    const { filters, validationResult } = parseCustomerFilters(searchParams);

    // Verificar si hay errores de validación
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Obtener clientes con los filtros validados
    const customers = await getCustomers(filters);
    return NextResponse.json(customers);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/customers - Crear un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos del cliente usando el servicio
    const validationResult = validateCustomerData(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Datos validados
    const customerData: CustomerCreate = validationResult.data;

    // Crear el cliente usando el servicio
    const newCustomer = await createCustomer(customerData);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
