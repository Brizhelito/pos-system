import { prisma } from "@/components/config/db";
import {
  CustomerCreate,
  CustomerUpdate,
  CustomerFilters,
  CustomerSummary,
} from "@/types/Customer";
import { handleError } from "@/lib/api/error";
import { Prisma } from "@prisma";

// Función para normalizar el formato de la cédula
function normalizeCedula(
  cedula: string | null | undefined
): string | undefined {
  if (!cedula) return undefined;

  // Convertir a mayúsculas y eliminar espacios en blanco
  let normalized = cedula.toUpperCase().trim();

  // Validar el formato básico (V-12345678 o E-12345678)
  const validFormat = /^[VE]-\d+$/;
  if (!validFormat.test(normalized)) {
    // Si no tiene el formato correcto, intentamos arreglarlo

    // Si comienza con V o E pero falta el guion, añadirlo
    if (/^[VE]\d+$/.test(normalized)) {
      normalized = normalized.replace(/^([VE])/, "$1-");
    }

    // Si solo hay números, asumir que es venezolano
    else if (/^\d+$/.test(normalized)) {
      normalized = `V-${normalized}`;
    }

    // Si sigue sin tener el formato correcto después de los intentos de normalización
    if (!validFormat.test(normalized)) {
      throw new Error("Formato de cédula inválido. Use V-XXXXXXXX o E-XXXXXXX");
    }
  }

  return normalized;
}

// --- Buscar cliente por cédula (nueva función) ---
export async function getCustomerByCedula(cedula: string) {
  try {
    const normalizedCedula = normalizeCedula(cedula);

    if (!normalizedCedula) {
      throw new Error("Cédula inválida");
    }

    const customer = await prisma.customer.findFirst({
      where: { cedula: normalizedCedula },
      include: {
        sale: {
          select: {
            id: true,
            totalAmount: true,
            saleDate: true,
            status: true,
          },
        },
      },
    });

    return customer;
  } catch (error) {
    throw handleError(error);
  }
}

// --- Create Customer ---
export async function createCustomer(data: CustomerCreate) {
  try {
    // Normalizar la cédula si se proporciona
    let normalizedCedula: string | undefined = undefined;

    try {
      normalizedCedula = data.cedula ? normalizeCedula(data.cedula) : undefined;
    } catch (error) {
      throw new Error(
        `Error en el formato de cédula: ${(error as Error).message}`
      );
    }

    // Validar que no exista un cliente con el mismo email (si se proporciona)
    if (data.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: data.email },
      });

      if (existingCustomer) {
        throw new Error("Ya existe un cliente con este email");
      }
    }

    // Validar que no exista un cliente con la misma cédula (si se proporciona)
    if (normalizedCedula) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { cedula: normalizedCedula },
      });

      if (existingCustomer) {
        throw new Error("Ya existe un cliente con esta cédula");
      }
    }

    // Crear el cliente usando transacción
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        cedula: normalizedCedula,
        email: data.email || undefined,
        phone: data.phone || undefined,
        updatedAt: new Date(),
      },
    });

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
        sale: {
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
    // Normalizar la cédula si se proporciona
    let normalizedCedula: string | undefined | null = undefined;

    try {
      if (data.cedula !== undefined) {
        normalizedCedula = data.cedula ? normalizeCedula(data.cedula) : null;
      }
    } catch (error) {
      throw new Error(
        `Error en el formato de cédula: ${(error as Error).message}`
      );
    }

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

      // Si se está actualizando la cédula, verificar que no exista otro cliente con la misma cédula
      if (normalizedCedula && normalizedCedula !== existingCustomer.cedula) {
        const cedulaExists = await tx.customer.findFirst({
          where: { cedula: normalizedCedula },
        });

        if (cedulaExists) {
          throw new Error("Ya existe un cliente con esta cédula");
        }
      }

      // Actualizar el cliente
      const updateData: Prisma.customerUpdateInput = {
        name: data.name,
        ...(normalizedCedula !== undefined && { cedula: normalizedCedula }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      };

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
          sale: true,
        },
      });

      if (!existingCustomer) {
        throw new Error("Cliente no encontrado");
      }

      // Si el cliente tiene ventas, no se puede eliminar
      if (existingCustomer.sale && existingCustomer.sale.length > 0) {
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
    // Normalizar la cédula en los filtros si se proporciona
    let normalizedCedula: string | undefined = undefined;
    if (filters?.cedula) {
      try {
        normalizedCedula = normalizeCedula(filters.cedula);
      } catch {
        // No lanzar error, simplemente usar la cédula original para la búsqueda
        normalizedCedula = filters.cedula;
      }
    }

    const where: Prisma.customerWhereInput = {
      ...(filters?.name && {
        name: { contains: filters.name },
      }),
      ...(normalizedCedula && {
        cedula: { contains: normalizedCedula },
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
      where: where as Prisma.customerWhereInput,
      include: {
        sale: {
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
    return customers.filter((customer) => {
      if (filters?.minTotalSales || filters?.maxTotalSales) {
        const totalSales = customer.sale.reduce(
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
    });
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
        sale: {
          select: {
            totalAmount: true,
            saleDate: true,
          },
        },
      },
    });

    // Calcular estadísticas
    const totalCustomers = customers.length;
    const totalSales = customers.reduce((sum: number, customer) => {
      return (
        sum +
        customer.sale.reduce(
          (saleSum: number, sale: { totalAmount: number }) =>
            saleSum + sale.totalAmount,
          0
        )
      );
    }, 0);
    const averageSalesPerCustomer =
      totalCustomers > 0 ? totalSales / totalCustomers : 0;

    // Obtener los mejores clientes
    const topCustomers = customers
      .map((customer) => {
        const totalPurchases = customer.sale.reduce(
          (sum: number, sale: { totalAmount: number }) =>
            sum + sale.totalAmount,
          0
        );
        const lastPurchaseDate =
          customer.sale.length > 0
            ? new Date(
                Math.max(
                  ...customer.sale.map((s) => new Date(s.saleDate).getTime())
                )
              )
            : null;

        return {
          id: customer.id,
          name: customer.name,
          totalPurchases,
          lastPurchaseDate,
        };
      })
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
