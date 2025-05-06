import { z } from "zod";
import {
  CategoryCreateSchema,
  CategoryCreate,
  CategoryUpdateSchema,
  CategoryUpdate,
  CategorySchema,
} from "../types/Category";
import { prisma } from "../components/config/db";
import { APIError } from "../lib/api/error";

/**
 * CategoryService - Maneja todas las operaciones relacionadas con categorías
 *
 * Este servicio proporciona funcionalidades CRUD para categorías, incluyendo:
 * - Creación de nuevas categorías
 * - Actualización de categorías existentes
 * - Eliminación de categorías
 * - Consulta de categorías y sus productos asociados
 *
 * Todas las operaciones de modificación están protegidas por transacciones
 * para garantizar la integridad de los datos.
 */
export class CategoryService {
  /**
   * Crea una nueva categoría
   * @param data - Datos de la categoría a crear
   * @returns La categoría creada
   * @throws APIError si:
   * - Los datos son inválidos
   * - Ya existe una categoría con el mismo nombre
   * - Ocurre un error durante la creación
   */
  async createCategory(data: CategoryCreate) {
    try {
      const validatedData = CategoryCreateSchema.parse(data);

      return await prisma.$transaction(async (tx) => {
        // Verificar duplicados
        const existingCategory = await tx.category.findFirst({
          where: { name: validatedData.name },
        });

        if (existingCategory) {
          throw new APIError(
            "Ya existe una categoría con este nombre",
            409,
            "CATEGORY_ALREADY_EXISTS"
          );
        }

        // Crear la categoría
        const now = new Date();
        const newCategory = await tx.category.create({
          data: {
            ...validatedData,
            createdAt: now,
            updatedAt: now,
          },
        });

        return CategorySchema.parse(newCategory);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Actualiza una categoría existente
   * @param data - Datos de la categoría a actualizar
   * @returns La categoría actualizada
   * @throws APIError si:
   * - La categoría no existe
   * - Los datos son inválidos
   * - Ya existe otra categoría con el mismo nombre
   * - Ocurre un error durante la actualización
   */
  async updateCategory(data: CategoryUpdate) {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.verifyCategoryExists(data.id);

        const validatedData = CategoryUpdateSchema.parse(data);

        // Verificar duplicados si se actualiza el nombre
        if (validatedData.name) {
          const existingCategory = await tx.category.findFirst({
            where: {
              name: validatedData.name,
              id: { not: validatedData.id },
            },
          });

          if (existingCategory) {
            throw new APIError(
              "Ya existe otra categoría con este nombre",
              409,
              "CATEGORY_NAME_ALREADY_EXISTS"
            );
          }
        }

        const updatedCategory = await tx.category.update({
          where: { id: validatedData.id },
          data: validatedData,
        });

        return CategorySchema.parse(updatedCategory);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene todas las categorías
   * @returns Lista de categorías ordenadas por nombre
   * @throws APIError si ocurre un error al obtener las categorías
   */
  async getCategories() {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      this.handleError(
        error,
        "Error al obtener las categorías",
        "CATEGORIES_FETCH_FAILED"
      );
    }
  }

  /**
   * Obtiene una categoría por su ID
   * @param id - ID de la categoría
   * @returns La categoría con sus productos asociados
   * @throws APIError si:
   * - La categoría no existe
   * - Ocurre un error al obtener la categoría
   */
  async getCategoryById(id: number) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          product: true,
        },
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
      this.handleError(error);
    }
  }

  /**
   * Elimina una categoría
   * @param id - ID de la categoría a eliminar
   * @returns La categoría eliminada
   * @throws APIError si:
   * - La categoría no existe
   * - La categoría tiene productos asociados
   * - Ocurre un error durante la eliminación
   */
  async deleteCategory(id: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.verifyCategoryExists(id);

        // Verificar dependencias
        const productsWithCategory = await tx.product.findFirst({
          where: { categoryId: id },
        });

        if (productsWithCategory) {
          throw new APIError(
            "No se puede eliminar una categoría que tiene productos asociados",
            400,
            "CATEGORY_HAS_PRODUCTS"
          );
        }

        return await tx.category.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Verifica si una categoría existe
   * @param id - ID de la categoría
   * @throws APIError si la categoría no existe
   */
  private async verifyCategoryExists(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new APIError("La categoría no existe", 404, "CATEGORY_NOT_FOUND");
    }

    return category;
  }

  /**
   * Maneja los errores del servicio
   * @param error - Error capturado
   * @param defaultMessage - Mensaje por defecto
   * @param defaultCode - Código de error por defecto
   */
  private handleError(
    error: unknown,
    defaultMessage = "Error en la operación de la categoría",
    defaultCode = "CATEGORY_OPERATION_FAILED"
  ) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      throw new APIError("Datos inválidos", 400, "INVALID_DATA");
    } else if (error instanceof APIError) {
      throw error;
    } else if (error instanceof Error) {
      console.error("Error:", error);
      throw new APIError(error.message, 500, defaultCode);
    } else {
      console.error("Error:", error);
      throw new APIError(defaultMessage, 500, defaultCode);
    }
  }
}

// Create a default instance
const categoryService = new CategoryService();

// Export individual functions
export const getCategories = () => categoryService.getCategories();
export const createCategoryHandler = (data: CategoryCreate) =>
  categoryService.createCategory(data);
export const getCategoryById = (id: number) =>
  categoryService.getCategoryById(id);
export const updateCategoryHandler = (data: CategoryUpdate) =>
  categoryService.updateCategory(data);
export const deleteCategoryHandler = (id: number) =>
  categoryService.deleteCategory(id);
