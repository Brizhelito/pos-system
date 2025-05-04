"use client";

import { useState, useEffect } from "react";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { ProviderForm } from "./components/provider-form";
import { ProviderDetails } from "./components/provider-details";
import { ProviderDeleteDialog } from "./components/provider-delete-dialog";
import { providerColumns } from "./columns";
import { Provider } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/providers");
      if (!response.ok) {
        throw new Error("Error al cargar los proveedores");
      }
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
      setError("Error al cargar los proveedores. Por favor, intente de nuevo.");
      toast.error("Error al cargar los proveedores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();

    // Configurar acciones globales
    window.providerActions = {
      onView: (provider) => {
        setSelectedProvider(provider);
        setIsDetailsOpen(true);
      },
      onEdit: (provider) => {
        setSelectedProvider(provider);
        setIsFormOpen(true);
      },
      onDelete: (provider) => {
        setSelectedProvider(provider);
        setIsDeleteDialogOpen(true);
      },
    };

    return () => {
      window.providerActions = undefined;
    };
  }, []);

  const handleSuccess = () => {
    loadProviders();
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
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">Gestión de proveedores</p>
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
                <Button onClick={loadProviders}>Reintentar</Button>
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
                  <CardTitle>Lista de Proveedores</CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 px-3 py-1 text-sm"
                  >
                    {providers.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <DataTableAdvanced
                  columns={providerColumns}
                  data={providers}
                  searchColumn="name"
                  searchPlaceholder="Buscar proveedores..."
                  addNewButton={{
                    label: "Nuevo Proveedor",
                    onClick: () => {
                      setSelectedProvider(null);
                      setIsFormOpen(true);
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <ProviderForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        provider={selectedProvider}
        onSuccess={handleSuccess}
      />

      <ProviderDetails
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        provider={selectedProvider}
      />

      <ProviderDeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        provider={selectedProvider}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
}
