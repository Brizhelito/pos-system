import { useState } from "react";
import { motion } from "framer-motion";
import { $Enums } from "@prisma";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Banknote, 
  Building, 
  Receipt, 
  Calculator, 
  Calendar, 
  CreditCardIcon, 
  CircleDollarSign,
  FileText,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";

interface PaymentMethodProps {
  selectedMethod: $Enums.sale_paymentMethod;
  onSelectMethod: (method: $Enums.sale_paymentMethod) => void;
  totalAmount: number;
  onContinue?: () => void;
  onBack?: () => void;
}

// Payment method options with icons and descriptions
const paymentOptions = [
  {
    value: $Enums.sale_paymentMethod.CASH,
    label: "Efectivo",
    icon: <Banknote className="h-5 w-5 text-purple-500" />,
    description: "Pago en efectivo al momento de la venta",
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    shadow: "group-hover:shadow-purple-200 dark:group-hover:shadow-purple-900/30"
  },
  {
    value: $Enums.sale_paymentMethod.CARD,
    label: "Tarjeta",
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    description: "Pago con tarjeta de crédito o débito",
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    shadow: "group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/30"
  },
  {
    value: $Enums.sale_paymentMethod.TRANSFER,
    label: "Transferencia",
    icon: <Building className="h-5 w-5 text-emerald-500" />,
    description: "Transferencia directa a cuenta bancaria",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    shadow: "group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900/30"
  },
  {
    value: $Enums.sale_paymentMethod.OTHER,
    label: "Otro",
    icon: <Receipt className="h-5 w-5 text-amber-500" />,
    description: "Otro método de pago",
    color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    shadow: "group-hover:shadow-amber-200 dark:group-hover:shadow-amber-900/30"
  },
];

export function PaymentMethod({ 
  selectedMethod, 
  onSelectMethod,
  totalAmount,
  onContinue,
  onBack
}: PaymentMethodProps) {
  const [cashAmount, setCashAmount] = useState<number>(totalAmount);
  
  // Calculate change amount for cash payments
  const changeAmount = cashAmount - totalAmount;

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

  // Implementar atajos de teclado para selección rápida de métodos de pago y navegación
  useHotkeys('alt+1', () => {
    onSelectMethod($Enums.sale_paymentMethod.CASH);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Seleccionar Efectivo'
  });
  
  useHotkeys('alt+2', () => {
    onSelectMethod($Enums.sale_paymentMethod.CARD);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Seleccionar Tarjeta'
  });
  
  useHotkeys('alt+3', () => {
    onSelectMethod($Enums.sale_paymentMethod.TRANSFER);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Seleccionar Transferencia'
  });
  
  useHotkeys('alt+4', () => {
    onSelectMethod($Enums.sale_paymentMethod.OTHER);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Seleccionar Otro método'
  });
  
  useHotkeys('alt+enter', () => {
    if (onContinue && selectedMethod) {
      onContinue();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!onContinue && !!selectedMethod,
    preventDefault: true,
    description: 'Continuar'
  });
  
  useHotkeys('escape', () => {
    if (onBack) {
      onBack();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!onBack,
    preventDefault: true,
    description: 'Volver'
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md border overflow-hidden">
          <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <CircleDollarSign className="h-5 w-5 text-purple-500 mr-2" />
                Resumen de la Venta
              </CardTitle>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
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
                <span>Total a Pagar:</span>
                <span>${(totalAmount * 1.18).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="shadow-md border overflow-hidden">
        <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
          <CardTitle className="text-base flex items-center">
            <CreditCardIcon className="h-5 w-5 text-purple-500 mr-2" />
            Seleccione el Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => onSelectMethod(value as $Enums.sale_paymentMethod)}
            className="grid gap-3"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {paymentOptions.map((option) => (
                <motion.div 
                  key={option.value} 
                  variants={itemVariants}
                  className="group"
                >
                  <div 
                    className={`flex items-center space-x-2 rounded-xl border-2 p-3 transition-all 
                    ${selectedMethod === option.value 
                      ? `${option.color} shadow-md` 
                      : 'hover:border-muted-foreground/20 hover:bg-muted/50'}`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="data-[state=checked]:border-purple-500 data-[state=checked]:text-purple-500" />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-1 items-center gap-2 cursor-pointer"
                    >
                      <div className="rounded-full p-1.5">{option.icon}</div>
                      <div className="grid gap-0.5">
                        <span className="font-medium text-sm">{option.label}</span>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {option.description}
                        </span>
                      </div>
                    </Label>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Cash payment details */}
      {selectedMethod === $Enums.sale_paymentMethod.CASH && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
              <CardTitle className="text-base flex items-center">
                <Calculator className="h-5 w-5 text-purple-500 mr-2" />
                Detalles del Pago en Efectivo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cashAmount" className="text-sm">Monto Recibido</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="cashAmount"
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                      className="pl-7"
                      min={totalAmount}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Cambio a Devolver</Label>
                  <div className="h-10 rounded-md border border-input px-3 py-2 flex items-center bg-muted/30">
                    <span className="text-muted-foreground mr-1">$</span>
                    <span className={`font-mono font-medium ${changeAmount < 0 ? 'text-destructive' : ''}`}>
                      {changeAmount < 0 ? '0.00' : changeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {changeAmount < 0 && (
                <div className="rounded-md border border-destructive/50 p-3 bg-destructive/10 text-destructive text-sm">
                  El monto recibido debe ser igual o mayor al total a pagar.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Card payment details */}
      {selectedMethod === $Enums.sale_paymentMethod.CARD && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
              <CardTitle className="text-base flex items-center">
                <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                Detalles del Pago con Tarjeta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber" className="text-sm">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate" className="text-sm">Fecha Exp.</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/AA"
                      className="font-mono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv" className="text-sm">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="XXX"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cardholderName" className="text-sm">Nombre del Titular</Label>
                <Input
                  id="cardholderName"
                  placeholder="Nombre como aparece en la tarjeta"
                />
              </div>
              
              <div className="rounded-md border p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm">
                <p className="flex items-start gap-2">
                  <CreditCard className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    La información de la tarjeta solo se utiliza para procesar la venta y no se almacena en nuestros servidores.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bank transfer payment details */}
      {selectedMethod === $Enums.sale_paymentMethod.TRANSFER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
              <CardTitle className="text-base flex items-center">
                <Building className="h-5 w-5 text-purple-500 mr-2" />
                Detalles de la Transferencia
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-medium text-sm mb-3 text-emerald-800 dark:text-emerald-300">Información Bancaria</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 border-b pb-1 border-emerald-200 dark:border-emerald-800">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Banco:</span>
                    <span className="col-span-2 text-emerald-900 dark:text-emerald-200">Banco Nacional</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-1 border-emerald-200 dark:border-emerald-800">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Titular:</span>
                    <span className="col-span-2 text-emerald-900 dark:text-emerald-200">Mi Empresa S.A.</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-1 border-emerald-200 dark:border-emerald-800">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Cuenta:</span>
                    <span className="col-span-2 text-emerald-900 dark:text-emerald-200 font-mono">1234-5678-9012-3456</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-1 border-emerald-200 dark:border-emerald-800">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">CLABE:</span>
                    <span className="col-span-2 text-emerald-900 dark:text-emerald-200 font-mono">012345678901234567</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-1 border-emerald-200 dark:border-emerald-800">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Referencia:</span>
                    <span className="col-span-2 text-emerald-900 dark:text-emerald-200 font-mono">Venta-{Date.now().toString().slice(-6)}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transferReference" className="text-sm">Referencia de Transferencia</Label>
                <Input
                  id="transferReference"
                  placeholder="Ingrese el número de referencia"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Invoice payment details */}
      {selectedMethod === $Enums.sale_paymentMethod.OTHER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
              <CardTitle className="text-base flex items-center">
                <FileText className="h-5 w-5 text-purple-500 mr-2" />
                Detalles del Otro Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate" className="text-sm">Fecha de Vencimiento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dueDate"
                      type="date"
                      className="pl-8"
                      defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentType" className="text-sm">Tipo de Pago</Label>
                  <Input
                    id="paymentType"
                    placeholder="Ej: Letra de cambio, Cheque, etc."
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="invoiceNotes" className="text-sm">Notas de Facturación</Label>
                <Input
                  id="invoiceNotes"
                  placeholder="Información adicional para la factura"
                />
              </div>

              <div className="flex p-3 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
                <span className="text-amber-800 dark:text-amber-300 text-sm">
                  La venta se registrará como pendiente de pago. El cliente tendrá hasta la fecha de vencimiento para realizar el pago.
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Sección de atajos de teclado */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
        <h3 className="text-sm font-medium mb-2">Atajos de teclado:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-background border rounded">Alt+1</kbd>
            <span>Efectivo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-background border rounded">Alt+2</kbd>
            <span>Tarjeta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-background border rounded">Alt+3</kbd>
            <span>Transferencia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-background border rounded">Alt+4</kbd>
            <span>Otro</span>
          </div>
        </div>
      </div>
      
      {/* Footer con botones de navegación */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-950 border-t p-4 flex justify-between mt-auto">
        <div>
          {onBack && (
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Atrás</span>
              <span className="ml-1 text-xs opacity-70">(Esc)</span>
            </Button>
          )}
        </div>
        
        <div>
          {onContinue && (
            <Button 
              onClick={onContinue} 
              disabled={!selectedMethod}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4" />
              <span className="ml-1 text-xs opacity-70">(Alt+Enter)</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
