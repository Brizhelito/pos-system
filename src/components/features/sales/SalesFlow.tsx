import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { useSalesContext } from "@/contexts/SalesContext";
import { useRouter } from "next/navigation";

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

// Define step config including icons and colors
const stepsConfig = [
  { 
    id: SalesStep.CUSTOMER_SEARCH, 
    label: "Cliente", 
    title: "Selección de Cliente",
    icon: "👤",
    color: "from-blue-600 to-indigo-600" 
  },
  { 
    id: SalesStep.PRODUCT_SEARCH, 
    label: "Productos", 
    title: "Selección de Productos",
    icon: "🛒",
    color: "from-emerald-600 to-teal-600" 
  },
  { 
    id: SalesStep.PAYMENT_METHOD, 
    label: "Pago", 
    title: "Método de Pago",
    icon: "💳",
    color: "from-purple-600 to-violet-600" 
  },
  { 
    id: SalesStep.CONFIRMATION, 
    label: "Confirmación", 
    title: "Confirmar Venta",
    icon: "✓",
    color: "from-amber-600 to-orange-600" 
  }
];

interface SalesFlowProps {
  userId: number;
  onComplete?: (sale: Sale) => void;
  onCancel?: () => void;
}

export function SalesFlow({ userId, onComplete, onCancel }: SalesFlowProps) {
  // Usamos directamente el contexto sin sincronización local
  const {
    state,
    setCurrentStep,
    setSelectedCustomer,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setPaymentMethod,
    completeSale,
    resetSale
  } = useSalesContext();
  
  // Extraemos los valores del estado para facilitar su uso
  const { currentStep, selectedCustomer, cartItems, paymentMethod } = state;
  
  // Estados locales solo para la UI que no necesitan persistencia
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const router = useRouter();

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Manejar teclas del navegador para el historial
  useEffect(() => {
    // Función para manejar el evento de tecla
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      // No capturar eventos de teclas si estamos en un input o textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
         document.activeElement.tagName === "TEXTAREA" ||
         document.activeElement.tagName === "SELECT")
      ) {
        return;
      }
      
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        handlePreviousStep();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        handleNextStep();
      }
    };

    // Agregar listener para teclas
    window.addEventListener("keydown", handleKeyboardNavigation);

    // Función para manejar eventos de navegación del historial
    const handlePopState = () => {
      // Si estamos en un paso que no es el primero, ir al paso anterior
      if (currentStep > SalesStep.CUSTOMER_SEARCH) {
        handlePreviousStep();
      }
    };

    // Guardar el estado en el historial cuando cambiamos de paso
    if (window.history) {
      window.history.pushState({ step: currentStep }, "", null);
      window.addEventListener("popstate", handlePopState);
    }

    // Limpiar eventos al desmontar
    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep]); // Dependencias del efecto

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
        setCurrentStep(Number(currentStep) + 1);
      }
    });
    setShowConfirmDialog(true);
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep === SalesStep.CUSTOMER_SEARCH) {
      onCancel?.();
    } else {
      setCurrentStep(Number(currentStep) - 1);
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    // Crear un nuevo item de venta
    const newItem: SaleItem = {
      productId: product.id,
      unitPrice: product.sellingPrice,
      quantity,
      subtotal: quantity * product.sellingPrice
    };
    
    // Agregarlo al contexto (se encarga de verificar si ya existe)
    addToCart(newItem);
    
    toast.success(`${product.name} agregado al carrito`);
  };

  // Handle removing product from cart
  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    toast.success("Producto eliminado del carrito");
  };

  // Handle updating product quantity in cart
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    // Encontrar el item y actualizarlo
    const existingItem = cartItems.find(item => item.productId === productId);
    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        quantity,
        subtotal: quantity * existingItem.unitPrice
      };
      updateCartItem(updatedItem);
    }
  };

  // Create the sale
  const handleCreateSale = () => {
    if (!selectedCustomer) {
      toast.error("Debe seleccionar un cliente");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }

    if (!paymentMethod) {
      toast.error("Debe seleccionar un método de pago");
      return;
    }

    setIsLoading(true);

    // Prepare sale data
    const saleData: SaleCreate = {
      customerId: selectedCustomer.id,
      userId,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      })),
      paymentMethod: paymentMethod,
      totalAmount: totalAmount,
    };

    // Simulate API call
    setTimeout(() => {
      // Simulate created sale with ID
      const createdSale: Sale = {
        id: Math.floor(Math.random() * 10000),
        ...saleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: $Enums.sale_status.COMPLETED
      };

      setIsLoading(false);
      setCurrentStep(SalesStep.COMPLETED);
      
      if (onComplete) {
        onComplete(createdSale);
      }
      
      // Auto reset after showing completion screen
      setTimeout(() => {
        handleReset();
      }, 5000);
      
      // Show success toast
      toast.success("Venta completada exitosamente");
    }, 2000);
  };

  // Reset the flow
  const handleReset = () => {
    resetSale();
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case SalesStep.CUSTOMER_SEARCH:
        return (
          <CustomerSearch 
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
        );
      case SalesStep.PRODUCT_SEARCH:
        return (
          <ProductSearch
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            totalAmount={totalAmount || 0}
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-5 mb-4">
              <svg className="h-16 w-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">¡Venta Completada!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">La venta ha sido procesada exitosamente.</p>
            <Button onClick={handleReset}>Realizar Nueva Venta</Button>
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-2 md:py-6">
      {/* Progress bar */}
      {currentStep < SalesStep.COMPLETED && (
        <motion.div 
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hidden sm:flex justify-between mb-4">
            {stepsConfig.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center"
              >
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    ${index <= currentStep 
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg` 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'} 
                    transition-all duration-300 ease-in-out z-10
                  `}
                >
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div 
                  className={`mt-2 text-xs font-medium transition-colors duration-300
                    ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}
                >
                  {step.label}
                </div>
                
                {/* Connecting line */}
                {index < stepsConfig.length - 1 && (
                  <div className="absolute top-5 left-10 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-0">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: index < currentStep ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Texto para móviles que muestra solo la etapa actual */}
          <div className="sm:hidden text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full 
                bg-gradient-to-r ${stepsConfig[currentStep].color} text-white text-xs
              `}>
                {currentStep + 1}
              </div>
              <div className="text-sm font-medium text-primary">
                {stepsConfig[currentStep].title}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <motion.div 
              className={`bg-gradient-to-r ${stepsConfig[currentStep].color} h-2.5 rounded-full`}
              initial={{ width: "0%" }}
              animate={{ width: `${(Number(currentStep) / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full bg-card shadow-xl overflow-hidden rounded-xl border-0">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${currentStep < SalesStep.COMPLETED ? stepsConfig[currentStep].color : "from-green-600 to-emerald-600"} text-white p-3 sm:p-4`}>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                {currentStep < SalesStep.COMPLETED && (
                  <span className="text-xl">{stepsConfig[currentStep].icon}</span>
                )}
                {getStepTitle()}
              </h2>
            </div>
            
            <div className="p-3 sm:p-6 min-h-[60vh] max-h-[70vh] md:max-h-none overflow-y-auto">
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
              <motion.div 
                className="p-4 border-t flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                  disabled={isLoading}
                  size="sm"
                  className="sm:size-default transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {currentStep === SalesStep.CUSTOMER_SEARCH ? "Cancelar" : "Anterior"}
                </Button>
                
                <div className="hidden sm:block text-xs text-muted-foreground">
                  Paso {currentStep + 1} de {stepsConfig.length}
                </div>
                
                <Button 
                  onClick={handleNextStep}
                  disabled={isLoading}
                  size="sm"
                  className={`sm:size-default transition-all duration-300 bg-gradient-to-r ${stepsConfig[currentStep].color} hover:opacity-90`}
                >
                  {currentStep === SalesStep.CONFIRMATION ? "Finalizar Venta" : "Continuar"}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              {currentStep < SalesStep.COMPLETED && (
                <span className="text-xl">{stepsConfig[currentStep].icon}</span>
              )}
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className={`rounded-full bg-gradient-to-r ${currentStep < SalesStep.COMPLETED ? stepsConfig[currentStep].color : "from-green-600 to-emerald-600"}`}
              onClick={() => {
                confirmAction();
                setShowConfirmDialog(false);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
