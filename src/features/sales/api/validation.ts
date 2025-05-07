import { z } from "zod";
import { IdType, PaymentMethod } from "../types";

/**
 * Esquema de validación para la búsqueda de clientes por identificación
 */
export const CustomerSearchSchema = z.object({
  idType: z.nativeEnum(IdType).default(IdType.VENEZOLANO),
  idNumber: z.string().min(1, "El número de identificación es obligatorio"),
});

/**
 * Esquema de validación para la creación de clientes
 */
export const CustomerCreateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  idType: z.nativeEnum(IdType).default(IdType.VENEZOLANO),
  idNumber: z.string().min(1, "El número de identificación es obligatorio"),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
});

/**
 * Esquema de validación para la búsqueda de productos
 */
export const ProductSearchSchema = z.object({
  term: z.string().min(1, "El término de búsqueda es obligatorio"),
});

/**
 * Esquema de validación para los items de venta
 */
export const SaleItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  unitPrice: z.number().min(0, "El precio unitario debe ser mayor o igual a 0"),
  subtotal: z.number().min(0, "El subtotal debe ser mayor o igual a 0"),
});

/**
 * Esquema de validación para procesar una venta
 */
export const ProcessSaleSchema = z.object({
  customerId: z.number(),
  items: z.array(SaleItemSchema).min(1, "Debe tener al menos un producto"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  total: z.number().min(0, "El total debe ser mayor o igual a 0"),
});
