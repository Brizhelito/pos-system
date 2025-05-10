"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  ArrowLeft,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  X,
  ChevronRight,
  Edit,
  UserPlus,
} from "lucide-react";
import SALES_API_ROUTES from "@/features/sales/api/routes";
import { Customer, IdType } from "@/features/sales/types";
import DetailDialog from "@/components/DetailDialog";

// Componente para editar un cliente
const CustomerEditForm = ({
  customer,
  onClose,
  onSave,
}: {
  customer: Customer;
  onClose: () => void;
  onSave: (updatedCustomer: Customer) => void;
}) => {
  const [formData, setFormData] = useState({ ...customer });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(SALES_API_ROUTES.CUSTOMER_UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cliente actualizado exitosamente");
        onSave(data.customer);
      } else {
        toast.error(data.message || "Error al actualizar cliente");
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DetailDialog isOpen={true} onClose={onClose} title="Editar Cliente">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900"
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg">
            <label className="text-sm font-medium mb-1 flex items-center">
              <User
                size={16}
                className="mr-2 text-blue-600 dark:text-blue-400"
              />
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 p-4 rounded-lg">
              <label className="text-sm font-medium mb-1 flex items-center">
                <UserPlus
                  size={16}
                  className="mr-2 text-purple-600 dark:text-purple-400"
                />
                Tipo de ID
              </label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all dark:bg-gray-800 dark:border-gray-700"
                required
              >
                <option value={IdType.VENEZOLANO}>Venezolano (V)</option>
                <option value={IdType.EXTRANJERO}>Extranjero (E)</option>
                <option value={IdType.JURIDICO}>Jurídico (J)</option>
                <option value={IdType.PASAPORTE}>Pasaporte (P)</option>
                <option value={IdType.OTRO}>Otro</option>
              </select>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 p-4 rounded-lg">
              <label className="text-sm font-medium mb-1 flex items-center">
                <Users
                  size={16}
                  className="mr-2 text-purple-600 dark:text-purple-400"
                />
                Número de ID
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-lg">
            <label className="text-sm font-medium mb-1 flex items-center">
              <Mail
                size={16}
                className="mr-2 text-green-600 dark:text-green-400"
              />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all dark:bg-gray-800 dark:border-gray-700"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 p-4 rounded-lg">
            <label className="text-sm font-medium mb-1 flex items-center">
              <Phone
                size={16}
                className="mr-2 text-amber-600 dark:text-amber-400"
              />
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all dark:bg-gray-800 dark:border-gray-700"
              placeholder="+58 123 456 7890"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1 transition-all duration-200"
            >
              <X size={16} />
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 transition-all duration-200 shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </DetailDialog>
  );
};

// Componente para mostrar los detalles de un cliente
const CustomerDetails = ({
  customer,
  onEdit,
  onClose,
}: {
  customer: Customer;
  onEdit: () => void;
  onClose: () => void;
}) => {
  return (
    <DetailDialog isOpen={true} onClose={onClose} title="Detalles del Cliente">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold flex items-center">
            <User size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
            {customer.name}
          </h3>
        </div>
        <div className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center p-2 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30"
          >
            <UserPlus
              size={18}
              className="mr-3 text-purple-600 dark:text-purple-400"
            />
            <div>
              <span className="font-medium">Identificación:</span>{" "}
              <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full text-sm">
                {customer.idType} {customer.idNumber}
              </span>
            </div>
          </motion.div>

          {customer.email && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
            >
              <Mail
                size={18}
                className="mr-3 text-green-600 dark:text-green-400"
              />
              <div>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href={`mailto:${customer.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  {customer.email}
                </a>
              </div>
            </motion.div>
          )}

          {customer.phone && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center p-2 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30"
            >
              <Phone
                size={18}
                className="mr-3 text-amber-600 dark:text-amber-400"
              />
              <div>
                <span className="font-medium">Teléfono:</span>{" "}
                <a
                  href={`tel:${customer.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  {customer.phone}
                </a>
              </div>
            </motion.div>
          )}
        </div>
        <div className="pt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-sm flex items-center gap-1"
          >
            <Edit size={16} />
            Editar Cliente
          </motion.button>
        </div>
      </motion.div>
    </DetailDialog>
  );
};

// Componente de Skeleton para carga
const CustomerSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

// Componente principal
const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState<IdType>(IdType.VENEZOLANO);
  const [searchMethod, setSearchMethod] = useState<"name" | "id">("name");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar clientes por nombre
  const searchCustomersByName = useCallback(async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SALES_API_ROUTES.CUSTOMER_SEARCH_BY_NAME}?name=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();

      setCustomers(data.customers || []);
      if (data.customers?.length === 0) {
        toast.info("No se encontraron clientes con ese nombre");
      }
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      toast.error("Error al buscar clientes");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  // Buscar clientes por identificación
  const searchCustomersById = useCallback(async () => {
    if (!idNumber) return;

    setIsLoading(true);
    try {
      const response = await fetch(SALES_API_ROUTES.CUSTOMER_SEARCH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idType,
          idNumber,
        }),
      });
      const data = await response.json();

      if (data.customer) {
        setCustomers([data.customer]);
      } else {
        setCustomers([]);
        toast.info("No se encontró cliente con esa identificación");
      }
    } catch (error) {
      console.error("Error al buscar cliente por ID:", error);
      toast.error("Error al buscar cliente");
    } finally {
      setIsLoading(false);
    }
  }, [idNumber, idType]);

  // Método general de búsqueda
  const searchCustomers = useCallback(() => {
    if (searchMethod === "name") {
      searchCustomersByName();
    } else {
      searchCustomersById();
    }
  }, [searchMethod, searchCustomersByName, searchCustomersById]);

  // Manejar cambio en el campo de búsqueda por nombre
  const handleNameSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio en el campo de búsqueda por ID
  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdNumber(e.target.value);
  };

  // Manejar cambio en el tipo de ID
  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdType(e.target.value as IdType);
  };

  // Manejar cambio en el método de búsqueda
  const handleSearchMethodChange = (method: "name" | "id") => {
    setSearchMethod(method);
  };

  // Manejar la tecla Enter en los campos de búsqueda
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchCustomers();
    }
  };

  // Seleccionar un cliente para ver detalles
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Iniciar edición de cliente
  const handleEditCustomer = () => {
    setIsEditing(true);
  };

  // Guardar cambios del cliente
  const handleSaveCustomer = (updatedCustomer: Customer) => {
    setSelectedCustomer(updatedCustomer);
    setIsEditing(false);
    // Actualizar la lista de clientes si el cliente actualizado está en ella
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 border-b dark:border-gray-700 flex justify-between items-center shadow-md"
      >
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Users size={22} />
          Gestión de Clientes
        </h1>
        <Link
          href="/seller"
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-1 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </motion.div>

      <div className="p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Buscar Clientes</h2>
            </div>
            <div className="p-5">
              {/* Selector de método de búsqueda */}
              <div className="flex gap-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearchMethodChange("name")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 ${
                    searchMethod === "name"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <User size={16} />
                  Por Nombre
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearchMethodChange("id")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 ${
                    searchMethod === "id"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Users size={16} />
                  Por Identificación
                </motion.button>
              </div>

              {/* Búsqueda por nombre */}
              <AnimatePresence mode="wait">
                {searchMethod === "name" ? (
                  <motion.div
                    key="name-search"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2"
                  >
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleNameSearchChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Buscar por nombre..."
                        className="w-full pl-10 border dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={searchCustomers}
                      disabled={isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search size={18} />
                          Buscar
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="id-search"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2 items-stretch"
                  >
                    <select
                      value={idType}
                      onChange={handleIdTypeChange}
                      className="w-36 border dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value={IdType.VENEZOLANO}>Venezolano (V)</option>
                      <option value={IdType.EXTRANJERO}>Extranjero (E)</option>
                      <option value={IdType.JURIDICO}>Jurídico (J)</option>
                      <option value={IdType.PASAPORTE}>Pasaporte (P)</option>
                      <option value={IdType.OTRO}>Otro</option>
                    </select>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={handleIdNumberChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Número de identificación..."
                        className="w-full pl-10 border dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={searchCustomers}
                      disabled={isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search size={18} />
                          Buscar
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {selectedCustomer && !isEditing && (
            <CustomerDetails
              customer={selectedCustomer}
              onEdit={handleEditCustomer}
              onClose={() => setSelectedCustomer(null)}
            />
          )}

          {isLoading ? (
            <CustomerSkeleton />
          ) : (
            customers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-5 border-b dark:border-gray-700">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users
                      size={18}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    Resultados
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Identificación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {customers.map((customer, index) => (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.3 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-medium">{customer.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full text-xs">
                              {customer.idType} {customer.idNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {customer.email ? (
                              <div className="flex items-center gap-1">
                                <Mail
                                  size={14}
                                  className="text-green-600 dark:text-green-400"
                                />
                                <span className="truncate max-w-[150px]">
                                  {customer.email}
                                </span>
                              </div>
                            ) : customer.phone ? (
                              <div className="flex items-center gap-1">
                                <Phone
                                  size={14}
                                  className="text-amber-600 dark:text-amber-400"
                                />
                                <span>{customer.phone}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">
                                Sin contacto
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSelectCustomer(customer)}
                              className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs transition-colors duration-150 flex items-center gap-1"
                            >
                              Ver detalles
                              <ChevronRight size={14} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )
          )}

          {isEditing && selectedCustomer && (
            <CustomerEditForm
              customer={selectedCustomer}
              onClose={() => setIsEditing(false)}
              onSave={handleSaveCustomer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
