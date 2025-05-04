import { useState } from "react";
import { motion } from "framer-motion";
import { $Enums } from "@prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Building, Receipt } from "lucide-react";

interface PaymentMethodProps {
  selectedMethod: $Enums.PaymentMethod;
  onSelectMethod: (method: $Enums.PaymentMethod) => void;
  totalAmount: number;
}

// Payment method options with icons and descriptions
const paymentOptions = [
  {
    value: $Enums.PaymentMethod.CASH,
    label: "Efectivo",
    icon: <Banknote className="h-5 w-5" />,
    description: "Pago en efectivo al momento de la venta",
  },
  {
    value: $Enums.PaymentMethod.CARD,
    label: "Tarjeta",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Pago con tarjeta de crédito o débito",
  },
  {
    value: $Enums.PaymentMethod.TRANSFER,
    label: "Transferencia",
    icon: <Building className="h-5 w-5" />,
    description: "Transferencia directa a cuenta bancaria",
  },
  {
    value: $Enums.PaymentMethod.OTHER,
    label: "Otro",
    icon: <Receipt className="h-5 w-5" />,
    description: "Otro método de pago",
  },
];

export function PaymentMethod({ selectedMethod, onSelectMethod, totalAmount }: PaymentMethodProps) {
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Resumen de la Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total a Pagar:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Seleccione el Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => onSelectMethod(value as $Enums.PaymentMethod)}
            className="space-y-3"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {paymentOptions.map((option) => (
                <motion.div key={option.value} variants={itemVariants}>
                  <div className={`flex items-center space-x-2 rounded-md border p-4 ${selectedMethod === option.value ? 'border-primary bg-primary/5' : ''}`}>
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-1 items-center gap-3 cursor-pointer"
                    >
                      <div className="text-primary">{option.icon}</div>
                      <div className="grid gap-0.5">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
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
      {selectedMethod === $Enums.PaymentMethod.CASH && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detalles del Pago en Efectivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cashAmount">Monto Recibido</Label>
                <Input
                  id="cashAmount"
                  type="number"
                  min={totalAmount}
                  step="0.01"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || totalAmount)}
                  className="text-right"
                />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-medium">Total a Pagar:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Monto Recibido:</span>
                <span>${cashAmount.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Cambio:</span>
                <span className={changeAmount >= 0 ? "text-green-600" : "text-red-600"}>
                  ${changeAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Credit card payment details */}
      {selectedMethod === $Enums.PaymentMethod.CARD && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detalles del Pago con Tarjeta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <Input
                  id="cardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/AA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="XXX"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cardholderName">Nombre del Titular</Label>
                <Input
                  id="cardholderName"
                  placeholder="Nombre como aparece en la tarjeta"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bank transfer payment details */}
      {selectedMethod === $Enums.PaymentMethod.TRANSFER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detalles de la Transferencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Información Bancaria</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Banco:</span> Banco Nacional</p>
                  <p><span className="font-medium">Titular:</span> Mi Empresa S.A.</p>
                  <p><span className="font-medium">Cuenta:</span> 1234-5678-9012-3456</p>
                  <p><span className="font-medium">CLABE:</span> 012345678901234567</p>
                  <p><span className="font-medium">Referencia:</span> Venta-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transferReference">Referencia de Transferencia</Label>
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
      {selectedMethod === $Enums.PaymentMethod.OTHER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detalles de la Factura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="invoiceNotes">Notas de Facturación</Label>
                <Input
                  id="invoiceNotes"
                  placeholder="Información adicional para la factura"
                />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  La venta se registrará como pendiente de pago. El cliente tendrá hasta la fecha de vencimiento para realizar el pago.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
