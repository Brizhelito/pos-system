import { z } from "zod";

// --- Base Schema ---
export const ProviderBaseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

// --- Create Schema ---
export const ProviderCreateSchema = ProviderBaseSchema;

// --- Update Schema ---
export const ProviderUpdateSchema = ProviderBaseSchema.partial().extend({
  id: z
    .number()
    .int()
    .positive("El ID del proveedor debe ser un número entero positivo"),
});

// --- Full Provider Schema ---
export const ProviderSchema = ProviderBaseSchema.extend({
  id: z.number().int().positive(),
});

// --- TypeScript Types ---
export type ProviderBase = z.infer<typeof ProviderBaseSchema>;
export type ProviderCreate = z.infer<typeof ProviderCreateSchema>;
export type ProviderUpdate = z.infer<typeof ProviderUpdateSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
