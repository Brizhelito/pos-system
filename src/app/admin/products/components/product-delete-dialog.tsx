"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ProductWithRelations } from "../columns";

interface ProductDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  product: ProductWithRelations | null;
  onSuccess: () => void;
}

export function ProductDeleteDialog({
  open,
  onClose,
  product,
  onSuccess,
}: ProductDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Si no hay producto seleccionado, no mostramos el diálogo
  if (!product) return null;

  async function handleDelete() {
    // En este punto sabemos que product no es null debido al guard arriba
    // pero TypeScript no lo reconoce, así que usamos non-null assertion
    const productToDelete = product!;
    try {
      setIsDeleting(true);
      
      // Realizar petición para eliminar el producto
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al eliminar el producto");
      }

      toast.success("Producto eliminado correctamente");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error((error as Error).message || "Error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar este producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el producto{" "}
            <span className="font-bold">{product?.name}</span> (ID: {product?.id}) y no se podrá recuperar.
            <br /><br />
            Si este producto está relacionado con ventas, no podrá ser eliminado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
