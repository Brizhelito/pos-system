"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SaleItem } from "@/types/Sale";
import { Customer } from "@/types/Customer";
import { $Enums } from "@prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  Banknote, 
  Building, 
  CheckCircle2,
  CreditCard, 
  Loader2,
  Receipt, 
  User,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";

interface SaleConfirmationProps {
  customer: Customer;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: $Enums.sale_paymentMethod;
  onCompleteSale?: () => void;
  onConfirm?: (saleData: any) => Promise<void>;
  onCancel?: () => void;
  onBack?: () => void;
}

export function CompactSaleConfirmation({ 
  customer, 
  items, 
  totalAmount,
  paymentMethod,
  onCompleteSale,
  onConfirm,
  onCancel,
  onBack
}: SaleConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Teclas rápidas para confirmar y volver atrás
  useHotkeys('alt+enter', () => handleConfirmSale(), {
    enableOnFormTags: false,
    enabled: !isSubmitting && !isCompleted && (!!onConfirm || !!onCompleteSale),
    preventDefault: true
  });

  useHotkeys('escape', () => onBack && onBack(), {
    enableOnFormTags: false,
    enabled: !isSubmitting && !isCompleted && !!onBack,
    preventDefault: true
  });

  useHotkeys('alt+c', () => onCancel && onCancel(), {
    enableOnFormTags: false,
    enabled: !isSubmitting && !isCompleted && !!onCancel,
    preventDefault: true
  });

  // Get payment method icon and label
  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case $Enums.sale_paymentMethod.CASH:
        return { 
          icon: <Banknote className="h-3.5 w-3.5 text-amber-500" />, 
          label: "Efectivo",
          color: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
        };
      case $Enums.sale_paymentMethod.CARD:
        return { 
          icon: <CreditCard className="h-3.5 w-3.5 text-blue-500" />, 
          label: "Tarjeta",
          color: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
        };
      case $Enums.sale_paymentMethod.TRANSFER:
        return { 
          icon: <Building className="h-3.5 w-3.5 text-emerald-500" />, 
          label: "Transferencia",
          color: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
        };
      case $Enums.sale_paymentMethod.OTHER:
        return { 
          icon: <Receipt className="h-3.5 w-3.5 text-purple-500" />, 
          label: "Otro",
          color: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
        };
      default:
        return { 
          icon: <Banknote className="h-3.5 w-3.5 text-gray-500" />, 
          label: "Desconocido",
          color: "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300"
        };
    }
  };

  const paymentInfo = getPaymentMethodInfo();

  // Función para manejar la confirmación de la venta
  const handleConfirmSale = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (onConfirm) {
        // Datos de la venta a enviar
        const saleData = {
          customer,
          items,
          totalAmount,
          paymentMethod,
          date: new Date(),
          // Aquí podrías agregar más datos si necesitas
        };
        
        await onConfirm(saleData);
      }
      
      // Si todo sale bien, marcar como completado
      setIsCompleted(true);
      
      // Llamar al callback si existe
      if (onCompleteSale) {
        onCompleteSale();
      }
    } catch (error) {
      console.error("Error al confirmar la venta:", error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular subtotal e impuestos
  const subtotal = totalAmount;
  const taxAmount = totalAmount * 0.18;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="space-y-2">
      {/* Resumen compacto */}
      <div className="flex justify-between">
        {/* Información del cliente */}
        <Card className="w-[49%] border-muted shadow-sm overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-1 mb-1">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Cliente</span>
            </div>
            <div className="text-sm font-medium truncate">{customer.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {customer.cedula}
            </div>
          </div>
        </Card>
        
        {/* Información del pago */}
        <Card className="w-[49%] border-muted shadow-sm overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-1 mb-1">
              <CircleDollarSign className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Método de pago</span>
            </div>
            <div className="flex items-center gap-1.5">
              {paymentInfo.icon}
              <span className="text-sm font-medium">{paymentInfo.label}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total: ${grandTotal.toFixed(2)}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Resumen de productos */}
      <Card className="border-muted shadow-sm">
        <CardContent className="p-0">
          <div className="p-2 border-b bg-muted/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Resumen de compra</span>
              <Badge variant="outline" className="text-[10px] h-5">
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="max-h-[25vh]">
            <div className="p-2">
              {items.map((item, index) => (
                <div 
                  key={`${item.productId}-${index}`}
                  className={cn(
                    "py-1 flex justify-between items-center text-xs",
                    index !== items.length - 1 && "border-b border-dashed border-border"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">Producto #{item.productId}</div>
                    <div className="text-muted-foreground">
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Totales */}
          <div className="p-2 border-t bg-muted/10 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>ITBIS (18%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Aviso y botones */}
      <div className="flex flex-col gap-2">
        <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-2">
          <div className="flex gap-1.5 items-center">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-400">
              Verifique que todos los datos sean correctos antes de completar la venta.
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          {onBack && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack} 
              className="h-7 px-2 text-xs"
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Volver
            </Button>
          )}
          
          <div className="text-center flex-grow flex flex-wrap justify-center">
            <div className="text-[10px] text-muted-foreground">
              <kbd className="px-1 py-0.5 bg-muted/50 rounded">Alt+Enter: Completar</kbd>
            </div>
          </div>
          
          <Button 
            size="sm" 
            onClick={handleConfirmSale}
            disabled={isSubmitting}
            className="h-8 px-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                <span className="text-xs">Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Completar Venta</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
