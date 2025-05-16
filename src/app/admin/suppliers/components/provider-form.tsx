"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Provider } from "../columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const providerFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

type ProviderFormValues = z.infer<typeof providerFormSchema>;

interface ProviderFormProps {
  open: boolean;
  onClose: () => void;
  provider?: Provider | null;
  onSuccess: () => void;
}

export function ProviderForm({
  open,
  onClose,
  provider,
  onSuccess,
}: ProviderFormProps) {
  const isEdit = !!provider;

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: provider?.name || "",
    },
  });

  const onSubmit = async (data: ProviderFormValues) => {
    try {
      const url = isEdit ? `/api/providers/${provider.id}` : "/api/providers";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el proveedor");
      }

      toast.success(
        isEdit
          ? "Proveedor actualizado exitosamente"
          : "Proveedor creado exitosamente"
      );
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al guardar el proveedor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifique los datos del proveedor"
              : "Complete los datos del nuevo proveedor"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{isEdit ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
