"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductWithRelations, productColumns } from "./columns";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { ProductForm } from "./components/product-form";
import { ProductDetails } from "./components/product-details";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductsPage() {
  // Estado para los datos y las operaciones
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Estados para los diálogos
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithRelations | null>(null);

  // Estado para productos con stock bajo
  const [lowStockProducts, setLowStockProducts] = useState<ProductWithRelations[]>([]);

  // Función para cargar productos
  const loadProducts = useCallback(async (query: string = "") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = query ? `/api/products?q=${encodeURIComponent(query)}` : "/api/products";
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      loadProducts(query);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Manejar actualizaciones después de operaciones CRUD
  const handleSuccess = () => {
    loadProducts(searchQuery);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestión de productos del inventario
          </p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
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
            <CardTitle className="text-sm font-medium">Valor de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "USD",
              }).format(
                products.reduce(
                  (total, product) => total + product.purchasePrice * product.stock,
                  0
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total del inventario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de stock bajo si es necesario */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
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
                      {product.name}: {product.stock} en stock (mínimo: {product.minStock})
                    </li>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <li>Y {lowStockProducts.length - 3} productos más...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tarjeta principal con la tabla de productos */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <CardDescription>
            Gestione sus productos con todas las opciones disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="w-full flex justify-center items-center py-8 text-red-500">
              {error}
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}