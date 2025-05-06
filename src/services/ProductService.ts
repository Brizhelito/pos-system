import { z } from "zod";
import {
  ProductCreateSchema,
  ProductCreate,
  ProductUpdateSchema,
  ProductUpdate,
  ProductSchema,
} from "../types/Products";
import { prisma } from "../components/config/db";
import { APIError } from "../lib/api/error";
import { Prisma } from "@prisma";

/**
 * ProductService - Maneja todas las operaciones relacionadas con productos
 *
 * Este servicio proporciona funcionalidades CRUD para productos, incluyendo:
 * - Creación de nuevos productos
 * - Actualización de productos existentes
 * - Eliminación de productos
 * - Búsqueda y consulta de productos
 *
 * Todas las operaciones de modificación están protegidas por transacciones
 * para garantizar la integridad de los datos.
 */
export class ProductService {
  /**
   * Crea un nuevo producto
   * @param data - Datos del producto a crear
   * @returns El producto creado con sus relaciones
   * @throws APIError si:
   * - Los datos son inválidos
   * - Ya existe un producto con el mismo nombre
   * - Ocurre un error durante la creación
   */
  async createProduct(data: ProductCreate) {
    try {
      const validatedData = ProductCreateSchema.parse(data);

      return await prisma.$transaction(async (tx) => {
        // Verificar duplicados
        const existingProduct = await tx.product.findFirst({
          where: { name: validatedData.name },
        });

        if (existingProduct) {
          throw new APIError(
            "Ya existe un producto con este nombre",
            409,
            "PRODUCT_ALREADY_EXISTS"
          );
        }

        // Crear el producto
        const newProduct = await tx.product.create({
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

        return ProductSchema.parse(newProduct);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Actualiza un producto existente
   * @param data - Datos del producto a actualizar
   * @returns El producto actualizado con sus relaciones
   * @throws APIError si:
   * - El producto no existe
   * - Los datos son inválidos
   * - Ya existe otro producto con el mismo nombre
   * - Ocurre un error durante la actualización
   */
  async updateProduct(data: ProductUpdate) {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.verifyProductExists(data.id);

        const validatedData = ProductUpdateSchema.parse(data);

        // Verificar duplicados si se actualiza el nombre
        if (validatedData.name) {
          const existingProduct = await tx.product.findFirst({
            where: {
              name: validatedData.name,
              id: { not: validatedData.id },
            },
          });

          if (existingProduct) {
            throw new APIError(
              "Ya existe otro producto con este nombre",
              409,
              "PRODUCT_NAME_ALREADY_EXISTS"
            );
          }
        }

        const updatedProduct = await tx.product.update({
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
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene todos los productos con sus relaciones
   * @returns Lista de productos con sus categorías y proveedores
   * @throws APIError si ocurre un error al obtener los productos
   */
  async getProducts() {
    try {
      return await prisma.product.findMany({
        include: {
          category: true,
          provider: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } catch (error) {
      this.handleError(
        error,
        "Error al obtener los productos",
        "PRODUCTS_FETCH_FAILED"
      );
    }
  }

  /**
   * Obtiene un producto por su ID
   * @param id - ID del producto
   * @returns El producto con sus relaciones
   * @throws APIError si:
   * - El producto no existe
   * - Ocurre un error al obtener el producto
   */
  async getProductById(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          provider: true,
        },
      });

      if (!product) {
        throw new APIError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
      }

      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Elimina un producto
   * @param id - ID del producto a eliminar
   * @returns El producto eliminado
   * @throws APIError si:
   * - El producto no existe
   * - El producto tiene ventas asociadas
   * - Ocurre un error durante la eliminación
   */
  async deleteProduct(id: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.verifyProductExists(id);

        // Verificar dependencias
        const salesWithProduct = await tx.saleitem.findFirst({
          where: { productId: id },
        });

        if (salesWithProduct) {
          throw new APIError(
            "No se puede eliminar un producto que ya tiene ventas asociadas",
            400,
            "PRODUCT_HAS_SALES"
          );
        }

        return await tx.product.delete({
          where: { id },
          include: {
            category: true,
            provider: true,
          },
        });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca productos por nombre o descripción
   * @param query - Término de búsqueda
   * @returns Lista de productos que coinciden con la búsqueda
   * @throws APIError si ocurre un error durante la búsqueda
   */
  async searchProducts(query: string) {
    try {
      return await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        include: {
          category: true,
          provider: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      this.handleError(
        error,
        "Error al buscar productos",
        "PRODUCT_SEARCH_FAILED"
      );
    }
  }

  /**
   * Obtiene productos por categoría
   * @param categoryId - ID de la categoría
   * @returns Lista de productos de la categoría
   * @throws APIError si ocurre un error al obtener los productos
   */
  async getProductsByCategory(categoryId: number) {
    try {
      return await prisma.product.findMany({
        where: { categoryId },
        include: {
          category: true,
          provider: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      this.handleError(
        error,
        "Error al obtener productos por categoría",
        "CATEGORY_PRODUCTS_FETCH_FAILED"
      );
    }
  }

  /**
   * Obtiene productos paginados
   * @param page - Número de página
   * @param pageSize - Tamaño de la página
   * @param search - Término de búsqueda (opcional)
   * @returns Lista de productos paginados con información de paginación
   * @throws APIError si ocurre un error durante la búsqueda
   */
  async getProductsPaginated(
    page: number,
    pageSize: number,
    search: string = ""
  ) {
    try {
      // Calcular el offset
      const skip = (page - 1) * pageSize;

      const where = search
        ? {
            OR: [
              {
                name: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                description: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                barcode: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {};

      // Consultar los productos con paginación
      const products = await prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          category: true,
          provider: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      // Contar el total de productos (para cálculos de paginación)
      const total = await prisma.product.count({ where });

      return {
        data: products,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      this.handleError(
        error,
        "Error al obtener productos paginados",
        "PRODUCTS_PAGINATED_FETCH_FAILED"
      );
    }
  }

  /**
   * Verifica si un producto existe
   * @param id - ID del producto
   * @throws APIError si el producto no existe
   */
  private async verifyProductExists(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new APIError("El producto no existe", 404, "PRODUCT_NOT_FOUND");
    }

    return product;
  }

  /**
   * Maneja los errores del servicio
   * @param error - Error capturado
   * @param defaultMessage - Mensaje por defecto
   * @param defaultCode - Código de error por defecto
   */
  private handleError(
    error: unknown,
    defaultMessage = "Error en la operación del producto",
    defaultCode = "PRODUCT_OPERATION_FAILED"
  ) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      throw new APIError("Datos inválidos", 400, "INVALID_DATA");
    } else if (error instanceof APIError) {
      throw error;
    } else {
      console.error("Error:", error);
      throw new APIError(defaultMessage, 500, defaultCode);
    }
  }
}

const productService = new ProductService();

// Export individual functions
export const getProducts = () => productService.getProducts();
export const searchProducts = (query: string) =>
  productService.searchProducts(query);
export const createProductHandler = (data: ProductCreate) =>
  productService.createProduct(data);
export const getProductById = (id: number) => productService.getProductById(id);
export const updateProductHandler = (data: ProductUpdate) =>
  productService.updateProduct(data);
export const deleteProductHandler = (id: number) =>
  productService.deleteProduct(id);
export const getProductsPaginated = (page: number, pageSize: number, search: string) =>
  productService.getProductsPaginated(page, pageSize, search);
