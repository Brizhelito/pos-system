import { PrismaClient, idType } from "@prisma/client";
import { Customer, IdType } from "../types";

const prisma = new PrismaClient();

/**
 * Mapea un tipo de ID del enum de Prisma al enum de la aplicación
 */
const mapIdType = (dbIdType: idType): IdType => {
  return dbIdType as unknown as IdType;
};

/**
 * Mapea un tipo de ID del enum de la aplicación al enum de Prisma
 */
const mapToDbIdType = (appIdType: IdType): idType => {
  return appIdType as unknown as idType;
};

/**
 * Servicio para manejar operaciones relacionadas con clientes
 */
export const CustomerService = {
  /**
   * Busca un cliente por su tipo y número de identificación
   */
  async findByIdentification(
    appIdType: IdType,
    idNumber: string
  ): Promise<Customer | null> {
    const dbIdType = mapToDbIdType(appIdType);

    const customer = await prisma.customer.findFirst({
      where: {
        idType: dbIdType,
        idNumber: idNumber,
      },
    });

    if (!customer) return null;

    return {
      id: customer.id,
      name: customer.name,
      idType: mapIdType(customer.idType),
      idNumber: customer.idNumber || "",
      email: customer.email || undefined,
      phone: customer.phone || undefined,
    };
  },

  /**
   * Crea un nuevo cliente
   */
  async create(data: {
    name: string;
    idType: IdType;
    idNumber: string;
    email?: string | null;
    phone?: string | null;
  }): Promise<Customer> {
    const dbIdType = mapToDbIdType(data.idType);

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        idType: dbIdType,
        idNumber: data.idNumber,
        email: data.email,
        phone: data.phone,
        updatedAt: new Date(), // Prisma requiere este campo
      },
    });

    return {
      id: customer.id,
      name: customer.name,
      idType: mapIdType(customer.idType),
      idNumber: customer.idNumber || "",
      email: customer.email || undefined,
      phone: customer.phone || undefined,
    };
  },

  /**
   * Busca clientes por nombre (búsqueda parcial)
   */
  async findByName(name: string): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: 10,
    });

    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      idType: mapIdType(customer.idType),
      idNumber: customer.idNumber || "",
      email: customer.email || undefined,
      phone: customer.phone || undefined,
    }));
  },
};
