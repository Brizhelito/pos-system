import { z } from "zod";

// --- Base Schema ---
export const CustomerBaseSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  cedula: z
    .string()
    .regex(/^[VE]-\d+$/, "Formato de cédula inválido. Use V-XXXXXXXX o E-XXXXXXX")
    .nullable()
    .optional(),
  email: z.string().email("Email inválido").nullable().optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Número de teléfono inválido")
    .nullable()
    .optional(),
});

// --- Create Schema ---
export const CustomerCreateSchema = CustomerBaseSchema;

// --- Update Schema ---
export const CustomerUpdateSchema = CustomerBaseSchema.extend({
  id: z.number().int().positive(),
});

// --- Full Customer Schema ---
export const CustomerSchema = CustomerBaseSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sales: z
    .array(
      z.object({
        id: z.number().int().positive(),
        totalAmount: z.number().positive(),
        saleDate: z.date(),
        status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
      })
    )
    .optional(),
});

// --- TypeScript Types ---
export type CustomerBase = z.infer<typeof CustomerBaseSchema>;
export type CustomerCreate = z.infer<typeof CustomerCreateSchema>;
export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>;
export type Customer = z.infer<typeof CustomerSchema>;

// --- Filters Schema ---
export const CustomerFiltersSchema = z.object({
  name: z.string().optional(),
  cedula: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minTotalSales: z.number().positive().optional(),
  maxTotalSales: z.number().positive().optional(),
});

export type CustomerFilters = z.infer<typeof CustomerFiltersSchema>;

// --- Customer Summary Schema ---
export const CustomerSummarySchema = z.object({
  totalCustomers: z.number().int().nonnegative(),
  customersWithMostPurchases: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
      cedula: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      sale: z.array(z.object({
        id: z.number().int().positive(),
        totalAmount: z.number().optional(),
      })),
      purchaseCount: z.number().int().nonnegative(),
    })
  ),
  topSpenders: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
      cedula: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      sale: z.array(z.object({
        id: z.number().int().positive(),
        totalAmount: z.number().optional(),
      })),
      totalSpent: z.number().nonnegative(),
    })
  ),
  recentCustomers: z.array(z.object({
    id: z.number().int().positive(),
    name: z.string(),
    cedula: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })),
  customersWithoutPurchases: z.array(z.object({
    id: z.number().int().positive(),
    name: z.string(),
    cedula: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
  })),
});

export type CustomerSummary = z.infer<typeof CustomerSummarySchema>;
