import { Metadata } from "next";
import dynamic from "next/dynamic";

// Carga dinámica para evitar problemas de SSR con componentes que usan window/browser APIs
const SaleContainerDynamic = dynamic(
  () => import("@/features/sales/components/SaleContainer"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Sistema de Ventas",
  description: "Gestión de ventas para el sistema POS",
};

export default function SalesPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <SaleContainerDynamic />
    </div>
  );
}
