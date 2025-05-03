import { z } from "zod";
import {
  ProviderCreateSchema,
  ProviderCreate,
  ProviderUpdateSchema,
  ProviderUpdate,
  ProviderSchema,
} from "../../types/Provider";
import { prisma } from "../lib/config/db";
import { APIError } from "../lib/api/error";

/**
 * Create a new provider
 * @param data Provider creation data
 * @returns The newly created provider
 */
export async function createProviderHandler(data: ProviderCreate) {
  try {
    // Validate the data using Zod schema
    const validatedData = ProviderCreateSchema.parse(data);
    
    // Create the provider in the database
    const newProvider = await prisma.provider.create({
      data: validatedData
    });
    
    // Validate the result against the full provider schema
    return ProviderSchema.parse(newProvider);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      throw new APIError(
        "Datos de proveedor inválidos", 
        400, 
        "INVALID_PROVIDER_DATA"
      );
    } else if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al crear proveedor:", error);
      throw new APIError(
        "Error al crear el proveedor", 
        500, 
        "PROVIDER_CREATION_FAILED"
      );
    }
  }
}

/**
 * Update an existing provider
 * @param data Provider update data including ID
 * @returns The updated provider
 */
export async function updateProviderHandler(data: ProviderUpdate) {
  try {
    // Check if the provider exists before updating
    await providerExists(data.id);
    
    // Validate the data using Zod schema
    const validatedData = ProviderUpdateSchema.parse(data);
    
    // Update the provider
    const updatedProvider = await prisma.provider.update({
      where: { id: validatedData.id },
      data: validatedData
    });
    
    return ProviderSchema.parse(updatedProvider);
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
      console.error("Error al actualizar proveedor:", error);
      throw new APIError(
        "Error al actualizar el proveedor", 
        500, 
        "PROVIDER_UPDATE_FAILED"
      );
    }
  }
}

/**
 * Get all providers
 * @returns Array of providers
 */
export async function getProviders() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { name: 'asc' }
    });
    
    return providers;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw new APIError(
      "Error al obtener los proveedores", 
      500, 
      "PROVIDERS_FETCH_FAILED"
    );
  }
}

/**
 * Get a single provider by ID
 * @param id Provider ID
 * @returns The provider or null if not found
 */
export async function getProviderById(id: number) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        Product: true // Include related products
      }
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
    if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al obtener proveedor:", error);
      throw new APIError(
        "Error al obtener el proveedor", 
        500, 
        "PROVIDER_FETCH_FAILED"
      );
    }
  }
}

/**
 * Delete a provider by ID
 * @param id Provider ID to delete
 * @returns The deleted provider
 */
export async function deleteProviderHandler(id: number) {
  try {
    // Check if the provider exists
    await providerExists(id);
    
    // Check if provider is associated with any products
    const productsWithProvider = await prisma.product.findFirst({
      where: { providerId: id },
    });
    
    if (productsWithProvider) {
      throw new APIError(
        "No se puede eliminar un proveedor que tiene productos asociados", 
        400, 
        "PROVIDER_HAS_PRODUCTS"
      );
    }
    
    // Delete the provider
    const deletedProvider = await prisma.provider.delete({
      where: { id }
    });
    
    return deletedProvider;
  } catch (error) {
    if (error instanceof APIError) {
      throw error; // Re-throw API errors
    } else {
      console.error("Error al eliminar proveedor:", error);
      throw new APIError(
        "Error al eliminar el proveedor", 
        500, 
        "PROVIDER_DELETE_FAILED"
      );
    }
  }
}

/**
 * Check if a provider exists by ID
 * @param id Provider ID to check
 * @throws APIError if the provider doesn't exist
 */
async function providerExists(id: number) {
  const provider = await prisma.provider.findUnique({
    where: { id },
  });
  
  if (!provider) {
    throw new APIError(
      "El proveedor no existe", 
      404, 
      "PROVIDER_NOT_FOUND"
    );
  }
  
  return provider;
}
