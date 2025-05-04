"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Provider } from "../columns";

interface ProviderDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  provider: Provider | null;
  onSuccess: () => void;
}

export function ProviderDeleteDialog({
  open,
  onClose,
  provider,
  onSuccess,
}: ProviderDeleteDialogProps) {
  if (!provider) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/providers/${provider.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el proveedor");
      }

      toast.success("Proveedor eliminado exitosamente");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al eliminar el proveedor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Proveedor</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar el proveedor{" "}
            <span className="font-semibold">{provider.name}</span>? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
