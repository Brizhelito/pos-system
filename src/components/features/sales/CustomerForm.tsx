import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerCreate, CustomerCreateSchema } from "@/types/Customer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CustomerFormProps {
  onSubmit: (data: CustomerCreate) => Promise<void>;
  initialData?: Partial<CustomerCreate>;
  isSubmitting: boolean;
  onCancel: () => void;
  buttonText: string;
  loadingText: string;
}

export function CustomerForm({
  onSubmit,
  initialData = {},
  isSubmitting,
  onCancel,
  buttonText,
  loadingText
}: CustomerFormProps) {
  const form = useForm<CustomerCreate>({
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      cedula: initialData.cedula || "",
    },
  });

  // Función para formatear la cédula automáticamente
  const formatCedula = (value: string): string => {
    // Si ya tiene el formato correcto, no hacer nada
    if (/^[VE]-\d+$/.test(value)) {
      return value;
    }
    
    // Si comienza con V o E pero falta el guion, añadirlo
    if (/^[VE]\d+$/.test(value)) {
      return value.replace(/^([VE])/, '$1-');
    }
    
    return value;
  };

  // Handle crear/actualizar cédula en formulario
  const handleCedulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCedula = formatCedula(event.target.value);
    form.setValue("cedula", formattedCedula);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cedula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cédula</FormLabel>
              <FormControl>
                <Input 
                  value={field.value || ""}
                  onChange={(e) => {
                    handleCedulaChange(e);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input 
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
