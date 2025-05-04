import { z } from "zod";
import {
  SaleCreateSchema,
  SaleCreate,
  SaleUpdateSchema,
  SaleUpdate,
} from "../types/Sale";
import { prisma } from "../components/config/db";
import { APIError } from "../lib/api/error";
import { $Enums } from "@prisma";

/**
 * SaleService - Maneja todas las operaciones relacionadas con ventas
 *
 * Este servicio proporciona funcionalidades CRUD para ventas, incluyendo:
 * - Creación de nuevas ventas
 * - Actualización de ventas existentes
 * - Eliminación de ventas
 * - Consulta de ventas y sus detalles
 *
 * Todas las operaciones de modificación están protegidas por transacciones
 * para garantizar la integridad de los datos.
 */
export class SaleService {
  /**
   * Crea una nueva venta
   * @param data - Datos de la venta a crear
   * @returns La venta creada con sus detalles
   * @throws APIError si:
   * - Los datos son inválidos
   * - Ocurre un error durante la creación
   */
  async createSale(data: SaleCreate) {
    try {
      // Validar datos con Zod schema
      const validatedData = SaleCreateSchema.parse(data) as SaleCreate;

      // Verificar que el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId },
      });

      if (!user) {
        throw new APIError("Usuario no encontrado", 404, "USER_NOT_FOUND");
      }

      // Verificar que el cliente existe
      const customer = await prisma.customer.findUnique({
        where: { id: validatedData.customerId },
      });

      if (!customer) {
        throw new APIError("Cliente no encontrado", 404, "CUSTOMER_NOT_FOUND");
      }

      // Verificar que todos los productos existen y tienen suficiente stock
      const productIds = validatedData.items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new APIError(
          "Uno o más productos no existen",
          404,
          "PRODUCT_NOT_FOUND"
        );
      }

      // Verificar stock y calcular total
      let totalAmount = 0;
      for (const item of validatedData.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;

        if (product.stock < item.quantity) {
          throw new APIError(
            `Stock insuficiente para el producto ${product.name}`,
            400,
            "INSUFFICIENT_STOCK"
          );
        }

        totalAmount += item.subtotal;
      }

      // Crear venta con sus items en una transacción
      const newSale = await prisma.$transaction(async (tx) => {
        // Crear la venta
        const sale = await tx.sale.create({
          data: {
            customerId: validatedData.customerId,
            userId: validatedData.userId,
            paymentMethod: validatedData.paymentMethod,
            status: "PENDING" as const,
            saleDate: new Date(),
            totalAmount,
          },
        });

        // Crear los items de la venta
        const saleItems = await Promise.all(
          validatedData.items.map((item) =>
            tx.saleItem.create({
              data: {
                saleId: sale.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal,
              },
            })
          )
        );

        // Actualizar el stock de los productos
        await Promise.all(
          validatedData.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        return {
          ...sale,
          saleItems,
        };
      });

      return newSale;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene todas las ventas
   * @returns Lista de ventas ordenadas por fecha
   * @throws APIError si ocurre un error al obtener las ventas
   */
  async getSales() {
    try {
      const sales = await prisma.sale.findMany({
        include: {
          saleItems: true,
          customer: true,
          user: true,
        },
        orderBy: {
          saleDate: "desc",
        },
      });

      return sales;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtiene una venta por su ID
   * @param id - ID de la venta
   * @returns La venta con sus detalles
   * @throws APIError si:
   * - La venta no existe
   * - Ocurre un error al obtener la venta
   */
  async getSaleById(id: number) {
    try {
      const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
          saleItems: true,
          customer: true,
          user: true,
        },
      });

      if (!sale) {
        throw new APIError("Venta no encontrada", 404, "SALE_NOT_FOUND");
      }

      return sale;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Actualiza una venta existente
   * @param data - Datos de la venta a actualizar
   * @returns La venta actualizada con sus detalles
   * @throws APIError si:
   * - Los datos son inválidos
   * - Ocurre un error al actualizar la venta
   */
  async updateSale(data: SaleUpdate & { id: number }) {
    try {
      // Validar datos con Zod schema
      const validatedData = SaleUpdateSchema.parse(data) as SaleUpdate & {
        id: number;
      };

      // Verificar que la venta existe
      const existingSale = await prisma.sale.findUnique({
        where: { id: data.id },
        include: { saleItems: true },
      });

      if (!existingSale) {
        throw new APIError("Venta no encontrada", 404, "SALE_NOT_FOUND");
      }

      // Verificar que la venta no esté completada o cancelada
      if (existingSale.status !== $Enums.SaleStatus.PENDING) {
        throw new APIError(
          "No se puede actualizar una venta completada o cancelada",
          400,
          "SALE_NOT_EDITABLE"
        );
      }

      // Si se están actualizando los items, verificar stock
      if (validatedData.items) {
        const productIds = validatedData.items.map((item) => item.productId);
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
          throw new APIError(
            "Uno o más productos no existen",
            404,
            "PRODUCT_NOT_FOUND"
          );
        }

        // Verificar stock para cada producto
        for (const item of validatedData.items) {
          const product = products.find((p) => p.id === item.productId);
          if (!product) continue;

          const existingItem = existingSale.saleItems.find(
            (si) => si.productId === item.productId
          );
          const quantityChange = existingItem
            ? item.quantity - existingItem.quantity
            : item.quantity;

          if (product.stock < quantityChange) {
            throw new APIError(
              `Stock insuficiente para el producto ${product.name}`,
              400,
              "INSUFFICIENT_STOCK"
            );
          }
        }
      }

      // Calcular el total de la venta si hay items
      const totalAmount = validatedData.items
        ? validatedData.items.reduce((sum, item) => sum + item.subtotal, 0)
        : undefined;

      // Actualizar venta en una transacción
      const updatedSale = await prisma.$transaction(async (tx) => {
        // Actualizar la venta
        const sale = await tx.sale.update({
          where: { id: data.id },
          data: {
            customerId: validatedData.customerId,
            userId: validatedData.userId,
            paymentMethod: validatedData.paymentMethod,
            totalAmount,
          },
        });

        // Si se están actualizando los items
        if (validatedData.items) {
          // Eliminar items existentes
          await tx.saleItem.deleteMany({
            where: { saleId: data.id },
          });

          // Crear nuevos items
          const saleItems = await Promise.all(
            validatedData.items.map((item) =>
              tx.saleItem.create({
                data: {
                  saleId: sale.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  subtotal: item.subtotal,
                },
              })
            )
          );

          // Actualizar stock de productos
          await Promise.all(
            validatedData.items.map((item) => {
              const existingItem = existingSale.saleItems.find(
                (si) => si.productId === item.productId
              );
              const quantityChange = existingItem
                ? item.quantity - existingItem.quantity
                : item.quantity;

              return tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: quantityChange,
                  },
                },
              });
            })
          );

          return {
            ...sale,
            saleItems,
          };
        }

        return sale;
      });

      return updatedSale;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Elimina una venta existente
   * @param id - ID de la venta a eliminar
   * @returns true si la venta se eliminó correctamente
   * @throws APIError si ocurre un error al eliminar la venta
   */
  async deleteSale(id: number) {
    try {
      // Verificar que la venta existe
      const existingSale = await prisma.sale.findUnique({
        where: { id },
        include: { saleItems: true },
      });

      if (!existingSale) {
        throw new APIError("Venta no encontrada", 404, "SALE_NOT_FOUND");
      }

      // Verificar que la venta no esté completada
      if (existingSale.status === "COMPLETED") {
        throw new APIError(
          "No se puede eliminar una venta completada",
          400,
          "SALE_NOT_DELETABLE"
        );
      }

      // Eliminar venta en una transacción
      await prisma.$transaction(async (tx) => {
        // Restaurar stock de productos
        await Promise.all(
          existingSale.saleItems.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
          )
        );

        // Eliminar items de la venta
        await tx.saleItem.deleteMany({
          where: { saleId: id },
        });

        // Eliminar la venta
        await tx.sale.delete({
          where: { id },
        });
      });

      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Maneja errores y los convierte en APIError
   * @param error - Error a manejar
   * @throws APIError
   */
  private handleError(error: unknown): never {
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new APIError("Datos inválidos", 400, "VALIDATION_ERROR");
    }

    if (error instanceof Error) {
      throw new APIError(error.message, 500, "INTERNAL_ERROR");
    }

    throw new APIError("Error desconocido", 500, "UNKNOWN_ERROR");
  }
}

// Instancia del servicio
const saleService = new SaleService();

// Exportar funciones del servicio
export const createSaleHandler = (data: SaleCreate) =>
  saleService.createSale(data);
export const getSales = () => saleService.getSales();
export const getSaleById = (id: number) => saleService.getSaleById(id);
export const updateSaleHandler = (data: SaleUpdate & { id: number }) =>
  saleService.updateSale(data);
export const deleteSaleHandler = (id: number) => saleService.deleteSale(id);
