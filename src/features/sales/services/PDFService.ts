import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale, Customer, CartItem, PaymentMethod } from "../types";
import { format } from "date-fns";
import {
  COMPANY_INFO,
  TAX_CONFIG,
  CURRENCY_CONFIG,
  APP_CONFIG,
} from "@/utils/constants";

/**
 * Servicio para la generación de PDFs de facturas y recibos
 */
export class PDFService {
  /**
   * Genera un PDF para una factura o recibo
   * @param sale Datos de la venta
   * @param customer Datos del cliente
   * @param items Items de la venta
   * @returns Blob del PDF generado
   */
  static generateSaleReceipt(
    sale: Sale,
    customer: Customer,
    items: CartItem[]
  ): Promise<Blob> {
    return new Promise((resolve) => {
      // Crear nuevo documento PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Configurar fuentes y tamaños
      doc.setFontSize(10);

      // Título y datos de la empresa
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(COMPANY_INFO.name, doc.internal.pageSize.getWidth() / 2, 20, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(COMPANY_INFO.address, doc.internal.pageSize.getWidth() / 2, 25, {
        align: "center",
      });
      doc.text(
        `RIF: ${COMPANY_INFO.rif}`,
        doc.internal.pageSize.getWidth() / 2,
        30,
        {
          align: "center",
        }
      );
      doc.text(
        `Teléfono: ${COMPANY_INFO.phone}`,
        doc.internal.pageSize.getWidth() / 2,
        35,
        {
          align: "center",
        }
      );
      doc.text(
        `Email: ${COMPANY_INFO.email}`,
        doc.internal.pageSize.getWidth() / 2,
        40,
        {
          align: "center",
        }
      );

      // Título del documento (Factura o Recibo)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        sale.invoice ? "FACTURA DE VENTA" : "RECIBO DE VENTA",
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
      );

      // Información de la venta
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`N° ${sale.invoice?.number || sale.id}`, 20, 60);
      doc.text(
        `Fecha: ${format(new Date(sale.saleDate), "dd/MM/yyyy HH:mm")}`,
        20,
        65
      );

      // Información del cliente
      doc.text("DATOS DEL CLIENTE", 20, 75);
      doc.setFont("helvetica", "normal");
      doc.text(`Nombre: ${customer.name}`, 20, 80);
      doc.text(
        `Identificación: ${customer.idType} ${customer.idNumber}`,
        20,
        85
      );
      if (customer.email) {
        doc.text(`Email: ${customer.email}`, 20, 90);
      }
      if (customer.phone) {
        doc.text(`Teléfono: ${customer.phone}`, 20, customer.email ? 95 : 90);
      }

      // Tabla de productos
      const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];
      const tableRows = items.map((item) => [
        item.product.name,
        item.quantity.toString(),
        this.formatCurrency(item.unitPrice),
        this.formatCurrency(item.subtotal),
      ]);

      // Agregar tabla de productos
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: customer.email || customer.phone ? 105 : 95,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Calcular posición final de la tabla
      const finalY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 10;

      // Totales
      doc.setFont("helvetica", "normal");
      doc.text(
        `Subtotal: ${this.formatCurrency(
          sale.totalAmount * (1 - TAX_CONFIG.rate)
        )}`,
        130,
        finalY
      );
      doc.text(
        `${TAX_CONFIG.label} (${TAX_CONFIG.percentage}): ${this.formatCurrency(
          sale.totalAmount * TAX_CONFIG.rate
        )}`,
        130,
        finalY + 5
      );
      doc.setFont("helvetica", "bold");
      doc.text(
        `TOTAL: ${this.formatCurrency(sale.totalAmount)}`,
        130,
        finalY + 10
      );

      // Método de pago
      doc.setFont("helvetica", "bold");
      doc.text("FORMA DE PAGO", 20, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Método: ${this.getPaymentMethodText(sale.paymentMethod)}`,
        20,
        finalY + 5
      );

      // Detalles del pago
      if (sale.paymentDetails) {
        const yPos = finalY + 10;
        const details = sale.paymentDetails;

        switch (sale.paymentMethod) {
          case PaymentMethod.EFECTIVO:
            if (details.amountReceived) {
              doc.text(
                `Monto recibido: ${this.formatCurrency(
                  parseFloat(details.amountReceived)
                )}`,
                20,
                yPos
              );
              doc.text(
                `Cambio: ${this.formatCurrency(
                  parseFloat(details.amountReceived) - sale.totalAmount
                )}`,
                20,
                yPos + 5
              );
            }
            break;

          case PaymentMethod.PAGO_MOVIL:
            doc.text(`Teléfono: ${details.phoneNumber}`, 20, yPos);
            doc.text(`Banco: ${details.bank}`, 20, yPos + 5);
            doc.text(`Referencia: ${details.reference}`, 20, yPos + 10);
            break;

          case PaymentMethod.TRANSFERENCIA:
            doc.text(`Banco origen: ${details.sourceBank}`, 20, yPos);
            doc.text(`Banco destino: ${details.targetBank}`, 20, yPos + 5);
            doc.text(`Referencia: ${details.reference}`, 20, yPos + 10);
            break;

          case PaymentMethod.PUNTO_DE_VENTA:
            doc.text(`Banco: ${details.bank}`, 20, yPos);
            doc.text(`Últimos 4 dígitos: ${details.lastDigits}`, 20, yPos + 5);
            doc.text(`Referencia: ${details.reference}`, 20, yPos + 10);
            break;
        }
      }

      // Nota de agradecimiento
      const footerY = doc.internal.pageSize.getHeight() - 30;
      doc.setFontSize(10);
      doc.text(
        "¡Gracias por su compra!",
        doc.internal.pageSize.getWidth() / 2,
        footerY,
        {
          align: "center",
        }
      );
      doc.setFontSize(8);
      doc.text(
        APP_CONFIG.receiptCopyright,
        doc.internal.pageSize.getWidth() / 2,
        footerY + 5,
        {
          align: "center",
        }
      );

      // Generar el PDF como blob
      const pdfBlob = doc.output("blob");
      resolve(pdfBlob);
    });
  }

  /**
   * Formatea un valor monetario
   * @param amount Cantidad a formatear
   * @returns Cadena formateada
   */
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: "currency",
      currency: CURRENCY_CONFIG.code,
    }).format(amount);
  }

  /**
   * Convierte el enum de método de pago a texto legible
   * @param method Método de pago
   * @returns Texto descriptivo
   */
  private static getPaymentMethodText(method: PaymentMethod): string {
    const methodTexts: Record<PaymentMethod, string> = {
      [PaymentMethod.EFECTIVO]: "Efectivo",
      [PaymentMethod.PAGO_MOVIL]: "Pago Móvil",
      [PaymentMethod.TRANSFERENCIA]: "Transferencia Bancaria",
      [PaymentMethod.PUNTO_DE_VENTA]: "Punto de Venta",
    };
    return methodTexts[method];
  }
}
