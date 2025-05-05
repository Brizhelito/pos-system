import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/services/AuthService";
import { LoginRequestSchema } from "@/types/User";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { handleError } from "@/lib/api/error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validateData = LoginRequestSchema.parse(body);
    console.log("Validating data:", validateData);
    const user = await loginUser(validateData);
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    const session = await getIronSession<IronSessionData>(
      req,
      response,
      sessionOptions
    );
    console.log(response);
    session.user = user;
    await session.save();
    return response;
  } catch (error) {
    return handleError(error);

  }
}
