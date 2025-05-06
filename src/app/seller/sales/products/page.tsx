"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSalesContext } from "@/contexts/SalesContext";
import { ProductSearch } from "@/components/features/sales/ProductSearch";
import { SalesStep } from "@/types/SalesFlow";
import { SalesStepIndicator } from "@/components/features/sales/SalesStepIndicator";
import { Product } from "@/types/Products";

export default function ProductSelectionPage() {
  const router = useRouter();
  const { 
    state: { selectedCustomer, cartItems, currentStep }, 
    setCurrentStep,
    addToCart,
    removeFromCart,
    updateCartItem
  } = useSalesContext();

  // Validar que existe un cliente seleccionado
  useEffect(() => {
    if (!selectedCustomer) {
      router.push("/seller/sales/customer");
    }
  }, [selectedCustomer, router]);

  // Actualizar el paso actual en el contexto
  useEffect(() => {
    // Solo actualizar si no estamos ya en el PRODUCT_SEARCH
    if (currentStep !== SalesStep.PRODUCT_SEARCH) {
      setCurrentStep(SalesStep.PRODUCT_SEARCH);
    }
  }, [currentStep, setCurrentStep]);

  const handleContinue = () => {
    if (cartItems.length > 0) {
      router.push("/seller/sales/payment");
    }
  };

  const handleBack = () => {
    router.push("/seller/sales/customer");
  };
  
  // Manejadores para integrar con ProductSearch
  const handleAddToCart = (product: Product, quantity: number) => {
    // Convertir el producto a un SaleItem para addToCart
    addToCart({
      productId: product.id,
      quantity: quantity,
      unitPrice: product.sellingPrice,
      subtotal: product.sellingPrice * quantity
    });
  };
  
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    // Buscar el item actual en el carrito
    const currentItem = cartItems.find(item => item.productId === productId);
    if (currentItem) {
      // Actualizar el item con la nueva cantidad
      updateCartItem({
        ...currentItem,
        quantity: quantity,
        subtotal: currentItem.unitPrice * quantity
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <SalesStepIndicator />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Selección de Productos</h1>
        <p className="text-muted-foreground mt-2">
          Agregue productos al carrito para continuar con la venta.
        </p>
        <div className="bg-muted/40 py-2 px-4 rounded-md mt-2 inline-block">
          Cliente: <span className="font-semibold">{selectedCustomer?.name}</span> 
          {selectedCustomer?.cedula && (
            <span className="ml-2">({selectedCustomer.cedula})</span>
          )}
        </div>
      </div>
      
      <ProductSearch
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        totalAmount={cartItems.reduce((total, item) => total + item.subtotal, 0)}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    </div>
  );
}
