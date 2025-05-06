"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSalesContext } from "@/contexts/SalesContext";
import { PaymentMethod } from "@/components/features/sales/PaymentMethod";
import { SalesStep } from "@/types/SalesFlow";
import { SalesStepIndicator } from "@/components/features/sales/SalesStepIndicator";
import { $Enums } from "@prisma";
import { CompactPaymentMethod } from "@/components/features/sales/CompactPaymentMethod";

export default function PaymentMethodPage() {
  const router = useRouter();
  const { 
    state: { selectedCustomer, cartItems, paymentMethod, currentStep }, 
    setCurrentStep,
    setPaymentMethod
  } = useSalesContext();

  // Validar que existe un cliente seleccionado y productos en el carrito
  useEffect(() => {
    if (!selectedCustomer) {
      router.push("/seller/sales/customer");
    } else if (cartItems.length === 0) {
      router.push("/seller/sales/products");
    }
  }, [selectedCustomer, cartItems, router]);

  // Actualizar el paso actual en el contexto
  useEffect(() => {
    // Solo actualizar si no estamos ya en el PAYMENT_METHOD
    if (currentStep !== SalesStep.PAYMENT_METHOD) {
      setCurrentStep(SalesStep.PAYMENT_METHOD);
    }
  }, [currentStep, setCurrentStep]);

  const handleContinue = () => {
    router.push("/seller/sales/confirmation");
  };

  const handleBack = () => {
    router.push("/seller/sales/products");
  };

  // Calcular el total
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <SalesStepIndicator />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Método de Pago</h1>
        <p className="text-muted-foreground mt-2">
          Seleccione el método de pago para completar la venta.
        </p>
        <div className="bg-muted/40 py-2 px-4 rounded-md mt-2 inline-block">
          Cliente: <span className="font-semibold">{selectedCustomer?.name}</span> | 
          Total: <span className="font-semibold">${totalAmount.toFixed(2)}</span> | 
          Productos: <span className="font-semibold">{cartItems.length}</span>
        </div>
      </div>
      
      <PaymentMethod
        selectedMethod={paymentMethod || $Enums.sale_paymentMethod.CASH}
        onSelectMethod={setPaymentMethod}
        totalAmount={totalAmount}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    </div>
  );
}
