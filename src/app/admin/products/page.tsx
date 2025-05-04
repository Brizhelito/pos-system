"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductWithRelations, productColumns } from "./columns";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { ProductForm } from "./components/product-form";
import { ProductDetails } from "./components/product-details";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  // Estado para los datos y las operaciones
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Estados para los diálogos
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);

  // Estado para productos con stock bajo
  const [lowStockProducts, setLowStockProducts] = useState<
    ProductWithRelations[]
  >([]);

  // Función para cargar productos
  const loadProducts = useCallback(async (query: string = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const url = query
        ? `/api/products?q=${encodeURIComponent(query)}`
        : "/api/products";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }

      const data = await response.json();
      setProducts(data);

      // Filtrar productos con stock bajo
      const lowStock = data.filter(
        (product: ProductWithRelations) => product.stock <= product.minStock
      );
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Error al cargar los productos. Por favor, intente de nuevo.");
      toast.error("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();

    // Configurar acciones globales para los botones de la tabla
    window.productActions = {
      onView: (product) => {
        setSelectedProduct(product);
        setShowDetailsDialog(true);
      },
      onEdit: (product) => {
        setSelectedProduct(product);
        setShowAddEditForm(true);
      },
      onDelete: (product) => {
        setSelectedProduct(product);
        setShowDeleteDialog(true);
      },
    };

    // Limpiar al desmontar
    return () => {
      window.productActions = undefined;
    };
  }, [loadProducts]);
  // Manejar cambios en el campo de búsqueda con debounce
  useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        loadProducts(query);
      }, 500);

      setSearchTimeout(timeout);
    },
    [loadProducts, searchTimeout]
  );
  // Manejar actualizaciones después de operaciones CRUD
  const handleSuccess = () => {
    loadProducts(searchQuery);
  };

  return (
    <motion.div
      className="container mx-auto py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestión de productos del inventario
          </p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Productos en catálogo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            {lowStockProducts.length > 0 && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Productos que necesitan reposición
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "USD",
              }).format(
                products.reduce(
                  (total, product) =>
                    total + product.purchasePrice * product.stock,
                  0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total del inventario
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerta de stock bajo si es necesario */}
      {lowStockProducts.length > 0 && (
        <motion.div
          className="bg-amber-50 border border-amber-200 rounded-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Productos con stock bajo
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <ul className="list-disc pl-5 space-y-1">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      {product.name}: {product.stock} en stock (mínimo:{" "}
                      {product.minStock})
                    </li>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <li>Y {lowStockProducts.length - 3} productos más...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center items-center py-8"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center items-center py-8"
          >
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => loadProducts(searchQuery)}>
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Lista de Productos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gestione sus productos con todas las opciones disponibles
                </p>
              </CardHeader>
              <CardContent>
                <DataTableAdvanced
                  columns={productColumns}
                  data={products}
                  searchColumn="name"
                  searchPlaceholder="Buscar por nombre..."
                  addNewButton={{
                    label: "Nuevo Producto",
                    onClick: () => {
                      setSelectedProduct(null);
                      setShowAddEditForm(true);
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs para CRUD */}
      <ProductForm
        open={showAddEditForm}
        onClose={() => setShowAddEditForm(false)}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />

      <ProductDetails
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        product={selectedProduct}
      />

      <ProductDeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
}