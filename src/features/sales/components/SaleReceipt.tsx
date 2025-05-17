"use client";

import { Sale, Customer, CartItem, PaymentMethod } from "../types";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import {
  COMPANY_INFO,
  TAX_CONFIG,
  CURRENCY_CONFIG,
  APP_CONFIG,
} from "@/utils/constants";
import "@/lib/print-styles.css";
import { PrinterIcon, DownloadIcon, MailIcon, XIcon } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { autoTable } from "jspdf-autotable";
import { es } from "date-fns/locale";

interface SaleReceiptProps {
  sale: Sale;
  customer: Customer;
  items: CartItem[];
  onClose: () => void;
}

const SaleReceipt = ({ sale, customer, items, onClose }: SaleReceiptProps) => {
  // Estado para controlar si hay error en los datos
  const [hasError] = useState(!sale || !customer || !Array.isArray(items));
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Referencias para enfoque de elementos
  const printButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const receiptContentRef = useRef<HTMLDivElement>(null);

  // Enfocar el botón de imprimir al mostrar el recibo
  useEffect(() => {
    printButtonRef.current?.focus();
  }, []);

  // Manejar atajos de teclado
  useHotkeys(
    "alt+p",
    () => {
      if (!hasError) {
        handlePrint();
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+x",
    () => {
      onClose();
      toast.info("Recibo cerrado");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+d",
    () => {
      if (!hasError && !isGeneratingPDF) {
        handleDownloadPDF();
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atrapar el foco dentro del modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo procesar si es Tab
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        // Si presiona Shift+Tab y está en el primer elemento, ir al último
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Si presiona Tab y está en el último elemento, ir al primero
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Si hay error en los datos, mostrar mensaje de error
  if (hasError) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
          Error al cargar el recibo
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          No se pudieron cargar los datos del recibo correctamente.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Cerrar recibo"
        >
          Cerrar
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: "currency",
      currency: CURRENCY_CONFIG.code,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "dd 'de' MMMM, yyyy - HH:mm", { locale: es });
  };

  // Mapea el método de pago a un texto más descriptivo
  const getPaymentMethodText = (method: PaymentMethod): string => {
    const methodTexts: Record<PaymentMethod, string> = {
      [PaymentMethod.EFECTIVO]: "Efectivo",
      [PaymentMethod.PAGO_MOVIL]: "Pago Móvil",
      [PaymentMethod.TRANSFERENCIA]: "Transferencia Bancaria",
      [PaymentMethod.PUNTO_DE_VENTA]: "Punto de Venta",
    };
    return methodTexts[method];
  };

  // Calcular subtotal y monto de impuestos basado en la configuración
  const calculateAmounts = () => {
    // Si los impuestos están desactivados, el subtotal es igual al monto total
    const subtotal = TAX_CONFIG.enabled
      ? sale.totalAmount / (1 + TAX_CONFIG.rate)
      : sale.totalAmount;

    // El monto del impuesto es 0 cuando está desactivado
    const taxAmount = TAX_CONFIG.enabled ? TAX_CONFIG.calculate(subtotal) : 0;

    return { subtotal, taxAmount };
  };

  // Renderiza los detalles del pago según el método
  const renderPaymentDetails = () => {
    if (!sale.paymentDetails) {
      return null;
    }

    const details = sale.paymentDetails;

    switch (sale.paymentMethod) {
      case PaymentMethod.EFECTIVO:
        return details.amountReceived ? (
          <div className="mt-2">
            <p className="text-xs">
              Monto recibido:{" "}
              {formatCurrency(parseFloat(details.amountReceived))}
            </p>
            <p className="text-xs">
              Cambio:{" "}
              {formatCurrency(
                parseFloat(details.amountReceived) - sale.totalAmount
              )}
            </p>
          </div>
        ) : null;

      case PaymentMethod.PAGO_MOVIL:
        return (
          <div className="mt-2">
            <p className="text-xs">Teléfono: {details.phoneNumber}</p>
            <p className="text-xs">Banco: {details.bank}</p>
            <p className="text-xs">Referencia: {details.reference}</p>
          </div>
        );

      case PaymentMethod.TRANSFERENCIA:
        return (
          <div className="mt-2">
            <p className="text-xs">Banco origen: {details.sourceBank}</p>
            <p className="text-xs">Banco destino: {details.targetBank}</p>
            <p className="text-xs">Referencia: {details.reference}</p>
          </div>
        );

      case PaymentMethod.PUNTO_DE_VENTA:
        return (
          <div className="mt-2">
            <p className="text-xs">Banco: {details.bank}</p>
            <p className="text-xs">Últimos 4 dígitos: {details.lastDigits}</p>
            <p className="text-xs">Referencia: {details.reference}</p>
          </div>
        );

      default:
        return null;
    }
  };

  // Función para manejar la impresión directamente
  const handlePrint = () => {
    toast.info("Preparando impresión...");

    // Crear un iframe oculto para la impresión
    const printIframe = document.createElement("iframe");
    printIframe.style.display = "none";
    document.body.appendChild(printIframe);

    const invoiceTitle = sale.invoice?.number
      ? `Factura ${sale.invoice.number}`
      : `Recibo #${sale.id}`;

    // Verificar que el documento del iframe esté disponible
    if (!printIframe.contentDocument) {
      toast.error("Error al preparar la impresión");
      document.body.removeChild(printIframe);
      return;
    }

    // Obtener el contenido del recibo
    const receiptContent = receiptContentRef.current?.innerHTML || "";

    // Insertar el contenido y los estilos en el iframe
    printIframe.contentDocument.write(`
      <html>
      <head>
        <title>${invoiceTitle}</title>
        <style>
          ${document.getElementById("receipt-print-styles")?.innerHTML || ""}
          
          /* Estilos adicionales para impresión */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          
          .receipt-print-wrapper {
            width: 100%;
            max-width: 80mm;
            margin: 0 auto;
            padding: 5mm;
          }
          
          @media print {
            @page { 
              size: 80mm auto;
              margin: 0;
            }
            body { 
              margin: 0; 
            }
            .no-print { 
              display: none !important; 
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-print-wrapper">
          ${receiptContent}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-finished', '*');
              }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `);

    // Cerrar el documento
    printIframe.contentDocument.close();

    // Esperar el mensaje de impresión finalizada
    const handlePrintMessage = (event: MessageEvent) => {
      if (event.data === "print-finished") {
        document.body.removeChild(printIframe);
        window.removeEventListener("message", handlePrintMessage);
        toast.success("Impresión completada");
      }
    };

    window.addEventListener("message", handlePrintMessage);

    // Fallback por si no recibimos el mensaje (después de 5 segundos)
    setTimeout(() => {
      if (document.body.contains(printIframe)) {
        document.body.removeChild(printIframe);
        window.removeEventListener("message", handlePrintMessage);
        toast.success("Impresión enviada");
      }
    }, 5000);
  };

  // Función para generar y descargar PDF
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      toast.info("Generando PDF...");

      // Crear nuevo documento PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Configuración de dimensiones
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      // Obtener fecha y hora formateada
      const dateStr = format(
        new Date(sale.saleDate || new Date()),
        "dd/MM/yyyy HH:mm"
      );

      // Cabecera con información de la empresa
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(COMPANY_INFO.name, pageWidth / 2, margin, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let y = margin + 7;
      doc.text(COMPANY_INFO.address, pageWidth / 2, y, { align: "center" });
      y += 5;
      doc.text(`${COMPANY_INFO.city}, ${COMPANY_INFO.zip}`, pageWidth / 2, y, {
        align: "center",
      });
      y += 5;
      doc.text(
        `RIF: ${COMPANY_INFO.rif} | Tel: ${COMPANY_INFO.phone}`,
        pageWidth / 2,
        y,
        { align: "center" }
      );
      y += 5;
      doc.text(COMPANY_INFO.email, pageWidth / 2, y, { align: "center" });
      y += 10;

      // Título del documento
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const title = sale.invoice?.number
        ? `FACTURA ${sale.invoice.number}`
        : `RECIBO DE VENTA #${sale.id}`;
      doc.text(title, pageWidth / 2, y, { align: "center" });
      y += 10;

      // Información de la venta
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${dateStr}`, margin, y);
      doc.text(
        `Vendedor: ${sale.userId ? `#${sale.userId}` : "Sistema"}`,
        pageWidth - margin,
        y,
        { align: "right" }
      );
      y += 7;

      // Información del cliente
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Datos del Cliente", margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Cliente: ${customer.name}`, margin, y);
      doc.text(
        `ID: ${customer.idType} ${customer.idNumber}`,
        pageWidth - margin,
        y,
        { align: "right" }
      );
      y += 5;

      if (customer.email) {
        doc.text(`Email: ${customer.email}`, margin, y);
        y += 5;
      }

      if (customer.phone) {
        doc.text(`Teléfono: ${customer.phone}`, margin, y);
        y += 5;
      }

      y += 5;

      // Tabla de productos
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Detalle de Productos", margin, y);
      y += 5;

      const tableHeaders = [
        { header: "Producto", dataKey: "product" },
        { header: "Cant.", dataKey: "quantity" },
        { header: "Precio", dataKey: "price" },
        { header: "Total", dataKey: "total" },
      ];

      const tableData = items.map((item) => ({
        product: item.product.name,
        quantity: item.quantity.toString(),
        price: formatCurrency(item.unitPrice),
        total: formatCurrency(item.subtotal),
      }));

      autoTable(doc, {
        head: [tableHeaders.map((h) => h.header)],
        body: tableData.map((row) => [
          row.product,
          row.quantity,
          row.price,
          row.total,
        ]),
        startY: y,
        margin: { left: margin, right: margin },
        headStyles: {
          fillColor: [60, 60, 60],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 15, halign: "center" },
          2: { cellWidth: 30, halign: "right" },
          3: { cellWidth: 30, halign: "right" },
        },
        didDrawPage: (data) => {
          // Actualizar la posición Y después de dibujar la tabla
          if (data.cursor) {
            y = data.cursor.y + 10;
          } else {
            y += 10; // Si no hay cursor, añadir un espacio por defecto
          }
        },
      });

      // Calcular subtotal y monto de impuestos
      const { subtotal, taxAmount } = calculateAmounts();

      // Resumen de totales
      y += 5;
      const totalsWidth = 70;
      const totalsX = pageWidth - margin - totalsWidth;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // Subtotal - siempre lo mostramos
      doc.text("Subtotal:", totalsX, y);
      doc.text(formatCurrency(subtotal), pageWidth - margin, y, {
        align: "right",
      });
      y += 6;

      // Impuestos (solo si están habilitados)
      if (TAX_CONFIG.enabled) {
        doc.text(`${TAX_CONFIG.label} (${TAX_CONFIG.percentage}):`, totalsX, y);
        doc.text(formatCurrency(taxAmount), pageWidth - margin, y, {
          align: "right",
        });
        y += 6;
      }

      // Total
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL:", totalsX, y);
      doc.text(formatCurrency(sale.totalAmount), pageWidth - margin, y, {
        align: "right",
      });
      y += 10;

      // Información de pago
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Forma de pago:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(getPaymentMethodText(sale.paymentMethod), margin + 30, y);
      y += 7;

      // Detalles del pago según el método
      if (sale.paymentDetails) {
        const details = sale.paymentDetails;
        doc.setFontSize(9);

        switch (sale.paymentMethod) {
          case PaymentMethod.EFECTIVO:
            if (details.amountReceived) {
              doc.text(
                `Monto recibido: ${formatCurrency(
                  parseFloat(details.amountReceived)
                )}`,
                margin,
                y
              );
              y += 5;
              doc.text(
                `Cambio: ${formatCurrency(
                  parseFloat(details.amountReceived) - sale.totalAmount
                )}`,
                margin,
                y
              );
              y += 5;
            }
            break;

          case PaymentMethod.PAGO_MOVIL:
            doc.text(`Teléfono: ${details.phoneNumber}`, margin, y);
            y += 5;
            doc.text(`Banco: ${details.bank}`, margin, y);
            y += 5;
            doc.text(`Referencia: ${details.reference}`, margin, y);
            y += 5;
            break;

          case PaymentMethod.TRANSFERENCIA:
            doc.text(`Banco origen: ${details.sourceBank}`, margin, y);
            y += 5;
            doc.text(`Banco destino: ${details.targetBank}`, margin, y);
            y += 5;
            doc.text(`Referencia: ${details.reference}`, margin, y);
            y += 5;
            break;

          case PaymentMethod.PUNTO_DE_VENTA:
            doc.text(`Banco: ${details.bank}`, margin, y);
            y += 5;
            doc.text(`Últimos 4 dígitos: ${details.lastDigits}`, margin, y);
            y += 5;
            doc.text(`Referencia: ${details.reference}`, margin, y);
            y += 5;
            break;
        }
      }

      // Pie de página
      const footerY = pageHeight - margin * 2;
      doc.setFontSize(8);
      doc.text(APP_CONFIG.receiptCopyright, pageWidth / 2, footerY, {
        align: "center",
      });
      doc.text("¡Gracias por su compra!", pageWidth / 2, footerY + 4, {
        align: "center",
      });

      // Guardar el PDF
      const filename = `${sale.invoice?.number || "recibo-" + sale.id}.pdf`;
      doc.save(filename);

      toast.success("PDF descargado correctamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Función para enviar el recibo por email
  const handleSendEmail = async () => {
    if (!customer.email) {
      toast.error("El cliente no tiene un correo electrónico registrado");
      return;
    }

    try {
      setIsSendingEmail(true);
      toast.info(`Enviando recibo a ${customer.email}...`);

      // Aquí iría el código para enviar por email (utilizando una API)
      // Simulamos una espera
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`Recibo enviado a ${customer.email}`);
    } catch (error) {
      console.error("Error al enviar email:", error);
      toast.error("Error al enviar el email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Calcular subtotal y monto de impuestos para el modal
  const { subtotal, taxAmount } = calculateAmounts();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <style id="receipt-print-styles" type="text/css">
        {`
          @media print {
            @page { 
              size: 80mm auto; 
              margin: 0;
            }
            body { 
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              font-size: 10px;
            }
            .no-print { 
              display: none !important; 
            }
            .receipt-print-wrapper {
              width: 100%;
              max-width: 80mm;
              margin: 0 auto;
              padding: 5mm;
            }
          }
        `}
      </style>

      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
      >
        {/* Botón cerrar en esquina */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors no-print text-gray-500 dark:text-gray-400"
          aria-label="Cerrar"
        >
          <XIcon size={20} />
        </button>

        <div className="p-6">
          {/* Título del recibo */}
          <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white no-print">
            {sale.invoice?.number
              ? `Factura No. ${sale.invoice.number}`
              : `Recibo de Venta #${sale.id}`}
          </h2>

          {/* Contenido imprimible */}
          <div ref={receiptContentRef} className="receipt-content">
            {/* Cabecera con información de la empresa */}
            <div className="receipt-header text-center mb-4">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {COMPANY_INFO.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {COMPANY_INFO.address}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {COMPANY_INFO.city}, {COMPANY_INFO.zip}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                RIF: {COMPANY_INFO.rif} | Teléfono: {COMPANY_INFO.phone}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {COMPANY_INFO.email}
              </p>
            </div>

            {/* Detalles de la venta */}
            <div className="receipt-details border-t border-b border-dashed border-gray-300 dark:border-gray-600 py-3 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {sale.invoice?.number ? "Factura No.:" : "Recibo No.:"}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {sale.invoice?.number || sale.id}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {formatDate(sale.saleDate || new Date())}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cliente:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {customer.name}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Identificación:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {customer.idType} {customer.idNumber}
                </span>
              </div>
              {customer.email && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email:
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {customer.email}
                  </span>
                </div>
              )}
              {customer.phone && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teléfono:
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {customer.phone}
                  </span>
                </div>
              )}
            </div>

            {/* Tabla de productos */}
            <div className="receipt-items mb-4">
              <div className="receipt-item-header grid grid-cols-12 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Cant.</div>
                <div className="col-span-2 text-right">Precio</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="receipt-item grid grid-cols-12 text-sm text-gray-800 dark:text-gray-200 mb-1"
                >
                  <div className="col-span-6 truncate">{item.product.name}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.unitPrice)}
                  </div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="receipt-totals border-t border-dashed border-gray-300 dark:border-gray-600 pt-3 mb-4">
              {/* Subtotal - siempre mostrar */}
              <div className="receipt-total-row flex justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Subtotal:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* Impuesto (solo mostrar si está habilitado) */}
              {TAX_CONFIG.enabled && (
                <div className="receipt-total-row flex justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {TAX_CONFIG.label} ({TAX_CONFIG.percentage}):
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="receipt-total-final flex justify-between font-bold mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="text-base text-gray-900 dark:text-white">
                  TOTAL:
                </span>
                <span className="text-base text-gray-900 dark:text-white">
                  {formatCurrency(sale.totalAmount)}
                </span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="receipt-payment mb-4">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Forma de pago:{" "}
                <span className="text-gray-800 dark:text-gray-200">
                  {getPaymentMethodText(sale.paymentMethod)}
                </span>
              </div>
              {renderPaymentDetails()}
            </div>

            {/* Footer del recibo */}
            <div className="receipt-footer text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
              <p>{APP_CONFIG.receiptCopyright}</p>
              <p className="mt-1">¡Gracias por su compra!</p>
            </div>
          </div>

          {/* Botones de acción (solo visibles en pantalla) */}
          <div className="receipt-actions mt-6 no-print">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Grupo de botones izquierdo */}
              <div className="flex flex-wrap gap-2">
                <button
                  ref={printButtonRef}
                  onClick={handlePrint}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded text-sm font-medium flex items-center gap-1.5"
                  aria-label="Imprimir recibo (Alt+P)"
                >
                  <PrinterIcon size={16} />
                  <span>Imprimir</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium flex items-center gap-1.5 disabled:opacity-60 disabled:pointer-events-none"
                  aria-label="Descargar PDF (Alt+D)"
                >
                  <DownloadIcon size={16} />
                  <span>{isGeneratingPDF ? "Generando..." : "PDF"}</span>
                </button>

                {customer.email && (
                  <button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail}
                    className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded text-sm font-medium flex items-center gap-1.5 disabled:opacity-60 disabled:pointer-events-none"
                    aria-label="Enviar por email"
                  >
                    <MailIcon size={16} />
                    <span>{isSendingEmail ? "Enviando..." : "Email"}</span>
                  </button>
                )}
              </div>

              {/* Botón de cerrar (alineado a la derecha en desktop, a la izquierda en móvil) */}
              <div className="flex justify-start sm:justify-end">
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded text-sm font-medium"
                  aria-label="Cerrar recibo (Alt+X)"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReceipt;
 