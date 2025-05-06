import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSessionData } from "iron-session";
// Adjust the import path for your session options
import { sessionOptions } from "@/lib/auth/auth";
// Adjust the import path for your error handler
import { handleError } from "@/lib/api/error";

// Define the expected response type for success or error
type LogoutResponse =
  | { message: string } // Success message
  | { message: string; code: string }; // Error format from handleError

// This route will handle the POST request to log out the user
export async function POST(
  req: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  try {
    // Create a new NextResponse object.
    // iron-session needs a response object to remove the Set-Cookie header.
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 } // Status 200 OK is typical for a successful logout
    );

    // Get the session. Pass the request and the response object.
    // iron-session will use the response object to clear the session cookie.
    const session = await getIronSession<IronSessionData>(
      req,
      response, // Pass the response object here
      sessionOptions
    );

    // Destroy the session. This clears the session data and prepares
    // the 'response' object to send a Set-Cookie header that expires the cookie.
    await session.destroy();

    console.log(
      "User session destroyed. Returning response with cookie cleared."
    );

    // Return the response object. It now contains the Set-Cookie header
    // with instructions to clear the session cookie in the browser.
    return response;
  } catch (error) {
    return handleError(error);
  }
}
// You might want to disallow other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}
