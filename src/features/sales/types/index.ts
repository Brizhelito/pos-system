// Tipos de identificación
export enum IdType {
  VENEZOLANO = "VENEZOLANO",
  EXTRANJERO = "EXTRANJERO",
  PASAPORTE = "PASAPORTE",
  JURIDICO = "JURIDICO",
  OTRO = "OTRO",
}

// Métodos de pago
export enum PaymentMethod {
  EFECTIVO = "EFECTIVO",
  PAGO_MOVIL = "PAGO_MOVIL",
  TRANSFERENCIA = "TRANSFERENCIA",
  PUNTO_DE_VENTA = "PUNTO_DE_VENTA",
}

// Interfaces para los modelos
export interface Customer {
  id: number;
  name: string;
  idType: IdType;
  idNumber: string;
  email?: string;
  phone?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sellingPrice: number;
  stock: number;
  categoryId: number;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleItem {
  id?: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: Product;
}

export interface Sale {
  id?: number;
  customerId: number;
  userId: number;
  saleDate: Date;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  items: CartItem[];
  // Relaciones
  customer?: Customer;
  saleitem?: SaleItem[];
  invoice?: Invoice;
  // Detalles adicionales (no persistentes en la base de datos)
  paymentDetails?: Record<string, string>;
}

export interface Invoice {
  id?: number;
  saleId: number;
  number: string;
  date: Date;
  invoiceStatus: "ISSUED" | "PAID" | "CANCELLED";
}

// Estado global de la venta
export interface SaleState {
  customer: Customer | null;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  total: number;
}

// API Responses
export interface CustomerSearchResponse {
  customer: Customer | null;
}

export interface ProcessSaleResponse {
  sale: Sale;
  invoice: Invoice;
}
