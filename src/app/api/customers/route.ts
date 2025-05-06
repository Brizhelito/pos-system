import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getCustomers } from "@/services/CustomerService";
import { handleError } from "@/lib/api/error";
import { CustomerCreate, CustomerFilters } from "@/types/Customer";
import { z } from "zod";

// Schema para validar los filtros
const CustomerFiltersSchema = z
  .object({
    name: z.string().optional(),
    cedula: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    minTotalSales: z.number().positive().optional(),
    maxTotalSales: z.number().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "La fecha de inicio debe ser anterior a la fecha de fin",
    }
  )
  .refine(
    (data) => {
      if (data.minTotalSales && data.maxTotalSales) {
        return data.minTotalSales <= data.maxTotalSales;
      }
      return true;
    },
    {
      message:
        "El total mínimo de ventas debe ser menor o igual al total máximo",
    }
  );

// GET /api/customers - Obtener todos los clientes con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extraer filtros de los parámetros de búsqueda
    const filters: CustomerFilters = {};
    
    if (searchParams.has("name")) filters.name = searchParams.get("name") as string;
    if (searchParams.has("cedula")) filters.cedula = searchParams.get("cedula") as string;
    if (searchParams.has("email")) filters.email = searchParams.get("email") as string;
    if (searchParams.has("phone")) filters.phone = searchParams.get("phone") as string;
    
    if (searchParams.has("startDate")) {
      const startDate = new Date(searchParams.get("startDate") as string);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { error: "Fecha de inicio inválida" },
          { status: 400 }
        );
      }
      filters.startDate = startDate;
    }

    if (searchParams.has("endDate")) {
      const endDate = new Date(searchParams.get("endDate") as string);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: "Fecha de fin inválida" },
          { status: 400 }
        );
      }
      filters.endDate = endDate;
    }
    
    if (searchParams.has("minTotalSales")) {
      const minTotalSales = parseFloat(
        searchParams.get("minTotalSales") as string
      );
      if (isNaN(minTotalSales) || minTotalSales < 0) {
        return NextResponse.json(
          { error: "Total mínimo de ventas inválido" },
          { status: 400 }
        );
      }
      filters.minTotalSales = minTotalSales;
    }
    
    if (searchParams.has("maxTotalSales")) {
      const maxTotalSales = parseFloat(
        searchParams.get("maxTotalSales") as string
      );
      if (isNaN(maxTotalSales) || maxTotalSales < 0) {
        return NextResponse.json(
          { error: "Total máximo de ventas inválido" },
          { status: 400 }
        );
      }
      filters.maxTotalSales = maxTotalSales;
    }

    // Validar los filtros con Zod
    try {
      CustomerFiltersSchema.parse(filters);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors[0].message },
          { status: 400 }
        );
      }
      throw error;
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

    // Validar formato de email si se proporciona
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      );
    }

    const customerData: CustomerCreate = {
      name: body.name,
      cedula: body.cedula,
      email: body.email,
      phone: body.phone,
    };

    const newCustomer = await createCustomer(customerData);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
