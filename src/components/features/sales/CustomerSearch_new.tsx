import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Customer, CustomerCreate } from "@/types/Customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerCreateSchema } from "@/types/Customer";
import { toast } from "sonner";
import { Loader2, Search, UserPlus, Edit, ChevronLeft, ArrowRight, User, AlertCircle, Check } from "lucide-react";  
import useSWR, { mutate } from "swr";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Error al cargar los datos");
  return res.json();
});

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  onContinue?: () => void;
  onBack?: () => void;
}

export function CustomerSearch({ onSelectCustomer, selectedCustomer, onContinue, onBack }: CustomerSearchProps) {
  // Estado para la interfaz
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  
  // Referencias para navegación
  const searchInputRef = useRef<HTMLInputElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Obtener datos de clientes
  const { data: customers, error, isLoading } = useSWR<Customer[]>(
    '/api/customers',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 segundos
    }
  );

  // Formularios
  const searchForm = useForm<{cedula: string}>({
    defaultValues: {
      cedula: ""
    }
  });

  const createForm = useForm<CustomerCreate>({
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cedula: "",
    },
  });

  const editForm = useForm<CustomerCreate>({
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cedula: "",
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

  // Manejar cambio en el campo de cédula
  const handleCedulaChange = (event: React.ChangeEvent<HTMLInputElement>, form: any) => {
    const formattedCedula = formatCedula(event.target.value);
    form.setValue("cedula", formattedCedula);
    if (event.target === searchInputRef.current) {
      setSearchQuery(formattedCedula);
    }
  };
  
  // Buscar un cliente por cédula
  const searchCustomerByCedula = (cedula: string): Customer | null => {
    if (!customers || !cedula) return null;
    
    const normalized = formatCedula(cedula.trim());
    const found = customers.find(c => c.cedula === normalized);
    
    return found || null;
  };
  
  // Manejar la búsqueda por cédula
  const handleCedulaSearch = () => {
    if (!searchQuery.trim()) {
      setNotFoundMessage("Ingrese una cédula para buscar");
      return;
    }

    const customer = searchCustomerByCedula(searchQuery);
    
    if (customer) {
      onSelectCustomer(customer);
      setNotFoundMessage("");
    } else {
      setNotFoundMessage(`No se encontró cliente con cédula ${searchQuery}`);
      createForm.setValue("cedula", formatCedula(searchQuery));
      onSelectCustomer(null);
    }
  };
  
  // Handle cuando el usuario presiona Enter en el campo de búsqueda
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCedulaSearch();
    }
  };
  
  // Abrir diálogo para crear cliente desde la búsqueda
  const createCustomerFromSearch = () => {
    createForm.setValue("cedula", formatCedula(searchQuery));
    setShowCreateDialog(true);
  };
  
  // Manejar creación de nuevo cliente
  const handleCreateCustomer = async (data: CustomerCreate) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/customers', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating customer');
      }
      
      const newCustomer = await response.json();
      
      // Revalidate SWR cache
      mutate('/api/customers');
      
      setShowCreateDialog(false);
      createForm.reset();
      toast.success("Cliente creado exitosamente");
      onSelectCustomer(newCustomer);
      setNotFoundMessage("");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Error al crear el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Abrir el diálogo de edición
  const openEditDialog = () => {
    if (!selectedCustomer) return;
    
    editForm.reset({
      name: selectedCustomer.name,
      email: selectedCustomer.email || "",
      phone: selectedCustomer.phone || "",
      cedula: selectedCustomer.cedula || "",
    });
    
    setShowEditDialog(true);
  };
  
  // Manejar edición de cliente
  const handleEditCustomer = async (data: CustomerCreate) => {
    if (!selectedCustomer) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Error al actualizar el cliente");
      }
      
      const updatedCustomer = await response.json();
      
      // Update cache
      mutate('/api/customers');
      
      toast.success("Cliente actualizado correctamente");
      setShowEditDialog(false);
      onSelectCustomer(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Error al actualizar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Efecto para auto-enfocar el campo de búsqueda al montar
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-4"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Identificación de cliente</span>
            {selectedCustomer && (
              <div className="flex items-center gap-2 text-sm font-normal bg-green-100 text-green-800 p-2 rounded-md">
                <Check size={16} />
                Cliente seleccionado: {selectedCustomer.name}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-600 mb-4">
            Ingrese el número de cédula del cliente y presione Enter para continuar
          </div>
          
          <Form {...searchForm}>
            <div className="flex gap-2">
              <FormField
                control={searchForm.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="relative w-full">
                      <FormControl>
                        <Input
                          ref={searchInputRef}
                          placeholder="Buscar por cédula (ej: V-12345678)"
                          value={searchQuery}
                          onChange={(e) => {
                            handleCedulaChange(e, searchForm);
                            setSearchQuery(e.target.value);
                          }}
                          onKeyDown={handleSearchKeyDown}
                          className="pr-10"
                        />
                      </FormControl>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Search size={18} className="text-muted-foreground" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <Button 
                type="button"
                onClick={handleCedulaSearch}
              >
                Buscar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  createForm.reset();
                  setShowCreateDialog(true);
                }}
              >
                <UserPlus size={16} className="mr-2" />
                Nuevo
              </Button>
            </div>
          </Form>
          
          {notFoundMessage && (
            <div className="flex items-center mt-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-md">
              <AlertCircle size={16} className="mr-2" />
              {notFoundMessage}
              <Button 
                type="button" 
                variant="link" 
                size="sm"
                ref={createButtonRef}
                onClick={createCustomerFromSearch}
                className="text-sm text-primary px-1"
              >
                Crear ahora
              </Button>
            </div>
          )}
          
          {/* Mostrar detalles del cliente cuando es seleccionado */}
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="text-green-600" size={20} />
                      <h3 className="text-lg font-medium">{selectedCustomer.name}</h3>
                    </div>
                    
                    <div className="text-sm space-y-1 text-slate-700">
                      <p><span className="font-medium">Cédula:</span> {selectedCustomer.cedula || "No especificada"}</p>
                      <p><span className="font-medium">Teléfono:</span> {selectedCustomer.phone || "No especificado"}</p>
                      <p><span className="font-medium">Email:</span> {selectedCustomer.email || "No especificado"}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={openEditDialog}>
                    <Edit size={16} className="mr-2" />
                    Editar
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-green-200 flex justify-end">
                  <Button onClick={onContinue} disabled={!onContinue} ref={continueButtonRef}>
                    Continuar con este cliente
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {isLoading && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-red-500 p-4 text-center">
              Error al cargar los datos de clientes
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ChevronLeft size={16} className="mr-2" />
              Atrás
            </Button>
          )}

          {!selectedCustomer && onContinue && (
            <Button
              onClick={onContinue}
              disabled={!selectedCustomer}
              className="ml-auto"
            >
              Continuar
              <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Diálogo para crear cliente */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo cliente</DialogTitle>
            <DialogDescription>
              Ingresa la información del cliente.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateCustomer)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input 
                        autoFocus 
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
                control={createForm.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value || ""}
                        onChange={(e) => {
                          handleCedulaChange(e, createForm);
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
                control={createForm.control}
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
                control={createForm.control}
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar cliente */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Actualiza la información del cliente.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCustomer)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input 
                        autoFocus 
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
                control={editForm.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value || ""}
                        onChange={(e) => {
                          handleCedulaChange(e, editForm);
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
                control={editForm.control}
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
                control={editForm.control}
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando
                    </>
                  ) : (
                    "Actualizar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
