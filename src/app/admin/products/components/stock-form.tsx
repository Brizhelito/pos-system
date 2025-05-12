"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Package, AlertTriangle, Plus, Minus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProductWithRelations } from "../columns";
import { Badge } from "@/components/ui/badge";

const stockFormSchema = z.object({
  quantity: z.coerce
    .number()
    .int()
    .positive("La cantidad debe ser un número positivo"),
  notes: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

interface StockFormProps {
  open: boolean;
  onClose: () => void;
  product: ProductWithRelations;
  onSuccess: () => void;
}

export function StockForm({
  open,
  onClose,
  product,
  onSuccess,
}: StockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: 1,
      notes: "",
    },
  });

  async function onSubmit(values: StockFormValues) {
    try {
      setIsSubmitting(true);

      // Datos a enviar al API
      const updateData = {
        id: product.id,
        stock: product.stock + values.quantity,
        notes: values.notes,
      };

      // Petición para actualizar el stock
      const response = await fetch(`/api/products/${product.id}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al actualizar existencias");
      }

      toast.success(
        `Existencias actualizadas correctamente (+${values.quantity})`
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error actualizando existencias:", error);
      toast.error(
        (error as Error).message || "Error al actualizar existencias"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Existencias</DialogTitle>
          <DialogDescription>
            Gestione el inventario de:{" "}
            <span className="font-semibold">{product.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border p-4 bg-muted/20 flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-center mb-1">
                    Existencias actuales
                  </p>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <p className="text-3xl font-bold text-blue-600">
                      {product.stock}
                    </p>
                  </div>
                  {product.stock <= product.minStock && (
                    <Badge variant="destructive" className="mt-2">
                      Stock Bajo
                    </Badge>
                  )}
                </div>
                <div className="rounded-md border p-4 bg-muted/20 flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-center mb-1">
                    Stock mínimo
                  </p>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        product.stock <= product.minStock
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    />
                    <p className="text-3xl font-bold text-amber-600">
                      {product.minStock}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-blue-50">
                <h4 className="text-sm font-semibold mb-3 text-blue-700">
                  Detalles del producto
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Categoría:</p>
                    <p>{product.category?.name || "Sin categoría"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Proveedor:</p>
                    <p>{product.provider?.name || "Sin proveedor"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Precio compra:</p>
                    <p>
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.purchasePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Precio venta:</p>
                    <p>
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.sellingPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-green-50">
                <h4 className="text-sm font-semibold mb-3 text-green-700">
                  Agregar al inventario
                </h4>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">
                        Cantidad a agregar
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-r-none"
                            onClick={() => {
                              const currentValue = parseInt(
                                field.value.toString()
                              );
                              if (currentValue > 1) {
                                field.onChange(currentValue - 1);
                              }
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Cantidad"
                            className="rounded-none text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-l-none"
                            onClick={() => {
                              const currentValue = parseInt(
                                field.value.toString()
                              );
                              field.onChange(currentValue + 1);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-green-700">
                        Notas (opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Notas o referencia de la entrada"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Existencias después de la operación:
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {product.stock +
                      parseInt(form.watch("quantity").toString() || "0")}
                  </p>
                </div>

                <DialogFooter className="sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Package className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
