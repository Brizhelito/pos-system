import { z } from "zod";

// --- Base Schema ---
// Represents the core fields of a Product, excluding DB-managed fields (id, dates) and relations.
// Useful as a base for create/update schemas.
export const ProductBaseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"), // Name must be a non-empty string
  description: z.string().optional().nullable(), // Description is optional and can be null
  purchasePrice: z
    .number()
    .positive("El precio de compra debe ser un número entero positivo"), // Purchase price must be a positive integer
  sellingPrice: z
    .number()
    .positive("El precio de venta debe ser un número entero positivo"), // Selling price must be a positive integer
  stock: z.number().int().min(0, "El stock no puede ser negativo"), // Stock must be a non-negative integer
  minStock: z.number().int().min(0, "El stock mínimo no puede ser negativo"), // Minimum stock must be a non-negative integer
});

// --- Create Schema ---
// Schema for validating data when creating a new Product.
// Includes required fields from the base schema plus relation IDs.
export const ProductCreateSchema = ProductBaseSchema.extend({
  categoryId: z
    .number()
    .int()
    .positive("El ID de categoría debe ser un número entero positivo"), // categoryId is required for creation
  providerId: z
    .number()
    .int()
    .positive("El ID de proveedor debe ser un número entero positivo"), // providerId is required for creation
  // createdAt and updatedAt are typically managed by the database and not included in create input
});

// --- Update Schema ---
// Schema for validating data when updating an existing Product.
// All fields from the base schema are optional for partial updates.
// Includes the product ID as required.
export const ProductUpdateSchema = ProductBaseSchema.partial().extend({
  id: z
    .number()
    .int()
    .positive("El ID del producto debe ser un número entero positivo"), // Product ID is required for updates
  categoryId: z
    .number()
    .int()
    .positive("El ID de categoría debe ser un número entero positivo")
    .optional(), // categoryId can be updated, but is optional
  providerId: z
    .number()
    .int()
    .positive("El ID de proveedor debe ser un número entero positivo")
    .optional(), // providerId can be updated, but is optional
  // createdAt and updatedAt are managed by the database and not included in update input
});

// --- Full Product Schema ---
// Schema representing the structure of a Product object as it would typically be
// fetched from the database (including DB-managed fields and relation IDs).
export const ProductSchema = ProductBaseSchema.extend({
  id: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  providerId: z.number().int().positive(),
  createdAt: z.date(), // Dates as Date objects
  updatedAt: z.date(),
  // Incluir relaciones que son retornadas por Prisma
  category: z.object({ 
    id: z.number(),
    name: z.string(),
    // Otras propiedades de Category según sea necesario
  }).optional(),
  provider: z.object({ 
    id: z.number(),
    name: z.string(),
    // Otras propiedades de Provider según sea necesario
  }).optional(),
});

// --- TypeScript Types ---
// Export TypeScript types derived from the schemas for use in your code.
export type ProductBase = z.infer<typeof ProductBaseSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
export type Product = z.infer<typeof ProductSchema>;

// Example Usage (Backend):
/*
import { ProductCreateSchema } from './your-schemas-file'; // Adjust path

async function createProductHandler(data: any) {
  try {
    const validatedData = ProductCreateSchema.parse(data);
    // Use validatedData to create the product in the database
    // const newProduct = await prisma.product.create({ data: validatedData });
    // return newProduct;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
      // Handle validation errors (e.g., return 400 Bad Request)
    } else {
      console.error('Other error:', error);
      // Handle other errors
    }
  }
}
*/

// Example Usage (Frontend):
/*
import { Product } from './your-schemas-file'; // Adjust path

const fetchedProduct: Product = { // Assume this data comes from your API
  id: 1,
  name: "Laptop",
  description: "Powerful laptop",
  purchasePrice: 800,
  sellingPrice: 1200,
  stock: 50,
  minStock: 10,
  categoryId: 101,
  providerId: 202,
  createdAt: new Date('2023-01-01T10:00:00Z'),
  updatedAt: new Date('2023-01-15T11:30:00Z'),
  category: {
    id: 101,
    name: "Electronics"
  },
  provider: {
    id: 202,
    name: "Tech Suppliers"
  }
};

// You can use the type for type safety in your components or state
// const [productData, setProductData] = useState<Product | null>(null);
*/
