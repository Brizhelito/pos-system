import { z } from "zod";
import {
  ProductCreateSchema,
  ProductCreate,
  ProductUpdateSchema,
  ProductUpdate,
  ProductSchema,
} from "../../types/Products";
import { prisma } from "../lib/config/db";
import { APIError } from "../lib/api/error";

/**
 * Create a new product
 * @param data Product creation data
 * @returns The newly created product
 */
export async function createProductHandler(data: ProductCreate) {
  try {
    // Validate the data using Zod schema
    const validatedData = ProductCreateSchema.parse(data);
    
    // Check if a product with the same name already exists
    const existingProduct = await prisma.product.findFirst({
      where: { name: validatedData.name }
    });
    
    if (existingProduct) {
      throw new APIError(
        "Ya existe un producto con este nombre", 
        409, 
        "PRODUCT_ALREADY_EXISTS"
      );
    }
    
    // Use validatedData to create the product in the database
    const newProduct = await prisma.product.create({
      data: {
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        category: true,
        provider: true,
      },
    });
    
    // Validate the result against the full product schema
    return ProductSchema.parse(newProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      throw new APIError(
        "Datos de producto inválidos", 
        400, 
        "INVALID_PRODUCT_DATA"
      );
    } else if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al crear producto:", error);
      throw new APIError(
        "Error al crear el producto", 
        500, 
        "PRODUCT_CREATION_FAILED"
      );
    }
  }
}

/**
 * Update an existing product
 * @param data Product update data including ID
 * @returns The updated product
 */
export async function updateProductHandler(data: ProductUpdate) {
  try {
    // Check if the product exists before updating
    await productExist(data.id);
    
    // Validate the data using Zod schema
    const validatedData = ProductUpdateSchema.parse(data);
    
    // If name is being updated, check for duplicates
    if (validatedData.name) {
      const existingProduct = await prisma.product.findFirst({
        where: { 
          name: validatedData.name,
          id: { not: validatedData.id } // Exclude the current product
        }
      });
      
      if (existingProduct) {
        throw new APIError(
          "Ya existe otro producto con este nombre", 
          409, 
          "PRODUCT_NAME_ALREADY_EXISTS"
        );
      }
    }
    
    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: validatedData.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        category: true,
        provider: true,
      },
    });
    
    return ProductSchema.parse(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      throw new APIError(
        "Datos de actualización inválidos", 
        400, 
        "INVALID_UPDATE_DATA"
      );
    } else if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al actualizar producto:", error);
      throw new APIError(
        "Error al actualizar el producto", 
        500, 
        "PRODUCT_UPDATE_FAILED"
      );
    }
  }
}

/**
 * Get all products with relations
 * @returns Array of products with category and provider data
 */
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        provider: true,
      },
      orderBy: {
        updatedAt: 'desc' // Latest products first
      }
    });
    
    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new APIError(
      "Error al obtener los productos", 
      500, 
      "PRODUCTS_FETCH_FAILED"
    );
  }
}

/**
 * Get a single product by ID
 * @param id Product ID
 * @returns The product with relations or null if not found
 */
export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        provider: true,
      },
    });
    
    if (!product) {
      throw new APIError(
        "Producto no encontrado", 
        404, 
        "PRODUCT_NOT_FOUND"
      );
    }
    
    return product;
  } catch (error) {
    if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al obtener producto:", error);
      throw new APIError(
        "Error al obtener el producto", 
        500, 
        "PRODUCT_FETCH_FAILED"
      );
    }
  }
}

/**
 * Delete a product by ID
 * @param id Product ID to delete
 * @returns The deleted product
 */
export async function deleteProductHandler(id: number) {
  try {
    // Check if the product exists
    await productExist(id);
    
    // Check if product is associated with any sales
    const salesWithProduct = await prisma.saleItem.findFirst({
      where: { productId: id },
    });
    
    if (salesWithProduct) {
      throw new APIError(
        "No se puede eliminar un producto que ya tiene ventas asociadas", 
        400, 
        "PRODUCT_HAS_SALES"
      );
    }
    
    // Delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id },
      include: {
        category: true,
        provider: true,
      },
    });
    
    return deletedProduct;
  } catch (error) {
    if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al eliminar producto:", error);
      throw new APIError(
        "Error al eliminar el producto", 
        500, 
        "PRODUCT_DELETE_FAILED"
      );
    }
  }
}

/**
 * Search products by name or description
 * @param query Search query string
 * @returns Array of matching products
 */
export async function searchProducts(query: string) {
  try {
    const searchTerm = query.trim();
    
    if (!searchTerm) {
      return await getProducts();
    }
    
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      include: {
        category: true,
        provider: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return products;
  } catch (error) {
    console.error("Error al buscar productos:", error);
    throw new APIError(
      "Error al buscar productos", 
      500, 
      "PRODUCT_SEARCH_FAILED"
    );
  }
}

/**
 * Filter products by category
 * @param categoryId Category ID to filter by
 * @returns Array of products in the specified category
 */
export async function getProductsByCategory(categoryId: number) {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        provider: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return products;
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    throw new APIError(
      "Error al obtener productos por categoría", 
      500, 
      "CATEGORY_PRODUCTS_FETCH_FAILED"
    );
  }
}

/**
 * Check if a product exists by ID
 * @param id Product ID to check
 * @throws APIError if the product doesn't exist
 */
async function productExist(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (!product) {
    throw new APIError(
      "El producto no existe", 
      404, 
      "PRODUCT_NOT_FOUND"
    );
  }
  
  return product;
}
