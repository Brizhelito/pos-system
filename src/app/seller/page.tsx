const SellerPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Vendedor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          href="/seller/sales"
          className="block p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <h2 className="text-xl font-bold mb-2">Ventas</h2>
          <p className="mb-4">
            Gestiona el proceso de ventas, desde la selección de clientes hasta
            el procesamiento de pagos
          </p>
          <div className="text-sm bg-blue-500 rounded p-2">
            Acceso rápido: Módulo con atajos de teclado
          </div>
        </a>

        <a
          href="/seller/customers"
          className="block p-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          <h2 className="text-xl font-bold mb-2">Clientes</h2>
          <p>Administra la información de los clientes</p>
        </a>

        <a
          href="/seller/products"
          className="block p-6 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors"
        >
          <h2 className="text-xl font-bold mb-2">Productos</h2>
          <p>Consulta el catálogo de productos disponibles</p>
        </a>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-3">
          Guía de Atajos de Teclado - Módulo de Ventas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Navegación</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm font-mono mr-2">
                  ESC
                </span>
                <span>Volver al panel principal</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">
              Atajos de Funciones
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm font-mono mr-2">
                  F1
                </span>
                <span>Buscar Cliente</span>
              </li>
              <li className="flex items-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm font-mono mr-2">
                  F2
                </span>
                <span>Buscar Producto</span>
              </li>
              <li className="flex items-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm font-mono mr-2">
                  F3
                </span>
                <span>Cambiar Método de Pago</span>
              </li>
              <li className="flex items-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-sm font-mono mr-2">
                  F4
                </span>
                <span>Procesar Venta</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
