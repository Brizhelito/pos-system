import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sale, SaleCreate } from "@/types/Sale";
import { SaleItem } from "@/types/Sale";
import { Customer } from "@/types/Customer";
import { Product } from "@/types/Products";
import { $Enums } from "@prisma";
import { CustomerSearch } from "./CustomerSearch";
import { ProductSearch } from "./ProductSearch";
import { PaymentMethod } from "./PaymentMethod";
import { SaleConfirmation } from "./SaleConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { createSaleHandler } from "@/services/SaleService";
import { toast } from "sonner";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

// Steps in the sales flow
enum SalesStep {
  CUSTOMER_SEARCH = 0,
  PRODUCT_SEARCH = 1,
  PAYMENT_METHOD = 2,
  CONFIRMATION = 3,
  COMPLETED = 4
}

interface SalesFlowProps {
  userId: number;
  onComplete?: (sale: Sale) => void;
  onCancel?: () => void;
}

export function SalesFlow({ userId, onComplete, onCancel }: SalesFlowProps) {
  // Current step in the flow
  const [currentStep, setCurrentStep] = useState<SalesStep>(SalesStep.CUSTOMER_SEARCH);
  
  // Data for the sale
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<$Enums.PaymentMethod>($Enums.PaymentMethod.CASH);
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Handle next step with confirmation
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === SalesStep.CUSTOMER_SEARCH && !selectedCustomer) {
      toast.error("Debe seleccionar un cliente para continuar");
      return;
    }

    if (currentStep === SalesStep.PRODUCT_SEARCH && cartItems.length === 0) {
      toast.error("Debe agregar al menos un producto al carrito");
      return;
    }

    // Set confirmation message based on current step
    let title = "";
    let message = "";
    
    switch (currentStep) {
      case SalesStep.CUSTOMER_SEARCH:
        title = "Confirmar cliente";
        message = `¿Desea continuar con el cliente ${selectedCustomer?.name}?`;
        break;
      case SalesStep.PRODUCT_SEARCH:
        title = "Confirmar productos";
        message = `¿Desea continuar con ${cartItems.length} productos por un total de $${totalAmount.toFixed(2)}?`;
        break;
      case SalesStep.PAYMENT_METHOD:
        title = "Confirmar método de pago";
        message = `¿Desea continuar con el método de pago ${paymentMethod}?`;
        break;
      case SalesStep.CONFIRMATION:
        title = "Confirmar venta";
        message = "¿Está seguro de que desea finalizar esta venta?";
        break;
    }

    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => () => {
      if (currentStep === SalesStep.CONFIRMATION) {
        handleCreateSale();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    });
    setShowConfirmDialog(true);
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cartItems];
      const existingItem = updatedItems[existingItemIndex];
      
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
        subtotal: (existingItem.quantity + quantity) * existingItem.unitPrice
      };
      
      setCartItems(updatedItems);
    } else {
      // Add new item
      const newItem: SaleItem = {
        productId: product.id,
        quantity: quantity,
        unitPrice: product.sellingPrice,
        subtotal: quantity * product.sellingPrice
      };
      
      setCartItems([...cartItems, newItem]);
    }
    
    toast.success(`${product.name} agregado al carrito`);
  };

  // Handle removing product from cart
  const handleRemoveFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
    toast.success("Producto eliminado del carrito");
  };

  // Handle updating product quantity in cart
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.unitPrice
        };
      }
      return item;
    });
    
    setCartItems(updatedItems);
  };

  // Create the sale
  const handleCreateSale = async () => {
    if (!selectedCustomer) return;
    
    setIsLoading(true);
    
    try {
      const saleData: SaleCreate = {
        customerId: selectedCustomer.id,
        userId: userId,
        paymentMethod: paymentMethod,
        items: cartItems
      };
      
      const result = await createSaleHandler(saleData);
      
      toast.success("Venta creada exitosamente");
      setCurrentStep(SalesStep.COMPLETED);
      
      if (onComplete && result) {
        onComplete(result as unknown as Sale);
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.error("Error al crear la venta");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the flow
  const handleReset = () => {
    setSelectedCustomer(null);
    setCartItems([]);
    setPaymentMethod($Enums.PaymentMethod.CASH);
    setCurrentStep(SalesStep.CUSTOMER_SEARCH);
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case SalesStep.CUSTOMER_SEARCH:
        return (
          <CustomerSearch 
            onSelectCustomer={setSelectedCustomer} 
            selectedCustomer={selectedCustomer}
          />
        );
      case SalesStep.PRODUCT_SEARCH:
        return (
          <ProductSearch 
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            totalAmount={totalAmount}
          />
        );
      case SalesStep.PAYMENT_METHOD:
        return (
          <PaymentMethod 
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            totalAmount={totalAmount}
          />
        );
      case SalesStep.CONFIRMATION:
        return (
          <SaleConfirmation 
            customer={selectedCustomer!}
            items={cartItems}
            paymentMethod={paymentMethod}
            totalAmount={totalAmount}
          />
        );
      case SalesStep.COMPLETED:
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-center">¡Venta Completada!</h2>
            <p className="text-gray-500 text-center">
              La venta ha sido procesada exitosamente.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button variant="outline" onClick={onCancel}>
                Volver al inicio
              </Button>
              <Button onClick={handleReset}>
                Nueva venta
              </Button>
            </div>
          </div>
        );
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case SalesStep.CUSTOMER_SEARCH:
        return "Buscar Cliente";
      case SalesStep.PRODUCT_SEARCH:
        return "Seleccionar Productos";
      case SalesStep.PAYMENT_METHOD:
        return "Método de Pago";
      case SalesStep.CONFIRMATION:
        return "Confirmar Venta";
      case SalesStep.COMPLETED:
        return "Venta Completada";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Progress bar */}
      {currentStep < SalesStep.COMPLETED && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Cliente", "Productos", "Pago", "Confirmación"].map((step, index) => (
              <div 
                key={index} 
                className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-gray-400"}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <motion.div 
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <Card className="w-full shadow-lg">
        <CardContent className="p-0">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <h2 className="text-xl font-bold">{getStepTitle()}</h2>
          </div>
          
          <div className="p-6 min-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ type: "tween", duration: 0.3 }}
                className="h-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation buttons */}
          {currentStep < SalesStep.COMPLETED && (
            <div className="p-4 border-t flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={isLoading}
              >
                {currentStep === SalesStep.CUSTOMER_SEARCH ? "Cancelar" : "Anterior"}
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={isLoading}
              >
                {currentStep === SalesStep.CONFIRMATION ? "Finalizar Venta" : "Continuar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              confirmAction();
              setShowConfirmDialog(false);
            }}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
