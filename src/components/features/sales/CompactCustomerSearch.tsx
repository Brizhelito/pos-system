import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Customer, CustomerCreate } from "@/types/Customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerCreateSchema } from "@/types/Customer";
import { toast } from "sonner";
import { 
  Loader2, Search, UserPlus, Edit, ChevronLeft, 
  ArrowRight, User, AlertCircle, Check, AlertTriangle
} from "lucide-react";  
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

export function CompactCustomerSearch({ onSelectCustomer, selectedCustomer, onContinue, onBack }: CustomerSearchProps) {
  // Estado para la interfaz
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [showFrequentCustomers, setShowFrequentCustomers] = useState(true);
  
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
    if (!value) return "";
    
    // Si es solo un número (sin prefijo), lo dejamos así
    if (/^\d+$/.test(value)) {
      return value;
    }
    
    // Si ya tiene el formato correcto con cualquier prefijo válido (J, V, E, P), no hacer nada
    if (/^[JVEP]-\d+$/.test(value)) {
      return value;
    }
    
    // Si comienza con J, V, E o P pero falta el guion, añadirlo
    if (/^[JVEP]\d+$/.test(value)) {
      return value.replace(/^([JVEP])/, '$1-');
    }
    
    // Si comienza con prefijo en minúscula (j, v, e, p), convertirlo a mayúscula y añadir guion
    if (/^[jvep]\d*$/.test(value)) {
      return value.replace(/^([jvep])(\d*)$/, (_, prefix, numbers) => {
        return `${prefix.toUpperCase()}-${numbers}`;
      });
    }
    
    // Si es solo la letra del prefijo (j, v, e, p), convertirla a mayúscula y añadir guión
    if (/^[jvepJVEP]$/.test(value)) {
      return `${value.toUpperCase()}-`;
    }
    
    return value;
  };

  // Manejar cambio en el campo de cédula
  const handleCedulaChange = (event: React.ChangeEvent<HTMLInputElement>, form: any) => {
    const formattedValue = formatCedula(event.target.value);
    event.target.value = formattedValue;
    form.setValue('cedula', formattedValue);
  };

  // Buscar un cliente por cédula
  const searchCustomerByCedula = (cedula: string): Customer | null => {
    if (!customers) return null;
    const normalizedCedula = cedula.trim();
    return customers.find(customer => customer.cedula === normalizedCedula) || null;
  };

  // Manejar la búsqueda por cédula
  const handleCedulaSearch = async () => {
    const cedula = searchForm.getValues('cedula');
    if (!cedula || cedula.trim() === "") {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Buscar primero en el cache
      const localCustomer = searchCustomerByCedula(cedula);
      
      if (localCustomer) {
        onSelectCustomer(localCustomer);
      } else {
        setNotFoundMessage(`No se encontró ningún cliente con la cédula ${cedula}.`);
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      toast.error("Error al buscar cliente");
    } finally {
      setIsSubmitting(false);
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
    const cedula = searchForm.getValues('cedula');
    if (cedula) {
      createForm.setValue('cedula', cedula);
    }
    setShowCreateDialog(true);
  };

  // Manejar creación de nuevo cliente
  const handleCreateCustomer = async (data: CustomerCreate) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }
      
      const newCustomer = await response.json();
      
      // Actualizar cache de SWR
      mutate('/api/customers');
      
      // Cerrar el dialog y seleccionar el nuevo cliente
      setShowCreateDialog(false);
      onSelectCustomer(newCustomer);
      
      toast.success("Cliente creado exitosamente");
      
      // Resetear el formulario
      createForm.reset();
      
    } catch (error) {
      console.error("Error al crear cliente:", error);
      toast.error("Error al crear el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir el diálogo de edición
  const openEditDialog = () => {
    if (selectedCustomer) {
      // Pre-cargar los datos del cliente seleccionado
      editForm.reset({
        name: selectedCustomer.name,
        cedula: selectedCustomer.cedula,
        phone: selectedCustomer.phone || "",
        email: selectedCustomer.email || "",
      });
      
      setShowEditDialog(true);
    }
  };

  // Manejar edición de cliente
  const handleEditCustomer = async (data: CustomerCreate) => {
    if (!selectedCustomer) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
      }
      
      const updatedCustomer = await response.json();
      
      // Actualizar cache de SWR
      mutate('/api/customers');
      
      // Cerrar el dialog y actualizar el cliente seleccionado
      setShowEditDialog(false);
      onSelectCustomer(updatedCustomer);
      
      toast.success("Cliente actualizado exitosamente");
      
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancelar la búsqueda
  const cancelSearch = () => {
    setNotFoundMessage("");
    searchForm.reset();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Atajos de teclado para la búsqueda
  useEffect(() => {
    const focusSearch = () => {
      searchInputRef.current?.focus();
    };
    
    const keyHandler = (e: KeyboardEvent) => {
      // Alt+F para enfocar la búsqueda
      if (e.altKey && e.key === 'f') {
        e.preventDefault();
        focusSearch();
      }
    };
    
    window.addEventListener('keydown', keyHandler as any);
    
    return () => {
      window.removeEventListener('keydown', keyHandler as any);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col space-y-2"
    >
      {selectedCustomer ? (
        // Cliente seleccionado - versión compacta
        <Card className="shadow-sm border-muted">
          <div className="p-2 sm:p-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-1 text-primary">
                  <User className="h-4 w-4" /> 
                  <span className="font-medium text-sm">Cliente:</span>
                </div>
                <div className="font-semibold">{selectedCustomer.name}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  {selectedCustomer.cedula && <div>Cédula: {selectedCustomer.cedula}</div>}
                  {selectedCustomer.phone && <div>Tel: {selectedCustomer.phone}</div>}
                  {selectedCustomer.email && <div className="truncate max-w-[200px]">Email: {selectedCustomer.email}</div>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={openEditDialog} className="h-8 px-2">
                  <Edit className="h-3.5 w-3.5" />
                  <span className="ml-1">Editar</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onSelectCustomer(null)} className="h-8 px-2">
                  <span className="text-xs">Cambiar</span>
                </Button>
                {onContinue && (
                  <Button size="sm" onClick={onContinue} ref={continueButtonRef} className="h-8 px-2">
                    <span className="mr-1">Continuar</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // Búsqueda de cliente - versión compacta
        <div className="space-y-2">
          {/* Barra de búsqueda compacta */}
          <Card className="shadow-sm border-muted">
            <div className="p-2 sm:p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Search className="h-3.5 w-3.5" /> 
                  <span>Buscar Cliente</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFrequentCustomers(!showFrequentCustomers)}
                  className="h-7 px-2"
                >
                  <span className="text-xs">{showFrequentCustomers ? 'Ocultar recientes' : 'Mostrar recientes'}</span>
                </Button>
              </div>
              
              <div className="flex gap-1">
                <div className="relative flex-1">
                  <Form {...searchForm}>
                    <div className="relative">
                      <FormField
                        control={searchForm.control}
                        name="cedula"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Buscar por cédula (ej: V-12345678)"
                                  autoFocus
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => {
                                    handleCedulaChange(e, searchForm);
                                    field.onChange(e);
                                  }}
                                  ref={searchInputRef}
                                  onKeyDown={handleSearchKeyDown}
                                  className="pr-8 h-8 text-sm"
                                  disabled={isSubmitting}
                                />
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0 h-full aspect-square"
                                  onClick={handleCedulaSearch}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Search className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={createCustomerFromSearch}
                  disabled={isSubmitting}
                  className="h-8 px-2"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="ml-1 text-xs">Nuevo</span>
                </Button>
              </div>
              
              {/* Mensaje si no se encontró el cliente - más compacto */}
              {notFoundMessage && (
                <div className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {notFoundMessage}
                    <Button 
                      variant="link" 
                      onClick={createCustomerFromSearch} 
                      className="h-auto p-0 text-primary font-medium text-xs ml-1"
                      ref={createButtonRef}
                    >
                      Crear nuevo
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Lista de clientes frecuentes compacta */}
              {showFrequentCustomers && customers && customers.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">Clientes frecuentes:</div>
                  <div className="flex flex-wrap gap-1">
                    {customers.slice(0, 5).map((customer) => (
                      <Button 
                        key={customer.id} 
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 justify-start text-xs font-normal"
                        onClick={() => onSelectCustomer(customer)}
                      >
                        <span className="truncate max-w-[140px]">{customer.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Error de carga - más compacto */}
              {error && (
                <div className="mt-2 p-2 border rounded-md bg-destructive/10 text-destructive text-xs">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                    <div>Error al cargar los clientes. Intenta nuevamente.</div>
                  </div>
                </div>
              )}
              
              {onBack && (
                <div className="mt-2">
                  <Button variant="ghost" size="sm" onClick={onBack} className="w-full h-7">
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Volver
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Diálogo para crear cliente */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo cliente.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateCustomer)} className="space-y-3">
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
              
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              
              <DialogFooter className="pt-2">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Actualiza la información del cliente.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCustomer)} className="space-y-3">
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
              
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              
              <DialogFooter className="pt-2">
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
