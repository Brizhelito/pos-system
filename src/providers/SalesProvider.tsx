import { SalesProvider as SalesContextProvider } from "@/contexts/SalesContext";
import { ReactNode } from "react";

interface SalesProviderProps {
  children: ReactNode;
}

// Componente contenedor para el proveedor de contexto de ventas
export function SalesProvider({ children }: SalesProviderProps) {
  return (
    <SalesContextProvider>
      {children}
    </SalesContextProvider>
  );
}
