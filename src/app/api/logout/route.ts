import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
// Adjust the import path for your session options
import { sessionOptions } from "@/lib/auth/auth";
// Adjust the import path for your error handler
import { handleError } from "@/lib/api/error";

// Define el tipo de respuesta esperado
type LogoutResponse = { message: string } | { message: string; code: string };

// POST: Cerrar sesión del usuario
export async function POST(
  request: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    const session = await getIronSession<IronSessionData>(
      request,
      response,
      sessionOptions
    );

    await session.destroy();

    return response;
  } catch (error) {
    return handleError(error);
  }
}

// GET: Método no permitido
export async function GET(
  request: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  return NextResponse.json(
    { message: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}

// PUT: Método no permitido
export async function PUT(
  request: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  return NextResponse.json(
    { message: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}

// DELETE: Método no permitido
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  return NextResponse.json(
    { message: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}
