"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSalesContext } from "@/contexts/SalesContext";
import { stepsConfig, SalesStep } from "@/types/SalesFlow";
import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

export function SalesStepIndicator() {
  const { state } = useSalesContext();
  const currentPath = usePathname() || "";
  const router = useRouter();
  
  // Encontrar el paso actual basado en la ruta
  const currentStepConfig = stepsConfig.find(step => 
    currentPath === step.path || 
    currentPath.startsWith(step.path)
  ) || stepsConfig[0];
  
  // Atajos de teclado para navegación directa usando react-hotkeys-hook
  useHotkeys('alt+1', () => router.push('/seller/sales/customer'), { 
    enableOnFormTags: false,
    enabled: true,
    preventDefault: true
  });
  
  useHotkeys('alt+2', () => router.push('/seller/sales/products'), {
    enableOnFormTags: false,
    enabled: !!state.selectedCustomer,
    preventDefault: true
  });
  
  useHotkeys('alt+3', () => router.push('/seller/sales/payment'), {
    enableOnFormTags: false,
    enabled: !!state.selectedCustomer && state.cartItems.length > 0,
    preventDefault: true
  });
  
  useHotkeys('alt+4', () => router.push('/seller/sales/confirmation'), {
    enableOnFormTags: false,
    enabled: !!state.selectedCustomer && state.cartItems.length > 0 && !!state.paymentMethod,
    preventDefault: true
  });
  
  // Atajos adicionales para acciones comunes
  useHotkeys('alt+n', () => router.push('/seller/sales/customer'), {
    enableOnFormTags: false,
    enabled: true,
    preventDefault: true,
    description: 'Nueva venta'
  });
  
  useHotkeys('alt+c', () => {
    // Intentar continuar venta en curso
    if (state.selectedCustomer) {
      if (state.cartItems.length === 0) {
        router.push('/seller/sales/products');
      } else if (!state.paymentMethod) {
        router.push('/seller/sales/payment');
      } else {
        router.push('/seller/sales/confirmation');
      }
    } else {
      router.push('/seller/sales/customer');
    }
  }, {
    enableOnFormTags: false,
    enabled: true,
    preventDefault: true,
    description: 'Continuar venta'
  });
  
  // Determinar si un paso está activo, completado o pendiente
  const getStepStatus = (step: SalesStep) => {
    if (step === SalesStep.CUSTOMER_SEARCH) {
      return {
        isCompleted: !!state.selectedCustomer,
        isActive: currentStepConfig.id === step,
        canAccess: true
      };
    } else if (step === SalesStep.PRODUCT_SEARCH) {
      return {
        isCompleted: state.cartItems.length > 0,
        isActive: currentStepConfig.id === step,
        canAccess: !!state.selectedCustomer
      };
    } else if (step === SalesStep.PAYMENT_METHOD) {
      return {
        isCompleted: !!state.paymentMethod,
        isActive: currentStepConfig.id === step,
        canAccess: !!state.selectedCustomer && state.cartItems.length > 0
      };
    } else if (step === SalesStep.CONFIRMATION) {
      return {
        isCompleted: state.isCompleted,
        isActive: currentStepConfig.id === step,
        canAccess: !!state.selectedCustomer && state.cartItems.length > 0 && !!state.paymentMethod
      };
    }
    
    return {
      isCompleted: false,
      isActive: currentStepConfig.id === step,
      canAccess: true
    };
  };
  
  // Solo mostramos los pasos principales del flujo (no el dashboard inicial ni el completado)
  const visibleSteps = stepsConfig.filter(
    step => step.id !== SalesStep.DASHBOARD && step.id !== SalesStep.COMPLETED
  );
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {visibleSteps.map((step, index) => {
          const { isCompleted, isActive, canAccess } = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center relative">
                {/* Paso (círculo) */}
                <Link
                  href={canAccess ? step.path : "#"}
                  className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full 
                    text-white font-bold border-2 transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r border-transparent shadow-lg scale-110 ' + step.color 
                      : isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent' 
                        : 'bg-white border-gray-300 text-gray-500'
                    }
                    ${!canAccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  `}
                  onClick={(e) => !canAccess && e.preventDefault()}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                  
                  {/* Atajo de teclado */}
                  <span className="absolute -bottom-6 text-xs font-normal text-gray-500">
                    Alt+{index + 1}
                  </span>
                </Link>
                
                {/* Etiqueta del paso */}
                <span className={`
                  mt-8 text-sm font-medium
                  ${isActive ? 'text-primary font-semibold' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
              
              {/* Línea de conexión entre pasos */}
              {index < visibleSteps.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-200 relative mx-1">
                  {/* Línea de progreso */}
                  {isCompleted && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 h-full bg-green-500"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-xs text-gray-500 border border-gray-200 bg-gray-50 rounded-md p-2">
        <p className="text-center">Atajos de teclado: 
          <span className="px-1 mx-1 bg-gray-200 rounded">Alt+1-4</span> para navegar entre pasos,
          <span className="px-1 mx-1 bg-gray-200 rounded">Alt+N</span> para nueva venta,
          <span className="px-1 mx-1 bg-gray-200 rounded">Alt+C</span> para continuar.
        </p>
      </div>
    </div>
  );
}
