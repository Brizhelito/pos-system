"use client";

import Link from "next/link";

const ProductsPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Catálogo de Productos</h1>
        <Link href="/seller" className="text-blue-600 hover:text-blue-800">
          ← Volver al panel
        </Link>
      </div>

      <div className="p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            Esta sección está en desarrollo. Pronto podrás consultar el catálogo
            completo de productos aquí.
          </p>
        </div>

        <div className="flex space-x-4">
          <Link
            href="/seller/sales"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Ir a Ventas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
