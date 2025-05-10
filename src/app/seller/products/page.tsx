"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Filter, X, ArrowLeft, Loader2 } from "lucide-react";
import SALES_API_ROUTES from "@/features/sales/api/routes";
import { formatCurrency } from "@/utils/format";
import DetailDialog from "@/components/DetailDialog";

// Interfaces para mejor tipado
interface Product {
  id: number;
  name: string;
  description: string;
  sellingPrice: number;
  stock: number;
  minStock?: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}

interface ProductWithDetails extends Product {
  barcode?: string;
  purchasePrice?: number;
  inventoryStatus?: "LOW" | "WARNING" | "NORMAL";
  recentMovements?: Array<{
    id: number;
    type: string;
    quantity: number;
    date: string;
    notes?: string;
  }>;
}

interface Category {
  id: number;
  name: string;
}

interface Movement {
  id: number;
  type: string;
  quantity: number;
  date: string;
  notes?: string;
}

// Componente para mostrar los detalles de un producto
const ProductDetails = ({
  product,
  onClose,
}: {
  product: ProductWithDetails;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      <DetailDialog
        isOpen={true}
        onClose={onClose}
        title={product.name}
        maxWidth="max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full mr-2">
                <Package
                  size={18}
                  className="text-blue-600 dark:text-blue-300"
                />
              </span>
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2">
                <span className="font-medium">Descripción:</span>{" "}
                <span>{product.description || "Sin descripción"}</span>
              </div>
              <div>
                <span className="font-medium">Precio:</span>{" "}
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </div>
              <div>
                <span className="font-medium">Categoría:</span>{" "}
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                  {product.category?.name || "Sin categoría"}
                </span>
              </div>
              {product.barcode && (
                <div>
                  <span className="font-medium">Código de barras:</span>{" "}
                  <span className="font-mono">{product.barcode}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <span className="bg-emerald-100 dark:bg-emerald-800 p-1.5 rounded-full mr-2">
                <Package
                  size={18}
                  className="text-emerald-600 dark:text-emerald-300"
                />
              </span>
              Inventario
            </h3>
            <div className="text-sm">
              <div className="mb-2 flex items-center">
                <span className="font-medium mr-2">Stock actual:</span>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`px-3 py-1 rounded-full font-medium ${
                    product.inventoryStatus === "LOW"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                      : product.inventoryStatus === "WARNING"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                  }`}
                >
                  {product.stock} unidades
                </motion.span>
              </div>
              <div>
                <span className="font-medium">Stock mínimo:</span>{" "}
                <span>{product.minStock || 0} unidades</span>
              </div>
            </div>
          </div>

          {product.recentMovements && product.recentMovements.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <span className="bg-purple-100 dark:bg-purple-800 p-1.5 rounded-full mr-2">
                  <Package
                    size={18}
                    className="text-purple-600 dark:text-purple-300"
                  />
                </span>
                Movimientos Recientes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2">Tipo</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.recentMovements.map(
                      (movement: Movement, index) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          key={movement.id}
                          className="border-b dark:border-gray-700"
                        >
                          <td className="py-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                movement.type === "IN"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                              }`}
                            >
                              {movement.type === "IN" ? "Entrada" : "Salida"}
                            </span>
                          </td>
                          <td className="text-right py-2">
                            {movement.quantity}
                          </td>
                          <td className="text-right py-2">
                            {new Date(movement.date).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </DetailDialog>
    </AnimatePresence>
  );
};

// Componente de Skeleton para carga
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

// Componente principal
const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Estado para filtros
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "normal">(
    "all"
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Cargar categorías al inicializar
  useEffect(() => {
    fetchCategories();
  }, []);

  // Obtener categorías para el filtro
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(SALES_API_ROUTES.CATEGORIES);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      toast.error("Error al cargar las categorías");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Aplicar filtros a los productos
  const applyFilters = useCallback(
    (productsToFilter: Product[] = allProducts) => {
      let filtered = [...productsToFilter];

      // Filtrar por categoría
      if (selectedCategory !== "") {
        filtered = filtered.filter(
          (product) => product.categoryId === selectedCategory
        );
      }

      // Filtrar por nivel de stock
      if (stockFilter !== "all") {
        if (stockFilter === "low") {
          // Consideramos stock bajo cuando está por debajo del mínimo requerido
          filtered = filtered.filter(
            (product) => product.stock <= (product.minStock || 0)
          );
        } else if (stockFilter === "normal") {
          // Stock normal cuando está por encima del mínimo
          filtered = filtered.filter(
            (product) => product.stock > (product.minStock || 0)
          );
        }
      }

      setProducts(filtered);
    },
    [allProducts, selectedCategory, stockFilter]
  );

  // Aplicar filtros cuando cambian los parámetros
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, stockFilter, applyFilters]);

  // Buscar productos por nombre o descripción
  const searchProducts = useCallback(async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SALES_API_ROUTES.PRODUCT_SEARCH}?term=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();

      const fetchedProducts = data.products || [];
      setAllProducts(fetchedProducts);
      applyFilters(fetchedProducts);

      if (fetchedProducts.length === 0) {
        toast.info("No se encontraron productos");
      }
    } catch (error) {
      console.error("Error al buscar productos:", error);
      toast.error("Error al buscar productos");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, applyFilters]);

  // Obtener detalles completos de un producto
  const fetchProductDetails = useCallback(async (productId: number) => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(
        `${SALES_API_ROUTES.PRODUCT_DETAIL}?id=${productId}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener detalles del producto");
      }

      const data = await response.json();
      setSelectedProduct(data.product);
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      toast.error("Error al obtener detalles del producto");
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar la tecla Enter en el campo de búsqueda
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchProducts();
    }
  };

  // Manejar cambio en el filtro de categoría
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value === "" ? "" : parseInt(e.target.value));
  };

  // Manejar cambio en el filtro de stock
  const handleStockFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStockFilter(e.target.value as "all" | "low" | "normal");
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSelectedCategory("");
    setStockFilter("all");
    setProducts(allProducts);
  };

  // Ver detalles de un producto
  const handleViewProduct = (product: Product) => {
    fetchProductDetails(product.id);
  };

  // Alternar visualización de filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 border-b dark:border-gray-700 flex justify-between items-center shadow-md"
      >
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Package size={22} />
          Catálogo de Productos
        </h1>
        <Link
          href="/seller"
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-1 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </motion.div>

      <div className="p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Buscar Productos</h2>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Buscar por nombre o descripción..."
                    className="w-full pl-10 border dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={searchProducts}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Buscar
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFilters}
                  className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center shadow-sm"
                >
                  <Filter size={18} />
                </motion.button>
              </div>

              {/* Filtros */}
              <AnimatePresence>
                {showFilters && allProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                          <Filter size={14} />
                          Filtros
                        </h3>
                        <button
                          onClick={toggleFilters}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Filtro por categoría */}
                        <div>
                          <label className="block text-xs mb-1">
                            Categoría
                          </label>
                          <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full border dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            disabled={isLoadingCategories}
                          >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Filtro por nivel de stock */}
                        <div>
                          <label className="block text-xs mb-1">
                            Nivel de Inventario
                          </label>
                          <select
                            value={stockFilter}
                            onChange={handleStockFilterChange}
                            className="w-full border dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          >
                            <option value="all">Todo el inventario</option>
                            <option value="low">Stock bajo</option>
                            <option value="normal">Stock normal</option>
                          </select>
                        </div>

                        {/* Botón para limpiar filtros */}
                        <div className="flex items-end">
                          <button
                            onClick={handleClearFilters}
                            className="w-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-1"
                          >
                            <X size={14} />
                            Limpiar filtros
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {isLoading ? (
            <ProductSkeleton />
          ) : (
            products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Resultados{" "}
                    {products.length !== allProducts.length &&
                      `(${products.length} de ${allProducts.length})`}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {products.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.3 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-medium">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                              {product.category?.name || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(product.sellingPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                product.stock <= (product.minStock || 0)
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                              }`}
                            >
                              {product.stock} unidades
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewProduct(product)}
                              className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs transition-colors duration-150"
                            >
                              Ver detalles
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )
          )}

          {isLoadingDetails && (
            <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center">
                  <Loader2
                    size={40}
                    className="text-blue-600 animate-spin mb-4"
                  />
                  <p className="text-center">Cargando información...</p>
                </div>
              </div>
            </div>
          )}

          {selectedProduct && !isLoadingDetails && (
            <ProductDetails
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
