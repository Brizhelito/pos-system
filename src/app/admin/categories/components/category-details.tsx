"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Category } from "../columns";

interface CategoryDetailsProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryDetails({
  open,
  onClose,
  category,
}: CategoryDetailsProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {category.name}
            <Badge variant="outline" className="ml-2">
              ID: {category.id}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detalles completos de la categoría
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-medium">Información básica</h3>
            <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Nombre:</span>
                <span>{category.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Producto Asociado:</span>
                <span>
                  {category.Product ? (
                    <Badge variant="outline">{category.Product.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      No hay producto asociado
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
