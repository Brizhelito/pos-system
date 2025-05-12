import { NextResponse } from "next/server";
import { PrismaClient, sale_paymentMethod } from "@prisma/client";
import { ProcessSaleSchema } from "@/features/sales/api/validation";
import { PaymentMethod } from "@/features/sales/types";
import { getIronSession, IronSessionData } from "iron-session";
import { sessionOptions } from "@/lib/auth/auth";
import { INVOICE_CONFIG } from "@/lib/config/env";

const prisma = new PrismaClient();

/**
 * Convierte el método de pago de la aplicación al formato de la base de datos
 */
const mapToDbPaymentMethod = (appMethod: PaymentMethod): sale_paymentMethod => {
  if (appMethod === PaymentMethod.EFECTIVO)
    return "EFECTIVO" as sale_paymentMethod;
  if (appMethod === PaymentMethod.PAGO_MOVIL)
    return "PAGO_MOVIL" as sale_paymentMethod;
  if (appMethod === PaymentMethod.TRANSFERENCIA)
    return "TRANSFERENCIA" as sale_paymentMethod;
  if (appMethod === PaymentMethod.PUNTO_DE_VENTA)
    return "PUNTO_DE_VENTA" as sale_paymentMethod;

  // Por defecto, devolvemos EFECTIVO como fallback
  return "EFECTIVO" as sale_paymentMethod;
};

/**
 * POST /api/sales/process-sale
 * Procesa una venta completa, incluyendo la generación de factura
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getIronSession<IronSessionData>(
      request,
      new Response(),
      sessionOptions
    );
    // Validar datos de entrada
    const result = ProcessSaleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Datos de venta inválidos", details: result.error.format() },
        { status: 400 }
      );
    }

    const { customerId, items, paymentMethod, total } = result.data;
    const dbPaymentMethod = mapToDbPaymentMethod(paymentMethod);

    // Comenzar una transacción
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Verificar stock disponible
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
          );
        }
      }

      // 2. Crear la venta
      const userId = session.user?.id || 1;

      const newSale = await tx.sale.create({
        data: {
          customerId,
          userId,
          totalAmount: total,
          paymentMethod: dbPaymentMethod,
          status: "COMPLETED",
          updatedAt: new Date(),
        },
      });

      // 3. Crear los items de venta
      for (const item of items) {
        await tx.saleitem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          },
        });

        // 4. Actualizar stock del producto
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
            updatedAt: new Date(),
          },
        });
      }

      // 5. Crear factura
      // Usar el prefijo de factura de la configuración centralizada
      const invoicePrefix = INVOICE_CONFIG.prefix;
      const invoiceNumber = `${invoicePrefix}${newSale.id}`;

      const invoice = await tx.invoice.create({
        data: {
          saleId: newSale.id,
          number: invoiceNumber,
          invoiceStatus: "ISSUED",
          updatedAt: new Date(),
        },
      });

      return { sale: newSale, invoice };
    });

    // Obtener la venta completa con todos sus detalles
    const completeData = await prisma.sale.findUnique({
      where: { id: sale.sale.id },
      include: {
        customer: true,
        saleitem: {
          include: {
            product: true,
          },
        },
        invoice: true,
      },
    });

    return NextResponse.json({
      message: "Venta procesada correctamente",
      sale: completeData,
    });
  } catch (error: unknown) {
    console.error("Error al procesar venta:", error);

    // Verificar si el error tiene un mensaje
    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json(
      {
        error: "Error al procesar la venta",
        message: errorMessage,
      },
      { status: errorMessage !== "Error interno del servidor" ? 400 : 500 }
    );
  }
}
