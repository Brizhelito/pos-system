import { z } from "zod";

// Definición de roles como enum para mejor tipado
const roleEnum = z.enum(["ADMIN", "SELLER", "CASHIER", "USER"]);
export type role = z.infer<typeof roleEnum>;

// Definición explícita del tipo User para uso en toda la aplicación
// Basado en el modelo de Prisma
export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // En el modelo de Prisma es obligatorio
  role: role;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema Zod para el interfaz LoginRequest
// export interface LoginRequest {
//   username: string;
//   password: string;
// }
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico no puede estar vacío" }) // Mensaje corregido para email
    .email({ message: "Por favor, introduce un correo electrónico válido." }), // Añadida validación de formato email
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }), // Ejemplo de validación de longitud
});

// Esquema Zod para el interfaz PublicUser
// export interface PublicUser {
//   name: string;
//   email: string;
//   updatedAt: Date;
//   role: $Enums.role;
//   createAt: Date; // Nota: parece que hay un error tipográfico, debería ser createdAt
// }
export const PublicUserSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío" }),
  email: z
    .string()
    .email({ message: "Formato de correo electrónico inválido" }),
  updatedAt: z.date(),
  role: roleEnum, // Usamos el enum Zod definido anteriormente
  createdAt: z.date(), // Corregido el nombre de la propiedad según la posible intención
});

// Esquema Zod para el interfaz CreateUser
// export interface CreateUser {
//   name: string;
//   email: string;
//   updatedAt: Date;
//   password: string; // Esta es OBLIGATORIA en CreateUser
//   createAt: Date; // Nota: parece que hay un error tipográfico, debería ser createdAt
// }
export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío" }),
  email: z
    .string()
    .email({ message: "Formato de correo electrónico inválido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }), // Password es REQUERIDO aquí
  // createdAt y updatedAt se añadirán en el backend después de la validación
});
// Tu UserSchema existente (incluido para referencia y comparación)
// Este esquema parece ser para un usuario COMPLETO que ya existe en la base de datos,
// ya que incluye 'id' y 'role', y 'password' es opcional (quizás para operaciones de actualización).
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255).optional(), // La contraseña es opcional en este esquema
  role: z.string().min(1).max(20), // El rol es obligatorio en este esquema
  // Nota: Este esquema no incluye updatedAt ni createdAt, a diferencia de tus interfaces.
  // Si UserSchema debe coincidir con PublicUser o incluir esas fechas, deberías añadirlas aquí.
  // updatedAt: z.date(),
  // createdAt: z.date(),
});

// Exportando los tipos inferidos de los esquemas Zod
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
// El tipo User ya está definido como interface anteriormente
export type Role = z.infer<typeof roleEnum>; // Exportando el tipo del enum de roles
