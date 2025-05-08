"use client";

import { Sale, Customer, CartItem, PaymentMethod } from "../types";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

interface SaleReceiptProps {
  sale: Sale;
  customer: Customer;
  items: CartItem[];
  onClose: () => void;
  onPrint: () => void;
}

const SaleReceipt = ({
  sale,
  customer,
  items,
  onClose,
  onPrint,
}: SaleReceiptProps) => {
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
      onPrint();
      toast.info("Imprimiendo recibo...");
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
      onPrint();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
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
      <div className="flex justify-between items-center mb-4">
        <h2 id="receipt-title" className="text-xl font-bold">
          Recibo de Venta
        </h2>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
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

      <div className="border-t border-b dark:border-gray-700 py-4 mb-4">
        <div className="text-center mb-4">
          <h1 className="font-bold text-lg">EMPRESA XYZ</h1>
          <p className="text-sm">Dirección de la empresa</p>
          <p className="text-sm">RIF: J-12345678-9</p>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Factura No.:</span>
          <span className="font-medium">
            {sale.invoice?.number || `${sale.id}`}
          </span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Fecha:</span>
          <span>{format(new Date(sale.saleDate), "dd/MM/yyyy HH:mm")}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Cliente:</span>
          <span>{customer.name}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Identificación:</span>
          <span>
            {customer.idType} {customer.idNumber}
          </span>
        </div>
      </div>

      <div className="mb-4">
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

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>{formatCurrency(sale.totalAmount * 0.84)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>IVA (16%):</span>
          <span>{formatCurrency(sale.totalAmount * 0.16)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.totalAmount)}</span>
        </div>
      </div>

      <div className="text-center text-sm mb-4 border-t dark:border-gray-700 pt-3">
        <p className="font-medium">
          Método de pago: {getPaymentMethodText(sale.paymentMethod)}
        </p>
        {renderPaymentDetails()}
        <p className="mt-3">¡Gracias por su compra!</p>
        <p className="text-xs mt-1">Le esperamos nuevamente</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
          aria-label="Cerrar recibo"
        >
          <span className="mr-1">Cerrar</span>
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
            Alt+X
          </kbd>
        </button>

        <button
          ref={printButtonRef}
          onClick={onPrint}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
          aria-label="Imprimir recibo"
        >
          <span className="mr-1">Imprimir Recibo</span>
          <kbd className="px-1 bg-blue-700 dark:bg-blue-800 text-xs rounded">
            Alt+P
          </kbd>
        </button>
      </div>
    </div>
  );
};

export default SaleReceipt;
 