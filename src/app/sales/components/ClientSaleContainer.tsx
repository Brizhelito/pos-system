"use client";

import dynamic from "next/dynamic";

// Carga dinámica para evitar problemas de SSR con componentes que usan window/browser APIs
const SaleContainerDynamic = dynamic(
  () => import("@/features/sales/components/SaleContainer"),
  { ssr: false }
);

export default function ClientSaleContainer() {
  return <SaleContainerDynamic />;
}
