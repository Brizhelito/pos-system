import { createUser } from "@/services/AuthService"; // Adjust path as needed
import { NextRequest, NextResponse } from "next/server";
import { CreateUserSchema, PublicUserSchema } from "@/types/User"; // Adjust path as needed
import { handleError } from "@/lib/api/error"; // Adjust path as needed
import { z } from "zod"; // Import zod for validation

// Define el tipo de respuesta esperado
type CreateUserResponse =
  | z.infer<typeof PublicUserSchema>
  | { message: string; code: string };

// POST: Crear un nuevo usuario administrador
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateUserResponse>> {
  try {
    const body = await request.json();
    console.log("Request body received:", body);

    // Validar los datos con Zod
    const validatedData = CreateUserSchema.parse(body);

    // Crear el usuario usando el servicio
    const createdUser = await createUser(validatedData);

    // Validar la respuesta con el schema público
    const response = PublicUserSchema.parse(createdUser);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}