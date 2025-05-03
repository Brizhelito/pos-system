import { z } from "zod";

// --- Base Schema ---
export const CategoryBaseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

// --- Create Schema ---
export const CategoryCreateSchema = CategoryBaseSchema;

// --- Update Schema ---
export const CategoryUpdateSchema = CategoryBaseSchema.partial().extend({
  id: z
    .number()
    .int()
    .positive("El ID de la categoría debe ser un número entero positivo"),
});

// --- Full Category Schema ---
export const CategorySchema = CategoryBaseSchema.extend({
  id: z.number().int().positive(),
});

// --- TypeScript Types ---
export type CategoryBase = z.infer<typeof CategoryBaseSchema>;
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;
export type Category = z.infer<typeof CategorySchema>;
