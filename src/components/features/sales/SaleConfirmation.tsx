import { motion } from "framer-motion";
import { SaleItem } from "@/types/Sale";
import { Customer } from "@/types/Customer";
import { $Enums } from "@prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Banknote, Building, Receipt, User, ShoppingBag, Calendar } from "lucide-react";

interface SaleConfirmationProps {
  customer: Customer;
  items: SaleItem[];
  paymentMethod: $Enums.PaymentMethod;
  totalAmount: number;
}

export function SaleConfirmation({ customer, items, paymentMethod, totalAmount }: SaleConfirmationProps) {
  // Get payment method icon and label
  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case $Enums.PaymentMethod.CASH:
        return { icon: <Banknote className="h-5 w-5" />, label: "Efectivo" };
      case $Enums.PaymentMethod.CARD:
        return { icon: <CreditCard className="h-5 w-5" />, label: "Tarjeta" };
      case $Enums.PaymentMethod.TRANSFER:
        return { icon: <Building className="h-5 w-5" />, label: "Transferencia" };
      case $Enums.PaymentMethod.OTHER:
        return { icon: <Receipt className="h-5 w-5" />, label: "Otro" };
      default:
        return { icon: <Banknote className="h-5 w-5" />, label: "Desconocido" };
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Nombre:</span> {customer.name}
            </div>
            {customer.email && (
              <div>
                <span className="font-medium">Email:</span> {customer.email}
              </div>
            )}
            {customer.phone && (
              <div>
                <span className="font-medium">Teléfono:</span> {customer.phone}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">Producto #{item.productId}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <Separator className="my-4" />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {paymentInfo.icon}
              Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-base px-3 py-1">
              {paymentInfo.label}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Detalles de la Venta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Fecha:</span>{" "}
              {/* Usamos un formato estático para evitar errores de hidratación */}
              <span suppressHydrationWarning>
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div>
              <span className="font-medium">Número de productos:</span> {items.length}
            </div>
            <div>
              <span className="font-medium">Cantidad de artículos:</span>{" "}
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </div>

            <Separator className="my-2" />

            <div className="bg-primary/10 p-4 rounded-md">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total a Pagar:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
