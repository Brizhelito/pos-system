import { useState } from "react";
import { motion } from "framer-motion";
import { $Enums } from "@prisma";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Banknote, 
  Building, 
  Receipt, 
  Calculator, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentMethodProps {
  selectedMethod: $Enums.sale_paymentMethod;
  onSelectMethod: (method: $Enums.sale_paymentMethod) => void;
  totalAmount: number;
  onContinue?: () => void;
  onBack?: () => void;
}

// Payment method options with icons and descriptions - optimized for compact display
const paymentOptions = [
  {
    value: $Enums.sale_paymentMethod.CASH,
    label: "Efectivo",
    icon: <Banknote className="h-4 w-4 text-purple-500" />,
    description: "Pago en efectivo",
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    shadow: "group-hover:shadow-purple-200 dark:group-hover:shadow-purple-900/30",
    shortcut: "Alt+1"
  },
  {
    value: $Enums.sale_paymentMethod.CARD,
    label: "Tarjeta",
    icon: <CreditCard className="h-4 w-4 text-blue-500" />,
    description: "Crédito o débito",
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    shadow: "group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/30",
    shortcut: "Alt+2"
  },
  {
    value: $Enums.sale_paymentMethod.TRANSFER,
    label: "Transferencia",
    icon: <Building className="h-4 w-4 text-emerald-500" />,
    description: "Transf. bancaria",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    shadow: "group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900/30",
    shortcut: "Alt+3"
  },
  {
    value: $Enums.sale_paymentMethod.OTHER,
    label: "Otro",
    icon: <Receipt className="h-4 w-4 text-amber-500" />,
    description: "Otro método",
    color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    shadow: "group-hover:shadow-amber-200 dark:group-hover:shadow-amber-900/30",
    shortcut: "Alt+4"
  },
];

export function CompactPaymentMethod({ 
  selectedMethod, 
  onSelectMethod,
  totalAmount,
  onContinue,
  onBack
}: PaymentMethodProps) {
  const [cashAmount, setCashAmount] = useState<number>(totalAmount);
  
  // Calculate change amount for cash payments
  const changeAmount = cashAmount - totalAmount;

  // Implementar atajos de teclado para selección rápida de métodos de pago y navegación
  useHotkeys('alt+1', () => {
    onSelectMethod($Enums.sale_paymentMethod.CASH);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true
  });
  
  useHotkeys('alt+2', () => {
    onSelectMethod($Enums.sale_paymentMethod.CARD);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true
  });
  
  useHotkeys('alt+3', () => {
    onSelectMethod($Enums.sale_paymentMethod.TRANSFER);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true
  });
  
  useHotkeys('alt+4', () => {
    onSelectMethod($Enums.sale_paymentMethod.OTHER);
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true
  });
  
  useHotkeys('alt+enter', () => {
    if (onContinue) onContinue();
  }, {
    enableOnFormTags: true,
    enabled: !!onContinue,
    preventDefault: true
  });
  
  useHotkeys('esc', () => {
    if (onBack) onBack();
  }, {
    enableOnFormTags: true,
    enabled: !!onBack,
    preventDefault: true
  });

  return (
    <div className="space-y-2">
      {/* Total con formato compacto */}
      <div className="flex justify-between items-center rounded-md bg-muted/30 p-2">
        <div className="flex items-center gap-1">
          <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">Total a pagar:</span>
        </div>
        <div className="text-lg font-bold">
          ${(totalAmount * 1.18).toFixed(2)}
        </div>
      </div>
      
      {/* Selección de método de pago */}
      <div className="grid grid-cols-2 gap-1">
        {paymentOptions.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "group cursor-pointer transition-all hover:scale-[1.01] border hover:shadow-sm",
              selectedMethod === option.value ? `${option.color} border-2` : "bg-card"
            )}
            onClick={() => onSelectMethod(option.value)}
          >
            <div className="p-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  {option.icon}
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {option.shortcut}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {option.description}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Detalles específicos del método de pago seleccionado */}
      {selectedMethod === $Enums.sale_paymentMethod.CASH && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-muted/20 border rounded-md p-2 space-y-2">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Label htmlFor="cashAmount" className="text-xs mb-1 block">
                  Monto recibido
                </Label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="cashAmount"
                    type="number"
                    className="pl-6 h-8 text-sm"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    min={totalAmount}
                    step={0.01}
                  />
                </div>
              </div>
              <div className="flex-1">
                <Label className="text-xs mb-1 block">
                  Cambio a devolver
                </Label>
                <div className={cn(
                  "rounded-md border h-8 px-2 flex items-center",
                  changeAmount >= 0 ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                )}>
                  <span className="text-sm font-medium">
                    ${changeAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {selectedMethod === $Enums.sale_paymentMethod.CARD && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-muted/20 border rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="cardNumber" className="text-xs mb-1 block">
                  Últimos 4 dígitos
                </Label>
                <Input
                  id="cardNumber"
                  className="h-8 text-sm"
                  placeholder="0000"
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="authCode" className="text-xs mb-1 block">
                  Código de autorización
                </Label>
                <Input
                  id="authCode"
                  className="h-8 text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {selectedMethod === $Enums.sale_paymentMethod.TRANSFER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-muted/20 border rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="transferCode" className="text-xs mb-1 block">
                  Referencia
                </Label>
                <Input
                  id="transferCode"
                  className="h-8 text-sm"
                  placeholder="# de transferencia"
                />
              </div>
              <div>
                <Label htmlFor="paymentDate" className="text-xs mb-1 block">
                  Fecha
                </Label>
                <Input
                  type="date"
                  id="paymentDate"
                  className="h-8 text-sm"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {selectedMethod === $Enums.sale_paymentMethod.OTHER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-muted/20 border rounded-md p-2">
            <div>
              <Label htmlFor="otherMethod" className="text-xs mb-1 block">
                Descripción
              </Label>
              <Input
                id="otherMethod"
                className="h-8 text-sm"
                placeholder="Especificar tipo de pago"
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Botones de navegación + consejos compactos */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex-shrink-0">
          {onBack && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack} 
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Volver
            </Button>
          )}
        </div>
        
        <div className="text-center flex-grow flex flex-wrap justify-center gap-x-2">
          <div className="text-[10px] text-muted-foreground flex gap-1 flex-wrap justify-center">
            <kbd className="px-1 py-0.5 bg-muted/50 rounded">Alt+1..4: Seleccionar</kbd>
            <kbd className="px-1 py-0.5 bg-muted/50 rounded">Enter: Confirmar</kbd>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {onContinue && (
            <Button 
              size="sm" 
              onClick={onContinue} 
              disabled={!selectedMethod}
              className="h-7 px-2 text-xs"
            >
              Continuar
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
