"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSalesContext } from "@/contexts/SalesContext";
import { CustomerSearch } from "@/components/features/sales/CustomerSearch";
import { SalesStep } from "@/types/SalesFlow";
import { SalesStepIndicator } from "@/components/features/sales/SalesStepIndicator";

export default function CustomerSelectionPage() {
  const router = useRouter();
  const { 
    state, 
    setSelectedCustomer, 
    setCurrentStep 
  } = useSalesContext();

  // Actualizar el paso actual en el contexto
  useEffect(() => {
    // Solo actualizar si no estamos ya en el CUSTOMER_SEARCH
    if (state.currentStep !== SalesStep.CUSTOMER_SEARCH) {
      setCurrentStep(SalesStep.CUSTOMER_SEARCH);
    }
  }, [state, setCurrentStep]);

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const handleContinue = () => {
    if (!state.selectedCustomer) {
      return;
    }
    router.push("/seller/sales/products");
  };

  const handleBack = () => {
    router.push("/seller/sales");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <SalesStepIndicator />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Selección de Cliente</h1>
        <p className="text-muted-foreground mt-2">
          Seleccione un cliente para continuar con la venta o cree uno nuevo.
        </p>
      </div>
      
      <CustomerSearch 
        selectedCustomer={state.selectedCustomer}
        onSelectCustomer={handleSelectCustomer}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    </div>
  );
}
