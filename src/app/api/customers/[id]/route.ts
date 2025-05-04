import { NextRequest, NextResponse } from "next/server";
import { getCustomerById, updateCustomer, deleteCustomer } from "@/services/CustomerService";
import { handleError } from "@/lib/api/error";
import { CustomerUpdate } from "@/types/Customer";

// GET /api/customers/[id] - Obtener un cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }
    
    const customer = await getCustomerById(id);
    return NextResponse.json(customer);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/customers/[id] - Actualizar un cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validar que haya al menos un campo para actualizar
    if (!body.name && body.email === undefined && body.phone === undefined) {
      return NextResponse.json(
        { error: "Debe proporcionar al menos un campo para actualizar" },
        { status: 400 }
      );
    }
    
    const customerData: CustomerUpdate = {};
    
    if (body.name) customerData.name = body.name;
    if (body.email !== undefined) customerData.email = body.email;
    if (body.phone !== undefined) customerData.phone = body.phone;
    
    const updatedCustomer = await updateCustomer(id, customerData);
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/customers/[id] - Eliminar un cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }
    
    const deletedCustomer = await deleteCustomer(id);
    return NextResponse.json(deletedCustomer);
  } catch (error) {
    return handleError(error);
  }
}
