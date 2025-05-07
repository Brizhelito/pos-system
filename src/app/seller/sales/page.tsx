"use client";

import SaleContainer from "@/features/sales/components/SaleContainer";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const SalesPage = () => {
  const router = useRouter();

  // Hotkey para volver al panel principal
  useHotkeys(
    "escape",
    () => {
      router.push("/seller");
    },
    {
      preventDefault: true,
    }
  );

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 dark:text-white">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b dark:border-gray-700 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Sistema de Ventas</h1>
          <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs rounded">
            Presiona ESC para volver al panel
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Link
            href="/seller"
            className="bg-blue-600 dark:bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            ← Volver al panel
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SaleContainer />
      </div>
    </div>
  );
};

export default SalesPage; 