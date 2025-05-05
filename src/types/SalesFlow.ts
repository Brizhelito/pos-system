// Define los pasos del flujo de ventas
export enum SalesStep {
  DASHBOARD = 0,
  CUSTOMER_SEARCH = 1,
  PRODUCT_SEARCH = 2,
  PAYMENT_METHOD = 3,
  CONFIRMATION = 4,
  COMPLETED = 5
}

// Configuración de cada paso del flujo
export interface StepConfig {
  id: SalesStep;
  label: string;
  title: string;
  path: string;
  icon: string;
  color: string;
}

// Configuración de todos los pasos
export const stepsConfig: StepConfig[] = [
  { 
    id: SalesStep.DASHBOARD, 
    label: "Inicio", 
    title: "Panel de Ventas",
    path: "/seller/sales",
    icon: "🏠",
    color: "from-gray-600 to-gray-700" 
  },
  { 
    id: SalesStep.CUSTOMER_SEARCH, 
    label: "Cliente", 
    title: "Selección de Cliente",
    path: "/seller/sales/customer",
    icon: "👤",
    color: "from-blue-600 to-indigo-600" 
  },
  { 
    id: SalesStep.PRODUCT_SEARCH, 
    label: "Productos", 
    title: "Selección de Productos",
    path: "/seller/sales/products",
    icon: "🛒",
    color: "from-emerald-600 to-teal-600" 
  },
  { 
    id: SalesStep.PAYMENT_METHOD, 
    label: "Pago", 
    title: "Método de Pago",
    path: "/seller/sales/payment",
    icon: "💳",
    color: "from-purple-600 to-violet-600" 
  },
  { 
    id: SalesStep.CONFIRMATION, 
    label: "Confirmación", 
    title: "Confirmar Venta",
    path: "/seller/sales/confirmation",
    icon: "✓",
    color: "from-amber-600 to-orange-600" 
  },
  { 
    id: SalesStep.COMPLETED, 
    label: "Completada", 
    title: "Venta Completada",
    path: "/seller/sales",
    icon: "🎉",
    color: "from-green-600 to-emerald-600" 
  }
];
