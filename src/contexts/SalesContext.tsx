"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { Customer } from '@/types/Customer';
import { SaleItem } from '@/types/Sale';
import { $Enums } from '@prisma';

// Define el tipo de estado para el contexto de ventas
export interface SalesState {
  // Estado actual del flujo de ventas
  currentStep: number;
  // Cliente seleccionado
  selectedCustomer: Customer | null;
  // Productos en el carrito
  cartItems: SaleItem[];
  // Método de pago seleccionado
  paymentMethod: $Enums.sale_paymentMethod;
  // Indica si la venta está completada
  isCompleted: boolean;
}

// Define el tipo del contexto
interface SalesContextType {
  // Estado
  state: SalesState;
  // Acciones
  setCurrentStep: (step: number) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  addToCart: (item: SaleItem) => void;
  updateCartItem: (item: SaleItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  setPaymentMethod: (method: $Enums.sale_paymentMethod) => void;
  completeSale: () => void;
  resetSale: () => void;
}

// Estado inicial
const initialState: SalesState = {
  currentStep: 0,
  selectedCustomer: null,
  cartItems: [],
  paymentMethod: $Enums.sale_paymentMethod.EFECTIVO,
  isCompleted: false,
};

// Crea el contexto
const SalesContext = createContext<SalesContextType | undefined>(undefined);

// Custom hook para usar el contexto
export function useSalesContext() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSalesContext debe ser usado dentro de un SalesProvider');
  }
  return context;
}

// Proveedor del contexto
export function SalesProvider({ children }: { children: ReactNode }) {
  // Utilizamos useRef para almacenar el estado inicial cargado desde localStorage
  // y evitar ciclos de renderización
  const initialStateLoaded = useRef(false);
  
  // Estado local que será persistido
  const [state, setState] = useState<SalesState>(initialState);

  // Cargar estado del localStorage solo una vez al montar el componente
  useEffect(() => {
    if (!initialStateLoaded.current) {
      const savedState = localStorage.getItem('salesState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setState(parsedState);
        } catch (error) {
          console.error('Error al parsear el estado guardado:', error);
          // Si hay un error, reiniciar el estado
          localStorage.removeItem('salesState');
        }
      }
      initialStateLoaded.current = true;
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    // Solo guardamos en localStorage si ya se cargó el estado inicial
    // para evitar sobrescribir con el estado por defecto
    if (initialStateLoaded.current) {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('salesState', serializedState);
    }
  }, [state]);

  // Función para actualizar el estado evitando actualizaciones redundantes
  const updateState = (updater: (prevState: SalesState) => SalesState) => {
    setState(prevState => {
      const newState = updater(prevState);
      // Solo actualizar si hay cambios reales en el estado
      if (JSON.stringify(prevState) === JSON.stringify(newState)) {
        return prevState; // Sin cambios, devolver el estado anterior para evitar renderizados
      }
      return newState;
    });
  };

  // Acciones para actualizar el estado
  const setCurrentStep = (step: number) => {
    // Solo actualizar si el paso cambió realmente
    if (state.currentStep !== step) {
      updateState(prev => ({ ...prev, currentStep: step }));
    }
  };

  const setSelectedCustomer = (customer: Customer | null) => {
    updateState(prev => ({ ...prev, selectedCustomer: customer }));
  };

  const addToCart = (item: SaleItem) => {
    updateState(prev => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prev.cartItems.findIndex(
        cartItem => cartItem.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Si ya existe, actualizar la cantidad
        const updatedItems = [...prev.cartItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
          subtotal: (updatedItems[existingItemIndex].quantity + item.quantity) * item.unitPrice,
        };
        return { ...prev, cartItems: updatedItems };
      } else {
        // Si no existe, agregar nuevo item
        return { ...prev, cartItems: [...prev.cartItems, item] };
      }
    });
  };

  const updateCartItem = (item: SaleItem) => {
    updateState(prev => {
      const updatedItems = prev.cartItems.map(cartItem => 
        cartItem.productId === item.productId ? item : cartItem
      );
      return { ...prev, cartItems: updatedItems };
    });
  };

  const removeFromCart = (productId: number) => {
    updateState(prev => ({
      ...prev,
      cartItems: prev.cartItems.filter(item => item.productId !== productId),
    }));
  };

  const clearCart = () => {
    updateState(prev => ({ ...prev, cartItems: [] }));
  };

  const setPaymentMethod = (method: $Enums.sale_paymentMethod) => {
    updateState(prev => ({ ...prev, paymentMethod: method }));
  };

  const completeSale = () => {
    updateState(prev => ({ ...prev, isCompleted: true }));
  };

  const resetSale = () => {
    // Eliminar del localStorage
    localStorage.removeItem('salesState');
    // Reiniciar estado
    setState(initialState);
    // Resetear el flag para permitir cargar un nuevo estado inicial más tarde
    initialStateLoaded.current = false;
  };

  // Proveedor con estado y acciones
  return (
    <SalesContext.Provider
      value={{
        state,
        setCurrentStep,
        setSelectedCustomer,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        setPaymentMethod,
        completeSale,
        resetSale,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}
