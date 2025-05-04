import { prisma } from "@/components/config/db";
import {
  CustomerCreate,
  CustomerUpdate,
  CustomerFilters,
  CustomerSummary,
} from "@/types/Customer";
import { handleError } from "@/lib/api/error";
import { Customer, Prisma } from "@prisma";

// --- Create Customer ---
export async function createCustomer(data: CustomerCreate) {
  try {
    // Validar que no exista un cliente con el mismo email (si se proporciona)
    if (data.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: data.email },
      });

      if (existingCustomer) {
        throw new Error("Ya existe un cliente con este email");
      }
    }

    // Crear el cliente usando transacción
    const customer = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        return await tx.customer.create({
          data: {
            name: data.name,
            email: data.email || undefined,
            phone: data.phone || undefined,
          },
        });
      }
    );

    return customer;
  } catch (error) {
    throw handleError(error);
  }
}

// --- Get Customer by ID ---
export async function getCustomerById(id: number) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          select: {
            id: true,
            totalAmount: true,
            saleDate: true,
            status: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error("Cliente no encontrado");
    }

    return customer;
  } catch (error) {
    throw handleError(error);
  }
}

// --- Update Customer ---
export async function updateCustomer(id: number, data: CustomerUpdate) {
  try {
    // Verificar que el cliente existe y actualizar usando transacción
    const updatedCustomer = await prisma.$transaction(async (tx) => {
      const existingCustomer = await tx.customer.findUnique({
        where: { id },
      });

      if (!existingCustomer) {
        throw new Error("Cliente no encontrado");
      }

      // Si se está actualizando el email, verificar que no exista otro cliente con el mismo email
      if (data.email && data.email !== existingCustomer.email) {
        const emailExists = await tx.customer.findFirst({
          where: { email: data.email },
        });

        if (emailExists) {
          throw new Error("Ya existe un cliente con este email");
        }
      }

      // Actualizar el cliente
      const updateData: Prisma.CustomerUpdateInput = {
        name: data.name,
      };

      if (data.email !== undefined) {
        updateData.email = data.email;
      }

      if (data.phone !== undefined) {
        updateData.phone = data.phone;
      }

      return await tx.customer.update({
        where: { id },
        data: updateData,
      });
    });

    return updatedCustomer;
  } catch (error) {
    throw handleError(error);
  }
}

// --- Delete Customer ---
export async function deleteCustomer(id: number) {
  try {
    // Verificar que el cliente existe y eliminar usando transacción
    const deletedCustomer = await prisma.$transaction(async (tx) => {
      const existingCustomer = await tx.customer.findUnique({
        where: { id },
        include: {
          sales: true,
        },
      });

      if (!existingCustomer) {
        throw new Error("Cliente no encontrado");
      }

      // Si el cliente tiene ventas, no se puede eliminar
      if (existingCustomer.sales && existingCustomer.sales.length > 0) {
        throw new Error(
          "No se puede eliminar un cliente que tiene ventas asociadas"
        );
      }

      // Eliminar el cliente
      return await tx.customer.delete({
        where: { id },
      });
    });

    return deletedCustomer;
  } catch (error) {
    throw handleError(error);
  }
}

// --- Get All Customers with Filters ---
export async function getCustomers(filters?: CustomerFilters) {
  try {
    const where: Prisma.CustomerWhereInput = {
      ...(filters?.name && {
        name: { contains: filters.name },
      }),
      ...(filters?.email && {
        email: { contains: filters.email },
      }),
      ...(filters?.phone && {
        phone: { contains: filters.phone },
      }),
      ...(filters?.startDate &&
        filters?.endDate && {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
    };

    const customers = await prisma.customer.findMany({
      where,
      include: {
        sales: {
          select: {
            id: true,
            totalAmount: true,
            saleDate: true,
            status: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Aplicar filtros adicionales que no se pueden hacer en la base de datos
    return customers.filter(
      (customer: Customer & { sales: Array<{ totalAmount: number }> }) => {
        if (filters?.minTotalSales || filters?.maxTotalSales) {
          const totalSales = customer.sales.reduce(
            (sum: number, sale: { totalAmount: number }) =>
              sum + sale.totalAmount,
            0
          );
          if (filters.minTotalSales && totalSales < filters.minTotalSales)
            return false;
          if (filters.maxTotalSales && totalSales > filters.maxTotalSales)
            return false;
        }
        return true;
      }
    );
  } catch (error) {
    throw handleError(error);
  }
}

// --- Get Customer Summary ---
export async function getCustomerSummary(): Promise<CustomerSummary> {
  try {
    // Obtener todos los clientes con sus ventas
    const customers = await prisma.customer.findMany({
      include: {
        sales: {
          select: {
            totalAmount: true,
            saleDate: true,
          },
        },
      },
    });

    // Calcular estadísticas
    const totalCustomers = customers.length;
    const totalSales = customers.reduce(
      (
        sum: number,
        customer: Customer & { sales: Array<{ totalAmount: number }> }
      ) => {
        return (
          sum +
          customer.sales.reduce(
            (saleSum: number, sale: { totalAmount: number }) =>
              saleSum + sale.totalAmount,
            0
          )
        );
      },
      0
    );
    const averageSalesPerCustomer =
      totalCustomers > 0 ? totalSales / totalCustomers : 0;

    // Obtener los mejores clientes
    const topCustomers = customers
      .map(
        (
          customer: Customer & {
            sales: Array<{ totalAmount: number; saleDate: Date }>;
          }
        ) => {
          const totalPurchases = customer.sales.reduce(
            (sum: number, sale: { totalAmount: number }) =>
              sum + sale.totalAmount,
            0
          );
          const lastPurchaseDate =
            customer.sales.length > 0
              ? new Date(
                  Math.max(
                    ...customer.sales.map((s) => new Date(s.saleDate).getTime())
                  )
                )
              : null;

          return {
            id: customer.id,
            name: customer.name,
            totalPurchases,
            lastPurchaseDate,
          };
        }
      )
      .sort(
        (a: { totalPurchases: number }, b: { totalPurchases: number }) =>
          b.totalPurchases - a.totalPurchases
      )
      .slice(0, 10); // Top 10 clientes

    return {
      totalCustomers,
      totalSales,
      averageSalesPerCustomer,
      topCustomers,
    };
  } catch (error) {
    throw handleError(error);
  }
}
