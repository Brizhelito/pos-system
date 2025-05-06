import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SaleItem } from "@/types/Sale";
import { Product } from "@/types/Products";
import { CompactProductSearch } from "./CompactProductSearch";
import { CompactPaymentMethod } from "./CompactPaymentMethod";
import { CompactSaleConfirmation } from "./CompactSaleConfirmation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSalesContext } from "@/contexts/SalesContext";
import { useRouter } from "next/navigation";
import { CustomerSearch } from "./CustomerSearch";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

// Steps in the sales flow
enum SalesStep {
  CUSTOMER_SEARCH = 0,
  PRODUCT_SEARCH = 1,
  PAYMENT_METHOD = 2,
  CONFIRMATION = 3,
  COMPLETED = 4,
}

// Define step config including icons and colors
// Props for SalesFlow component
interface SalesFlowProps {
  onCancel: () => void;
}

export default function SalesFlow({ onCancel }: SalesFlowProps) {
  const router = useRouter();

  const {
    state,
    addToCart,
    removeFromCart,
    updateCartItem,
    setCurrentStep,
    resetSale,
    setSelectedCustomer,
    setPaymentMethod,
  } = useSalesContext();

  // Destructure state for easier access
  const { currentStep, selectedCustomer, cartItems, paymentMethod } = state;

  // Estados locales solo para la UI que no necesitan persistencia
  const [, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");

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
        message = `¿Desea continuar con ${
          cartItems.length
        } productos por un total de $${totalAmount.toFixed(2)}?`;
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
      subtotal: quantity * product.sellingPrice,
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

  // Handle updating quantity of items in cart
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    // Ensure the item exists in the cart
    const existingItem = cartItems.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      const newItem = {
        ...existingItem,
        quantity,
        subtotal: quantity * existingItem.unitPrice,
      };
      updateCartItem(newItem);
    }
  };

  // Create a new sale
  const handleCreateSale = async () => {
    if (!selectedCustomer) {
      toast.error("Debes seleccionar un cliente");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("No hay productos en el carrito");
      return;
    }

    if (!paymentMethod) {
      toast.error("Debes seleccionar un método de pago");
      return;
    }

    setIsLoading(true);

    // Prepare sale data
    
    // Simulate API call
    setTimeout(() => {
      // Simulated created sale
      
      toast.success("Venta completada exitosamente");
      setIsLoading(false);
      setCurrentStep(SalesStep.COMPLETED);

      // Auto reset after showing completion screen
      setTimeout(() => {
        handleReset();
        router.push("/seller/sales?completed=true");
      }, 3000);
    }, 1500); // Simulated API delay
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
            onContinue={handleNextStep}
            onBack={onCancel}
          />
        );
      case SalesStep.PRODUCT_SEARCH:
        return (
          <CompactProductSearch
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            totalAmount={totalAmount}
            onContinue={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case SalesStep.PAYMENT_METHOD:
        return (
          <CompactPaymentMethod
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            totalAmount={totalAmount}
            onContinue={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case SalesStep.CONFIRMATION:
        return (
          <CompactSaleConfirmation
            customer={selectedCustomer!}
            items={cartItems}
            totalAmount={totalAmount}
            paymentMethod={paymentMethod}
            onConfirm={handleCreateSale}
            onBack={handlePreviousStep}
          />
        );
      case SalesStep.COMPLETED:
        return (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-3">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">¡Venta completada!</h1>
            <p className="text-sm text-muted-foreground mb-4">
              La venta ha sido registrada exitosamente.
            </p>
            <Button onClick={handleReset} className="w-full max-w-xs">
              Realizar nueva venta
            </Button>
          </div>
        );
    }
  };

  // Get step title


  return (
    <div className="h-full flex flex-col bg-background">
      {/* Encabezado del flujo de ventas con pasos */}
      <div className="bg-white dark:bg-gray-950 border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Barra de progreso compacta horizontal */}
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {Object.values(SalesStep)
              .filter((step) => typeof step === "number")
              .map((step) => {
                const stepNumber = step as number;
                // Solo mostrar hasta CONFIRMATION (evitamos COMPLETED)
                if (stepNumber <= SalesStep.CONFIRMATION) {
                  const isActive = currentStep === stepNumber;
                  const isCompleted = currentStep > stepNumber;

                  return (
                    <div key={stepNumber} className="flex flex-1 items-center">
                      {/* Circle with number */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? "✓" : stepNumber + 1}
                      </div>

                      {/* Step label */}
                      <span
                        className={`text-xs ml-1 hidden lg:inline
                      ${
                        isActive
                          ? "text-primary font-medium"
                          : isCompleted
                          ? "text-primary/70"
                          : "text-muted-foreground"
                      }`}
                      >
                        {
                          ["Cliente", "Productos", "Pago", "Confirmación"][
                            stepNumber
                          ]
                        }
                      </span>

                      {/* Connector line */}
                      {stepNumber < SalesStep.CONFIRMATION && (
                        <div className="flex-1 h-px mx-2 bg-border" />
                      )}
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      </div>

      {/* Contenedor principal con contenido del paso */}
      <div className="flex-1 overflow-auto p-4">
        <div className="container mx-auto h-full flex flex-col max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="flex-1 min-h-[40vh] max-h-[60vh] overflow-auto"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Atajos de teclado compactos al fondo */}
      {currentStep < SalesStep.COMPLETED && (
        <div className="border-t py-1 px-2 bg-muted/10 flex flex-wrap gap-1 justify-center">
          <kbd className="px-1 py-0.5 text-[10px] bg-muted rounded">
            Esc: Atrás
          </kbd>
          <kbd className="px-1 py-0.5 text-[10px] bg-muted rounded">
            Enter: Continuar
          </kbd>
          <kbd className="px-1 py-0.5 text-[10px] bg-muted rounded">
            Alt+F: Buscar
          </kbd>
          <kbd className="px-1 py-0.5 text-[10px] bg-muted rounded">
            Alt+A: Agregar
          </kbd>
          <kbd className="px-1 py-0.5 text-[10px] bg-muted rounded">
            Alt+C: Confirmar
          </kbd>
        </div>
      )}

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-primary"
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
