"use client";

import { useState, useEffect, useCallback } from "react";
import { Category, categoryColumns } from "./columns";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { CategoryForm } from "./components/category-form";
import { CategoryDetails } from "./components/category-details";
import { CategoryDeleteDialog } from "./components/category-delete-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
  // Estado para los datos y las operaciones
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Función para cargar categorías
  const loadCategories = useCallback(async (query: string = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const url = query
        ? `/api/categories?q=${encodeURIComponent(query)}`
        : "/api/categories";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al cargar las categorías");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Error al cargar las categorías. Por favor, intente de nuevo.");
      toast.error("Error al cargar las categorías");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();

    // Configurar acciones globales para los botones de la tabla
    window.categoryActions = {
      onView: (category) => {
        setSelectedCategory(category);
        setShowDetailsDialog(true);
      },
      onEdit: (category) => {
        setSelectedCategory(category);
        setShowAddEditForm(true);
      },
      onDelete: (category) => {
        setSelectedCategory(category);
        setShowDeleteDialog(true);
      },
    };

    // Limpiar al desmontar
    return () => {
      window.categoryActions = undefined;
    };
  }, [loadCategories]);

  // Manejar cambios en el campo de búsqueda con debounce
  useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        loadCategories(query);
      }, 500);

      setSearchTimeout(timeout);
    },
    [loadCategories, searchTimeout]
  );

  // Manejar actualizaciones después de operaciones CRUD
  const handleSuccess = () => {
    loadCategories(searchQuery);
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
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">
            Gestión de categorías de productos
          </p>
        </div>
      </div>

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
                <Button onClick={() => loadCategories(searchQuery)}>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Lista de Categorías</CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 px-3 py-1 text-sm"
                  >
                    {categories.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <DataTableAdvanced
                  columns={categoryColumns}
                  data={categories}
                  searchColumn="name"
                  searchPlaceholder="Buscar categorías..."
                  addNewButton={{
                    label: "Nueva Categoría",
                    onClick: () => {
                      setSelectedCategory(null);
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
      <CategoryForm
        open={showAddEditForm}
        onClose={() => setShowAddEditForm(false)}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      <CategoryDetails
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        category={selectedCategory}
      />

      <CategoryDeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
}
