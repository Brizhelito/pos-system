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
    return handleError(error);
  }
}