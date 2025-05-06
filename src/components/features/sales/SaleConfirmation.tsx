"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SaleItem } from "@/types/Sale";
import { Customer } from "@/types/Customer";
import { $Enums } from "@prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertCircle,
  Banknote,
  Building,
  CheckCircle2,
  CreditCard,
  Loader2,
  Printer,
  Receipt,
  Send,
  ShoppingBag,
  User,
  CircleDollarSign,
  Mail,
  Phone,
  ArrowLeft,
  X,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

interface SaleConfirmationProps {
  customer: Customer;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: $Enums.sale_paymentMethod;
  onCompleteSale?: () => void;
  onConfirm?: (saleData: {
    customer: Customer;
    items: SaleItem[];
    totalAmount: number;
    paymentMethod: $Enums.sale_paymentMethod;
    totalWithTax: number;
  }) => Promise<void>;
  onCancel?: () => void;
  onBack?: () => void;
}

export function SaleConfirmation({ 
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
    preventDefault: true,
    description: 'Confirmar venta'
  });

  useHotkeys('escape', () => onBack && onBack(), {
    enableOnFormTags: false,
    enabled: !isSubmitting && !isCompleted && !!onBack,
    preventDefault: true,
    description: 'Volver atrás'
  });

  useHotkeys('alt+c', () => onCancel && onCancel(), {
    enableOnFormTags: false,
    enabled: !isSubmitting && !isCompleted && !!onCancel,
    preventDefault: true,
    description: 'Cancelar venta'
  });

  // Get payment method icon and label
  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case $Enums.sale_paymentMethod.CASH:
        return { 
          icon: <Banknote className="h-4 w-4 text-amber-500" />, 
          label: "Efectivo",
          color: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
        };
      case $Enums.sale_paymentMethod.CARD:
        return { 
          icon: <CreditCard className="h-4 w-4 text-blue-500" />, 
          label: "Tarjeta",
          color: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
        };
      case $Enums.sale_paymentMethod.TRANSFER:
        return { 
          icon: <Building className="h-4 w-4 text-emerald-500" />, 
          label: "Transferencia",
          color: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
        };
      case $Enums.sale_paymentMethod.OTHER:
        return { 
          icon: <Receipt className="h-4 w-4 text-purple-500" />, 
          label: "Otro",
          color: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
        };
      default:
        return { 
          icon: <Banknote className="h-4 w-4 text-gray-500" />, 
          label: "Desconocido",
          color: "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300"
        };
    }
  };

  const paymentInfo = getPaymentMethodInfo();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Función para manejar la confirmación de la venta
  const handleConfirmSale = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Si existe onConfirm, usamos esa función primero
      if (onConfirm) {
        const saleData = {
          customer,
          items,
          totalAmount,
          paymentMethod,
          totalWithTax: totalAmount * 1.18
        };
        
        await onConfirm(saleData);
        setIsCompleted(true);
      } 
      // Si no hay onConfirm pero hay onCompleteSale, usamos la función legacy
      else if (onCompleteSale) {
        // Simulamos una llamada API para la función legacy
        setTimeout(() => {
          setIsCompleted(true);
          // Esperamos un momento y luego llamamos a onCompleteSale
          setTimeout(() => {
            onCompleteSale();
          }, 2000);
        }, 1500);
      }
    } catch (error) {
      console.error("Error al confirmar la venta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col items-center justify-center py-10 text-center"
      >
        <div className="rounded-full h-20 w-20 bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Venta Completada!</h2>
        <p className="text-muted-foreground mb-8">
          La venta se ha registrado exitosamente en el sistema.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            className="flex items-center gap-2 bg-primary"
            onClick={() => onBack && onBack()}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Nueva Venta</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Imprimir Recibo</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Enviar por Email</span>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={paymentInfo.color}>
            {paymentInfo.icon}
            <span className="ml-1">{paymentInfo.label}</span>
          </Badge>
          
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
            <User className="h-3 w-3 mr-1" />
            Cliente
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 flex items-center"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Atrás</span>
              <span className="ml-1 text-xs opacity-70">(Esc)</span>
            </Button>
          )}
          
          {onCancel && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 flex items-center"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1" />
              <span>Cancelar</span>
              <span className="ml-1 text-xs opacity-70">(Alt+C)</span>
            </Button>
          )}
        </div>
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Information Card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="text-base flex items-center">
                <User className="h-5 w-5 text-blue-500 mr-2" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  {customer.cedula && (
                    <p className="text-muted-foreground text-sm">Cédula: {customer.cedula}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {customer.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Payment Information */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
              <CardTitle className="text-base flex items-center">
                <CircleDollarSign className="h-5 w-5 text-purple-500 mr-2" />
                Detalles del Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 rounded-lg border border-muted bg-muted/20">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    {paymentInfo.icon}
                    <span>{paymentInfo.label}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-right font-mono">${totalAmount.toFixed(2)}</span>
                    
                    <span className="text-muted-foreground">ITBIS (18%):</span>
                    <span className="text-right font-mono">${(totalAmount * 0.18).toFixed(2)}</span>
                    
                    <span className="text-muted-foreground font-medium">Total:</span>
                    <span className="text-right font-medium font-mono">${(totalAmount * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Order Items */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardTitle className="text-base flex items-center">
                <ShoppingBag className="h-5 w-5 text-emerald-500 mr-2" />
                Productos ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="max-h-[300px] overflow-auto pr-2">
                <div className="w-full">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Cant.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={`${item.productId}-${index}`}>
                          <TableCell className="font-medium">
                            Producto #{item.productId}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${item.subtotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-muted/10">
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>ITBIS (18%):</span>
                  <span>${(totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>${(totalAmount * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Confirm Button */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-md border-0 overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm text-amber-800 dark:text-amber-300 mb-1">Confirmar Venta</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Al completar esta venta, se registrará en el sistema y no podrá ser modificada posteriormente. 
                    Verifique que todos los datos sean correctos antes de proceder.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600 h-12 text-white" 
              onClick={handleConfirmSale}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Procesando venta...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Completar Venta</span>
                  <span className="ml-1 text-xs opacity-70">(Alt+Enter)</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
