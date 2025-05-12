import { APIError } from "../lib/api/error";
import { prisma } from "../components/config/db";
import {
  CreateUserSchema,
  PublicUserSchema,
  LoginRequestSchema,
} from "@/types/User";
import z from "zod";
import bcrypt from "bcrypt";
import { AUTH_CONFIG } from "@/lib/config/env";

type CreateUser = z.infer<typeof CreateUserSchema>;
type LoginRequest = z.infer<typeof LoginRequestSchema>;
/**
 * Creates a new user in the system.
 *
 * This function performs the following steps:
 * 1. Checks if the provided email is already in use.
 * 2. Hashes the user's password with a pepper for added security.
 * 3. Prepares the user data for creation, including timestamps.
 * 4. Executes a database transaction to create the user.
 * 5. Parses the created user object using the public schema to validate
 *    the structure and omit sensitive fields like the password.
 *
 * @param createUserData - The data required to create a new user, including
 *                         email, password, and other user details.
 * @throws {APIError} If the email is already registered.
 * @throws {Error} If an error occurs during the database transaction.
 * @returns The created user object, validated and sanitized using the public schema.
 */
export const createUser = async (createUserData: CreateUser) => {
  // Check if email is already in use
  if (await isEmailUsed(createUserData.email)) {
    throw new APIError(
      "Correo ya está en uso",
      409,
      "EMAIL_ALREADY_REGISTERED"
    );
  }

  // Hash the password with pepper
  const pepper = AUTH_CONFIG.bcryptPepper;
  const hashedPassword = await bcrypt.hash(
    createUserData.password + pepper,
    10 // Number of salt rounds
  );

  // Prepare the user data for creation
  const creatingUser = {
    ...createUserData,
    password: hashedPassword, // Use the hashed password
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Execute the transaction
  try {
    const createdUser = await prisma.$transaction(async (tx) => {
      // Create the user within the transaction
      const newUser = await tx.user.create({
        data: creatingUser,
      });
      // The callback implicitly returns the result of the last operation,
      // which is the created user object. Explicitly returning it is also fine.
      return newUser;
    });

    // Parse the created user object using the public schema
    // This will validate the structure and potentially omit sensitive fields like password
    const response = PublicUserSchema.parse(createdUser);

    return response;
  } catch (error) {
    // Re-throw the error or handle it appropriately
    throw error;
  }
};

/**
 * Checks if an email is already used by an existing user in the database.
 *
 * @param email - The email address to check.
 * @returns A promise that resolves to `true` if a user with the given email exists, or `false` otherwise.
 */
export const isEmailUsed = async (email: string): Promise<boolean> => {
  // Assuming your User schema has an 'email' field
  const user = await prisma.user.findFirst({
    where: { email },
  });
  // Return true if a user with that email exists, false otherwise
  return !!user;
};
/**
 * Authenticates a user by verifying their email and password.
 *
 * @param loginRequest - The login request containing the user's email and password.
 * @throws {APIError} If the email is not associated with any user (status code: 409).
 * @throws {APIError} If the user is not found in the database (status code: 404).
 * @throws {APIError} If the user's password is not set (status code: 400).
 * @throws {APIError} If the provided password is incorrect (status code: 401).
 * @returns The authenticated user object.
 */
export const loginUser = async (loginRequest: LoginRequest) => {
  if (!(await isEmailUsed(loginRequest.email))) {
    throw new APIError("No hay usuario con ese email", 409, "NO_USER_EMAIL");
  }
  const user = await prisma.user.findUnique({
    where: { email: loginRequest.email },
  });
  if (!user) {
    throw new APIError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }
  if (!user.password) {
    throw new APIError("Contraseña no establecida", 400, "PASSWORD_NOT_SET");
  }

  const pepper = AUTH_CONFIG.bcryptPepper;
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password + pepper,
    user.password
  );
  if (!isPasswordValid) {
    throw new APIError("Contraseña incorrecta", 401, "INVALID_PASSWORD");
  }
  return user;
};
