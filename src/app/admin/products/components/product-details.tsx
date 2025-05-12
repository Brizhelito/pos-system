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
import { Badge } from "@/components/ui/badge";
import { ProductWithRelations } from "../columns";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { formatPercent } from "@/utils/format";

interface ProductDetailsProps {
  open: boolean;
  onClose: () => void;
  product: ProductWithRelations | null;
}

export function ProductDetails({
  open,
  onClose,
  product,
}: ProductDetailsProps) {
  if (!product) return null;

  const stockStatus =
    product.stock <= product.minStock
      ? "bajo"
      : product.stock <= product.minStock * 2
      ? "moderado"
      : "óptimo";

  const stockVariant =
    stockStatus === "bajo"
      ? "destructive"
      : stockStatus === "moderado"
      ? "warning"
      : "success";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {product.name}
            <Badge variant="outline" className="ml-2">
              ID: {product.id}
            </Badge>
          </DialogTitle>
          <DialogDescription>Detalles completos del producto</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-medium">Información básica</h3>
            <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Categoría:</span>
                <span>{product.category?.name || "No asignada"}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Proveedor:</span>
                <span>{product.provider?.name || "No asignado"}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Descripción:</span>
                <span className="text-right">
                  {product.description || "No hay descripción"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de precios */}
          <div>
            <h3 className="text-lg font-medium">Precios</h3>
            <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Precio de compra:</span>
                <span className="font-bold">
                  {formatCurrency(product.purchasePrice)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Precio de venta:</span>
                <span className="font-bold">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Margen de ganancia:</span>
                <span>
                  {formatPercent(
                    (product.sellingPrice - product.purchasePrice) /
                      product.purchasePrice
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Información de stock */}
          <div>
            <h3 className="text-lg font-medium">Inventario</h3>
            <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Stock actual:</span>
                <span className="font-bold">{product.stock} unidades</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Stock mínimo:</span>
                <span>{product.minStock} unidades</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Estado del stock:</span>
                <Badge variant={stockVariant}>
                  {stockStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Información de fechas */}
          <div>
            <h3 className="text-lg font-medium">Fechas</h3>
            <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Creado:</span>
                <span>{formatDateTime(new Date(product.createdAt))}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Última actualización:</span>
                <span>{formatDateTime(new Date(product.updatedAt))}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
