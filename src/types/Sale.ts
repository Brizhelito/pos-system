import { z } from "zod";
import { $Enums } from "../../lib/prisma-client";

// --- Sale Item Schema ---
export const SaleItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  subtotal: z.number().positive(),
});

// --- Base Schema ---
export const SaleBaseSchema = z
  .object({
    customerId: z.number().int().positive(),
    paymentMethod: z.nativeEnum($Enums.sale_paymentMethod),
    items: z.array(SaleItemSchema),
  })
  .extend({
    userId: z.number().int().positive(),
  });

// --- Create Schema ---
export const SaleCreateSchema = SaleBaseSchema;

// --- Update Schema ---
export const SaleUpdateSchema = SaleBaseSchema.partial();

// --- Full Sale Schema ---
export const SaleSchema = SaleBaseSchema.extend({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  saleDate: z.date(),
  status: z.nativeEnum($Enums.sale_status),
});

// --- TypeScript Types ---
export type SaleItem = z.infer<typeof SaleItemSchema>;
export type SaleBase = z.infer<typeof SaleBaseSchema>;
export type SaleCreate = z.infer<typeof SaleCreateSchema> & { userId: number };
export type SaleUpdate = z.infer<typeof SaleUpdateSchema>;
export type Sale = z.infer<typeof SaleSchema>;
