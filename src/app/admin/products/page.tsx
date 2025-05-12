"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductWithRelations, productColumns } from "./columns";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { ProductForm } from "./components/product-form";
import { ProductDetails } from "./components/product-details";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { StockForm } from "./components/stock-form";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Plus,
  Package,
  CheckCircle,
  DollarSign,
  FilterIcon,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  // Estado para los datos y las operaciones
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);

  // Estados para los diálogos
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Agregar estado para controlar visibilidad del formulario de stock
  const [showStockForm, setShowStockForm] = useState(false);

  // Estado para productos con stock bajo
  const [lowStockProducts, setLowStockProducts] = useState<
    ProductWithRelations[]
  >([]);

  // Estado para productos filtrados
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithRelations[]
  >([]);

  // Función para cargar productos
  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);

      // Filtrar productos con stock bajo
      const lowStock = data.filter(
        (product: ProductWithRelations) => product.stock <= product.minStock
      );
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Error al cargar los productos");
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();

    // Configurar acciones globales para los botones de la tabla
    window.productActions = {
      onView: (product: ProductWithRelations) => {
        setSelectedProduct(product);
        setShowDetailsDialog(true);
      },
      onEdit: (product: ProductWithRelations) => {
        setSelectedProduct(product);
        setShowAddEditForm(true);
      },
      onDelete: (product: ProductWithRelations) => {
        setSelectedProduct(product);
        setShowDeleteDialog(true);
      },
      onAddStock: (product: ProductWithRelations) => {
        setSelectedProduct(product);
        setShowStockForm(true);
      },
    };

    // Limpiar al desmontar
    return () => {
      window.productActions = undefined;
    };
  }, [loadProducts]);

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
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Productos
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="flex mt-1 items-center">
              <p className="text-xs text-muted-foreground">
                Productos en catálogo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${
            lowStockProducts.length > 0
              ? "border-l-amber-500"
              : "border-l-green-500"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <div
              className={`h-8 w-8 rounded-full ${
                lowStockProducts.length > 0 ? "bg-amber-100" : "bg-green-100"
              } flex items-center justify-center`}
            >
              {lowStockProducts.length > 0 ? (
                <AlertTriangle className="h-4 w-4 text-amber-700" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-700" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <div className="flex mt-1 items-center">
              {lowStockProducts.length > 0 ? (
                <p className="text-xs text-amber-700">
                  Productos que necesitan reposición
                </p>
              ) : (
                <p className="text-xs text-green-700">
                  Todos los productos con stock suficiente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor de Inventario
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-violet-700" />
            </div>
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
            <div className="flex mt-1 items-center">
              <p className="text-xs text-muted-foreground">
                Valor total del inventario
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerta de stock bajo */}
      {lowStockProducts.length > 0 && (
        <motion.div
          className="rounded-lg border border-amber-200 bg-amber-50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
            <div className="w-full">
              <h3 className="text-sm font-medium text-amber-800 flex justify-between items-center">
                <span>Productos con stock bajo</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
                  onClick={() => {
                    setFilteredProducts(lowStockProducts);
                  }}
                >
                  Ver todos ({lowStockProducts.length})
                </Button>
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-amber-200">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Actual
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Mínimo
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200">
                      {lowStockProducts.slice(0, 4).map((product) => (
                        <tr key={product.id} className="hover:bg-amber-100">
                          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-amber-900">
                            {product.name}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-amber-800 text-center font-mono">
                            {product.stock}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-amber-800 text-center font-mono">
                            {product.minStock}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-amber-500 text-amber-700 hover:bg-amber-200"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowStockForm(true);
                              }}
                            >
                              <Package className="h-3.5 w-3.5 mr-1" /> Reponer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {lowStockProducts.length > 4 && (
                  <p className="mt-2 text-center text-xs text-amber-600">
                    Y {lowStockProducts.length - 4} productos más que necesitan
                    reposición
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Acciones y filtros */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Productos en Inventario
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestione su catálogo de productos
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setShowAddEditForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nuevo Producto
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center space-x-2 bg-muted/20 rounded-md px-3 py-1.5">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <select
                  className="bg-transparent border-none outline-none text-sm focus:ring-0"
                  defaultValue="all"
                  onChange={(e) => {
                    if (e.target.value === "low-stock") {
                      // Filtra solo productos con stock bajo
                      setFilteredProducts(
                        products.filter(
                          (product) => product.stock <= product.minStock
                        )
                      );
                    } else if (e.target.value === "out-of-stock") {
                      // Filtra productos sin stock
                      setFilteredProducts(
                        products.filter((product) => product.stock === 0)
                      );
                    } else if (e.target.value === "all") {
                      // Resetea filtros
                      setFilteredProducts(products);
                    }
                  }}
                >
                  <option value="all">Todos los productos</option>
                  <option value="low-stock">Stock bajo</option>
                  <option value="out-of-stock">Sin existencias</option>
                </select>
              </div>
              {filteredProducts &&
                filteredProducts.length !== products.length && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {filteredProducts.length} productos filtrados
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setFilteredProducts(products)}
                    />
                  </Badge>
                )}
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="mt-4">
            <DataTableAdvanced
              columns={productColumns}
              data={filteredProducts || products}
              searchColumn="name"
              searchPlaceholder="Buscar productos..."
              addNewButton={{
                label: "Nuevo Producto",
                onClick: () => {
                  setSelectedProduct(null);
                  setShowAddEditForm(true);
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario para agregar/editar productos */}
      <ProductForm
        open={showAddEditForm}
        onClose={() => setShowAddEditForm(false)}
        product={selectedProduct}
        onSuccess={loadProducts}
      />

      {/* Diálogo para ver detalles */}
      <ProductDetails
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        product={selectedProduct}
      />

      {/* Diálogo para eliminar */}
      <ProductDeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        product={selectedProduct}
        onSuccess={loadProducts}
      />

      {/* Formulario para agregar stock */}
      {selectedProduct && (
        <StockForm
          open={showStockForm}
          onClose={() => setShowStockForm(false)}
          product={selectedProduct}
          onSuccess={loadProducts}
        />
      )}
    </motion.div>
  );
}