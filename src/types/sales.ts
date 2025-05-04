import { z } from "zod";

// Define enums for sale status and payment method
export const saleStatusEnum = z.enum(["PENDING", "COMPLETED", "CANCELLED"]);
export const paymentMethodEnum = z.enum(["CASH", "CARD", "TRANSFER", "OTHER"]);

export type SaleStatus = z.infer<typeof saleStatusEnum>;
export type PaymentMethod = z.infer<typeof paymentMethodEnum>;

// Define schemas
export const SaleItemSchema = z.object({
  id: z.number().int().positive().optional(),
  saleId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  subtotal: z.number().positive(),
});

export const SaleSchema = z.object({
  id: z.number().int().positive().optional(),
  saleDate: z.date(),
  customerId: z.number().int().positive(),
  userId: z.number().int().positive(),
  totalAmount: z.number().positive(),
  paymentMethod: paymentMethodEnum,
  status: saleStatusEnum,
  saleItems: z.array(SaleItemSchema),
});

export const SaleFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  saleStatus: saleStatusEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  customerId: z.number().int().positive().optional(),
  userId: z.number().int().positive().optional(),
});

export const SaleSummarySchema = z.object({
  totalSales: z.number().int().positive(),
  totalAmount: z.number().positive(),
  averageSale: z.number().positive(),
  mostSoldProducts: z.array(
    z.object({
      productId: z.number().int().positive(),
      productName: z.string(),
      quantity: z.number().int().positive().nullable(),
    })
  ),
});

// Export types
export type Sale = z.infer<typeof SaleSchema>;
export type SaleItem = z.infer<typeof SaleItemSchema>;
export type SaleFilters = z.infer<typeof SaleFiltersSchema>;
export type SaleSummary = z.infer<typeof SaleSummarySchema>;

// Export create/update DTOs
export const CreateSaleItemDto = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const CreateSaleDto = z.object({
  customerId: z.number().int().positive(),
  userId: z.number().int().positive(),
  items: z.array(CreateSaleItemDto).min(1),
  paymentMethod: paymentMethodEnum,
});

export type CreateSaleDto = z.infer<typeof CreateSaleDto>;
export type CreateSaleItemDto = z.infer<typeof CreateSaleItemDto>;
