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

interface SaleReceiptProps {
  sale: Sale;
  customer: Customer;
  items: CartItem[];
  onClose: () => void;
  onPrint: () => void;
  onDownloadPDF?: () => void;
  onSendEmail?: () => void;
}

const SaleReceipt = ({
  sale,
  customer,
  items,
  onClose,
  onPrint,
  onDownloadPDF,
  onSendEmail,
}: SaleReceiptProps) => {
  // Estado para controlar si hay error en los datos
  const [hasError] = useState(!sale || !customer || !Array.isArray(items));

  // Referencias para enfoque de elementos
  const printButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Enfocar el botón de imprimir al mostrar el recibo
  useEffect(() => {
    printButtonRef.current?.focus();
  }, []);

  // Manejar atajos de teclado
  useHotkeys(
    "alt+p",
    () => {
      if (!hasError) {
        onPrint();
        toast.info("Imprimiendo recibo...");
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

  // Atajo para imprimir recibo
  useHotkeys(
    "alt+shift+p",
    () => {
      if (!hasError) {
        onPrint();
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

  return (
    <div
      className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
    >
      <div className="flex justify-between items-center mb-4 no-print">
        <h2 id="receipt-title" className="text-xl font-bold">
          {sale.invoice ? "Factura de Venta" : "Recibo de Venta"}
        </h2>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center no-print"
          aria-label="Cerrar recibo"
        >
          <span className="sr-only">Cerrar</span>
          <kbd className="mr-1 px-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
            Alt+X
          </kbd>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="receipt-content border-t border-b dark:border-gray-700 py-4 mb-4">
        <div className="text-center mb-4 receipt-header">
          <h1 className="font-bold text-lg">{COMPANY_INFO.name}</h1>
          <p className="text-sm">{COMPANY_INFO.address}</p>
          <p className="text-sm">RIF: {COMPANY_INFO.rif}</p>
          <p className="text-sm">Teléfono: {COMPANY_INFO.phone}</p>
          <p className="text-sm">Email: {COMPANY_INFO.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm receipt-customer">
          <div>
            <span className="font-medium">Factura No.:</span>
            <span className="ml-2">{sale.invoice?.number || `${sale.id}`}</span>
          </div>
          <div>
            <span className="font-medium">Fecha:</span>
            <span className="ml-2">
              {format(new Date(sale.saleDate), "dd/MM/yyyy HH:mm")}
            </span>
          </div>
          <div>
            <span className="font-medium">Cliente:</span>
            <span className="ml-2">{customer.name}</span>
          </div>
          <div>
            <span className="font-medium">Identificación:</span>
            <span className="ml-2">
              {customer.idType} {customer.idNumber}
            </span>
          </div>
          {customer.email && (
            <div>
              <span className="font-medium">Email:</span>
              <span className="ml-2">{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div>
              <span className="font-medium">Teléfono:</span>
              <span className="ml-2">{customer.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 receipt-items">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-2">Producto</th>
              <th className="text-center py-2">Cant.</th>
              <th className="text-right py-2">Precio</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.productId}
                className="border-b dark:border-gray-700"
              >
                <td className="py-2">{item.product.name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="text-right py-2">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4 receipt-summary">
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>
            {formatCurrency(sale.totalAmount * (1 - TAX_CONFIG.rate))}
          </span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>
            {TAX_CONFIG.label} ({TAX_CONFIG.percentage}):
          </span>
          <span>{formatCurrency(sale.totalAmount * TAX_CONFIG.rate)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.totalAmount)}</span>
        </div>
      </div>

      <div className="text-center text-sm mb-4 border-t dark:border-gray-700 pt-3 receipt-footer">
        <p className="font-medium">
          Método de pago: {getPaymentMethodText(sale.paymentMethod)}
        </p>
        {renderPaymentDetails()}
        <p className="mt-3">¡Gracias por su compra!</p>
        <p className="text-xs mt-1">{APP_CONFIG.receiptCopyright}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center no-print">
        <button
          ref={printButtonRef}
          onClick={onPrint}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center no-print"
          aria-label="Imprimir recibo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Imprimir</span>
          <kbd className="ml-2 px-1 bg-blue-700 dark:bg-blue-800 text-xs rounded">
            Alt+P
          </kbd>
        </button>

        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center no-print"
            aria-label="Descargar PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clipRule="evenodd"
              />
            </svg>
            <span>Descargar PDF</span>
          </button>
        )}

        {onSendEmail && (
          <button
            onClick={onSendEmail}
            className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center no-print"
            aria-label="Enviar por email"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>Enviar por Email</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center no-print"
          aria-label="Cerrar recibo"
        >
          <span>Cerrar</span>
          <kbd className="ml-2 px-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
            Alt+X
          </kbd>
        </button>
      </div>
    </div>
  );
};

export default SaleReceipt;
 