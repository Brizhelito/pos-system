import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/services/AuthService";
import { LoginRequestSchema, PublicUserSchema } from "@/types/User";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";
import { z } from "zod";

// Define el tipo de respuesta esperado
type LoginResponse =
  | { message: string; user: z.infer<typeof PublicUserSchema> }
  | { message: string; code: string };

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const validatedData = LoginRequestSchema.parse(body);

    const user = await loginUser(validatedData);
    const publicUser = PublicUserSchema.parse(user);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: publicUser,
      },
      { status: 200 }
    );

    const session = await getIronSession<IronSessionData>(
      request,
      response,
      sessionOptions
    );

    session.user = user;
    await session.save();

    return response;
  } catch (error) {
    return handleError(error);
  }
}
