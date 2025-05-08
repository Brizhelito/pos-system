import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import { Customer, CartItem, PaymentMethod } from "../types";
import { Button } from "@/components/ui/button";
import { TAX_CONFIG } from "@/utils/constants";

interface SaleConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customer: Customer | null;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  total: number;
  paymentDetails: Record<string, string>;
  isProcessing?: boolean;
}

const getPaymentMethodText = (method: PaymentMethod): string => {
  const methodTexts: Record<PaymentMethod, string> = {
    [PaymentMethod.EFECTIVO]: "Efectivo",
    [PaymentMethod.PAGO_MOVIL]: "Pago Móvil",
    [PaymentMethod.TRANSFERENCIA]: "Transferencia Bancaria",
    [PaymentMethod.PUNTO_DE_VENTA]: "Punto de Venta",
  };
  return methodTexts[method];
};

const renderPaymentDetails = (
  method: PaymentMethod,
  details: Record<string, string>
) => {
  if (!details) return null;

  switch (method) {
    case PaymentMethod.EFECTIVO:
      return details.amountReceived ? (
        <div className="mt-1">
          <p className="text-sm">
            Monto recibido: {formatCurrency(parseFloat(details.amountReceived))}
          </p>
          <p className="text-sm">
            Cambio:{" "}
            {formatCurrency(
              parseFloat(details.amountReceived) -
                parseFloat(details.total || "0")
            )}
          </p>
        </div>
      ) : null;

    case PaymentMethod.PAGO_MOVIL:
      return (
        <div className="mt-1">
          <p className="text-sm">Teléfono: {details.phoneNumber}</p>
          <p className="text-sm">Banco: {details.bank}</p>
          <p className="text-sm">Referencia: {details.reference}</p>
        </div>
      );

    case PaymentMethod.TRANSFERENCIA:
      return (
        <div className="mt-1">
          <p className="text-sm">Banco origen: {details.sourceBank}</p>
          <p className="text-sm">Banco destino: {details.targetBank}</p>
          <p className="text-sm">Referencia: {details.reference}</p>
        </div>
      );

    case PaymentMethod.PUNTO_DE_VENTA:
      return (
        <div className="mt-1">
          <p className="text-sm">Banco: {details.bank}</p>
          <p className="text-sm">Últimos 4 dígitos: {details.lastDigits}</p>
          <p className="text-sm">Referencia: {details.reference}</p>
        </div>
      );

    default:
      return null;
  }
};

const SaleConfirmationDialog: React.FC<SaleConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customer,
  items,
  paymentMethod,
  total,
  paymentDetails,
  isProcessing = false,
}) => {
  // Manejar teclas para navegación accesible
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm();
    }
  };

  // Si no hay cliente, no debería abrirse el diálogo
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-auto"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Confirmar Venta</DialogTitle>
          <DialogDescription>
            Por favor verifique los detalles de la venta antes de procesarla.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Datos del Cliente */}
          <div className="border-b pb-3">
            <h3 className="font-bold text-md mb-2">Datos del Cliente</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Nombre:</span>
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

          {/* Resumen de Productos */}
          <div className="border-b pb-3">
            <h3 className="font-bold text-md mb-2">
              Productos ({items.length})
            </h3>
            <div className="max-h-40 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-right">Precio</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.product.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="text-right">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="border-b pb-3">
            <h3 className="font-bold text-md mb-2">Método de Pago</h3>
            <p className="font-medium text-sm">
              {getPaymentMethodText(paymentMethod)}
            </p>
            {renderPaymentDetails(paymentMethod, {
              ...paymentDetails,
              total: total.toString(),
            })}
          </div>

          {/* Totales */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(total * (1 - TAX_CONFIG.rate))}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {TAX_CONFIG.label} ({TAX_CONFIG.percentage}):
              </span>
              <span>{formatCurrency(total * TAX_CONFIG.rate)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={isProcessing}>
              Revisar
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Confirmar y Procesar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaleConfirmationDialog;
