import { createUser } from "@/services/AuthService"; // Adjust path as needed
import { NextRequest, NextResponse } from "next/server";
import { CreateUserSchema, PublicUserSchema } from "@/types/User"; // Adjust path as needed
import { handleError } from "@/lib/api/error"; // Adjust path as needed
import z from "zod"; // Import zod for validation

// Define the expected response type for success or error
// Assuming PublicUserSchema is the success type, and error is { message: string, code: string }
type CreateUserResponse =
  | z.infer<typeof PublicUserSchema>
  | { message: string; code: string };

export async function POST(
  req: NextRequest
): Promise<NextResponse<CreateUserResponse>> {
  try {
    const body = await req.json();
    console.log("Request body received:", body);

    // --- Validation with Zod ---
    // Validate the request body using your schema
    const validatedBody = CreateUserSchema.parse(body);
    // --- End Validation ---

    // Call your service function to create the user
    // This function should throw APIErrors for known issues
    const createdUser = await createUser(validatedBody);

    // Parse the created user object using the public schema before sending
    const response = PublicUserSchema.parse(createdUser);

    // If successful, return a NextResponse with status 201
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    // --- Centralized Error Handling ---

    // Pass ANY caught error to your handleError function
    const apiErrorResponse = handleError(error);

    // Use the result from handleError to construct the NextResponse
    // This ensures a consistent error format and status code
    console.error("An error occurred, handled response:", apiErrorResponse);

    return NextResponse.json(
      {
        message: apiErrorResponse.message,
        code: apiErrorResponse.code,
        // Optionally, include other fields from apiErrorResponse if your handleError returns them
        // details: apiErrorResponse.details,
      },
      { status: apiErrorResponse.statusCode } // Use the status code from handleError
    );
  }
}

// You might want to add handlers for other HTTP methods (GET, PUT, DELETE)
// If you don't need them, you can omit them or return a 405 Method Not Allowed response
// export async function GET(req: NextRequest) { ... }
// export async function PUT(req: NextRequest) { ... }
// export async function DELETE(req: NextRequest) { ... }
