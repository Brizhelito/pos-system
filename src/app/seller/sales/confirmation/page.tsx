"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSalesContext } from "@/contexts/SalesContext";
import { SaleConfirmation } from "@/components/features/sales/SaleConfirmation";
import { SalesStep } from "@/types/SalesFlow";
import { SalesStepIndicator } from "@/components/features/sales/SalesStepIndicator";

export default function ConfirmationPage() {
  const router = useRouter();
  const { 
    state: { selectedCustomer, cartItems, paymentMethod, currentStep }, 
    setCurrentStep,
    completeSale,
    resetSale
  } = useSalesContext();

  // Validar que existe un cliente seleccionado, productos en el carrito y un método de pago
  useEffect(() => {
    if (!selectedCustomer) {
      router.push("/seller/sales/customer");
    } else if (cartItems.length === 0) {
      router.push("/seller/sales/products");
    } else if (!paymentMethod) {
      router.push("/seller/sales/payment");
    }
  }, [selectedCustomer, cartItems, paymentMethod, router]);

  // Actualizar el paso actual en el contexto
  useEffect(() => {
    // Solo actualizar si no estamos ya en el CONFIRMATION
    if (currentStep !== SalesStep.CONFIRMATION) {
      setCurrentStep(SalesStep.CONFIRMATION);
    }
  }, [currentStep, setCurrentStep]);

  const handleConfirm = async (saleData: any) => {
    // Al completar la venta, establecer el estado para mostrar el estado de completado
    await completeSale();
    router.push("/seller/sales?completed=true");
  };

  const handleCancel = () => {
    if (window.confirm("¿Está seguro de que desea cancelar esta venta? Se perderán todos los datos.")) {
      resetSale();
      router.push("/seller/sales");
    }
  };

  const handleBack = () => {
    router.push("/seller/sales/payment");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <SalesStepIndicator />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Confirmar Venta</h1>
        <p className="text-muted-foreground mt-2">
          Verifique los detalles de la venta antes de confirmar.
        </p>
      </div>
      
      <SaleConfirmation 
        customer={selectedCustomer!}
        items={cartItems}
        totalAmount={cartItems.reduce((total, item) => total + item.subtotal, 0)}
        paymentMethod={paymentMethod!}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onBack={handleBack}
      />
    </div>
  );
}
