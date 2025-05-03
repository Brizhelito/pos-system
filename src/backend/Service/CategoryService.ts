import { z } from "zod";
import {
  CategoryCreateSchema,
  CategoryCreate,
  CategoryUpdateSchema,
  CategoryUpdate,
  CategorySchema,
} from "../../types/Category";
import { prisma } from "../lib/config/db";
import { APIError } from "../lib/api/error";

/**
 * Create a new category
 * @param data Category creation data
 * @returns The newly created category
 */
export async function createCategoryHandler(data: CategoryCreate) {
  try {
    // Validate the data using Zod schema
    const validatedData = CategoryCreateSchema.parse(data);
    
    // Check if a category with the same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name: validatedData.name }
    });
    
    if (existingCategory) {
      throw new APIError(
        "Ya existe una categoría con este nombre", 
        409, 
        "CATEGORY_ALREADY_EXISTS"
      );
    }
    
    // Create the category in the database
    const newCategory = await prisma.category.create({
      data: validatedData
    });
    
    // Validate the result against the full category schema
    return CategorySchema.parse(newCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      throw new APIError(
        "Datos de categoría inválidos", 
        400, 
        "INVALID_CATEGORY_DATA"
      );
    } else if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al crear categoría:", error);
      throw new APIError(
        "Error al crear la categoría", 
        500, 
        "CATEGORY_CREATION_FAILED"
      );
    }
  }
}

/**
 * Update an existing category
 * @param data Category update data including ID
 * @returns The updated category
 */
export async function updateCategoryHandler(data: CategoryUpdate) {
  try {
    // Check if the category exists before updating
    await categoryExists(data.id);
    
    // Validate the data using Zod schema
    const validatedData = CategoryUpdateSchema.parse(data);
    
    // If name is being updated, check for duplicates
    if (validatedData.name) {
      const existingCategory = await prisma.category.findFirst({
        where: { 
          name: validatedData.name,
          id: { not: validatedData.id } // Exclude the current category
        }
      });
      
      if (existingCategory) {
        throw new APIError(
          "Ya existe otra categoría con este nombre", 
          409, 
          "CATEGORY_NAME_ALREADY_EXISTS"
        );
      }
    }
    
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: validatedData.id },
      data: validatedData
    });
    
    return CategorySchema.parse(updatedCategory);
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
      console.error("Error al actualizar categoría:", error);
      throw new APIError(
        "Error al actualizar la categoría", 
        500, 
        "CATEGORY_UPDATE_FAILED"
      );
    }
  }
}

/**
 * Get all categories
 * @returns Array of categories
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    return categories;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw new APIError(
      "Error al obtener las categorías", 
      500, 
      "CATEGORIES_FETCH_FAILED"
    );
  }
}

/**
 * Get a single category by ID
 * @param id Category ID
 * @returns The category or null if not found
 */
export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        Product: true // Include related products
      }
    });
    
    if (!category) {
      throw new APIError(
        "Categoría no encontrada", 
        404, 
        "CATEGORY_NOT_FOUND"
      );
    }
    
    return category;
  } catch (error) {
    if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al obtener categoría:", error);
      throw new APIError(
        "Error al obtener la categoría", 
        500, 
        "CATEGORY_FETCH_FAILED"
      );
    }
  }
}

/**
 * Delete a category by ID
 * @param id Category ID to delete
 * @returns The deleted category
 */
export async function deleteCategoryHandler(id: number) {
  try {
    // Check if the category exists
    await categoryExists(id);
    
    // Check if category is associated with any products
    const productsWithCategory = await prisma.product.findFirst({
      where: { categoryId: id },
    });
    
    if (productsWithCategory) {
      throw new APIError(
        "No se puede eliminar una categoría que tiene productos asociados", 
        400, 
        "CATEGORY_HAS_PRODUCTS"
      );
    }
    
    // Delete the category
    const deletedCategory = await prisma.category.delete({
      where: { id }
    });
    
    return deletedCategory;
  } catch (error) {
    if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al eliminar categoría:", error);
      throw new APIError(
        "Error al eliminar la categoría", 
        500, 
        "CATEGORY_DELETE_FAILED"
      );
    }
  }
}

/**
 * Check if a category exists by ID
 * @param id Category ID to check
 * @throws APIError if the category doesn't exist
 */
async function categoryExists(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  
  if (!category) {
    throw new APIError(
      "La categoría no existe", 
      404, 
      "CATEGORY_NOT_FOUND"
    );
  }
  
  return category;
}
