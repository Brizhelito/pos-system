import { z } from "zod";
import {
  ProviderCreateSchema,
  ProviderCreate,
  ProviderUpdateSchema,
  ProviderUpdate,
  ProviderSchema,
} from "../types/Provider";
import { prisma } from "../components/config/db";
import { APIError } from "../lib/api/error";

/**
 * ProviderService - Maneja todas las operaciones relacionadas con proveedores
 *
 * Este servicio proporciona funcionalidades CRUD para proveedores, incluyendo:
 * - Creación de nuevos proveedores
 * - Actualización de proveedores existentes
 * - Eliminación de proveedores
 * - Consulta de proveedores y sus productos asociados
 *
 * Todas las operaciones de modificación están protegidas por transacciones
 * para garantizar la integridad de los datos.
 */
export class ProviderService {
  /**
   * Crea un nuevo proveedor
   * @param data - Datos del proveedor a crear
   * @returns El proveedor creado
   * @throws APIError si:
   * - Los datos son inválidos
   * - Ocurre un error durante la creación
   */
  async createProvider(data: ProviderCreate) {
    try {
      const validatedData = ProviderCreateSchema.parse(data);

      return await prisma.$transaction(async (tx) => {
        // Verificar si ya existe un proveedor con el mismo nombre
        const existingProvider = await tx.provider.findFirst({
          where: { name: validatedData.name },
        });

        if (existingProvider) {
          throw new APIError(
            "Ya existe un proveedor con este nombre",
            400,
            "PROVIDER_NAME_EXISTS"
          );
        }

        const now = new Date();
        const newProvider = await tx.provider.create({
          data: {
            ...validatedData,
            createdAt: now,
            updatedAt: now,
          },
        });

        return ProviderSchema.parse(newProvider);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Actualiza un proveedor existente
   * @param data - Datos del proveedor a actualizar
   * @returns El proveedor actualizado
   * @throws APIError si:
   * - El proveedor no existe
   * - Los datos son inválidos
   * - Ocurre un error durante la actualización
   */
  async updateProvider(data: ProviderUpdate) {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.verifyProviderExists(data.id);

        const validatedData = ProviderUpdateSchema.parse(data);

        const updatedProvider = await tx.provider.update({
          where: { id: validatedData.id },
          data: validatedData,
        });

        return ProviderSchema.parse(updatedProvider);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene todos los proveedores
   * @returns Lista de proveedores ordenados por nombre
   * @throws APIError si ocurre un error al obtener los proveedores
   */
  async getProviders() {
    try {
      return await prisma.provider.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      this.handleError(
        error,
        "Error al obtener los proveedores",
        "PROVIDERS_FETCH_FAILED"
      );
    }
  }

  /**
   * Obtiene un proveedor por su ID
   * @param id - ID del proveedor
   * @returns El proveedor con sus productos asociados
   * @throws APIError si:
   * - El proveedor no existe
   * - Ocurre un error al obtener el proveedor
   */
  async getProviderById(id: number) {
    try {
      const provider = await prisma.provider.findUnique({
        where: { id },
        include: {
          product: true,
        },
      });

      if (!provider) {
        throw new APIError(
          "Proveedor no encontrado",
          404,
          "PROVIDER_NOT_FOUND"
        );
      }

      return provider;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Elimina un proveedor
   * @param id - ID del proveedor a eliminar
   * @returns El proveedor eliminado
   * @throws APIError si:
   * - El proveedor no existe
   * - El proveedor tiene productos asociados
   * - Ocurre un error durante la eliminación
   */
  async deleteProvider(id: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.verifyProviderExists(id);

        // Verificar dependencias
        const productsWithProvider = await tx.product.findFirst({
          where: { providerId: id },
        });

        if (productsWithProvider) {
          throw new APIError(
            "No se puede eliminar un proveedor que tiene productos asociados",
            400,
            "PROVIDER_HAS_PRODUCTS"
          );
        }

        return await tx.provider.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Verifica si un proveedor existe
   * @param id - ID del proveedor
   * @throws APIError si el proveedor no existe
   */
  private async verifyProviderExists(id: number) {
    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) {
      throw new APIError("El proveedor no existe", 404, "PROVIDER_NOT_FOUND");
    }

    return provider;
  }

  /**
   * Maneja los errores del servicio
   * @param error - Error capturado
   * @param defaultMessage - Mensaje por defecto
   * @param defaultCode - Código de error por defecto
   */
  private handleError(
    error: unknown,
    defaultMessage = "Error en la operación del proveedor",
    defaultCode = "PROVIDER_OPERATION_FAILED"
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

const providerService = new ProviderService();

// Export individual functions
export const getProviders = () => providerService.getProviders();
export const createProviderHandler = (data: ProviderCreate) =>
  providerService.createProvider(data);
export const getProviderById = (id: number) =>
  providerService.getProviderById(id);
export const updateProviderHandler = (data: ProviderUpdate) =>
  providerService.updateProvider(data);
export const deleteProviderHandler = (id: number) =>
  providerService.deleteProvider(id);
