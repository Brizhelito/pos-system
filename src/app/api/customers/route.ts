import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getCustomers } from "@/services/CustomerService";
import { handleError } from "@/lib/api/error";
import { CustomerCreate, CustomerFilters } from "@/types/Customer";

// GET /api/customers - Obtener todos los clientes con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extraer filtros de los parámetros de búsqueda
    const filters: CustomerFilters = {};
    
    if (searchParams.has("name")) filters.name = searchParams.get("name") as string;
    if (searchParams.has("email")) filters.email = searchParams.get("email") as string;
    if (searchParams.has("phone")) filters.phone = searchParams.get("phone") as string;
    
    if (searchParams.has("startDate")) {
      filters.startDate = new Date(searchParams.get("startDate") as string);
    }
    
    if (searchParams.has("endDate")) {
      filters.endDate = new Date(searchParams.get("endDate") as string);
    }
    
    if (searchParams.has("minTotalSales")) {
      filters.minTotalSales = parseFloat(searchParams.get("minTotalSales") as string);
    }
    
    if (searchParams.has("maxTotalSales")) {
      filters.maxTotalSales = parseFloat(searchParams.get("maxTotalSales") as string);
    }
    
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
    
    // Validar que los campos requeridos estén presentes
    if (!body.name) {
      return NextResponse.json(
        { error: "El nombre del cliente es obligatorio" },
        { status: 400 }
      );
    }
    
    const customerData: CustomerCreate = {
      name: body.name,
      email: body.email,
      phone: body.phone,
    };
    
    const newCustomer = await createCustomer(customerData);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
