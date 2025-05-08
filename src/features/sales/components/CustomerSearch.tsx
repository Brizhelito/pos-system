"use client";

import { useState, useRef, useEffect, RefObject, useCallback } from "react";
import { Customer, IdType } from "../types";
import axios from "axios";
import SALES_API_ROUTES from "../api/routes";
import CreateCustomerModal from "./CreateCustomerModal";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";

interface CustomerSearchProps {
  onCustomerSelect: (customer: Customer) => void;
  defaultIdType?: IdType;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const CustomerSearch = ({
  onCustomerSelect,
  defaultIdType = IdType.VENEZOLANO,
  inputRef,
}: CustomerSearchProps) => {
  const [idType, setIdType] = useState<IdType>(defaultIdType);
  const [idNumber, setIdNumber] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Usar la referencia externa si se proporciona, o la interna si no
  const effectiveInputRef = inputRef || internalInputRef;

  // Focus automático en el campo de identificación al cargar
  useEffect(() => {
    effectiveInputRef.current?.focus();
  }, [effectiveInputRef]);

  // Memoizar handleClearCustomer con useCallback
  const handleClearCustomer = useCallback(() => {
    setCustomer(null);
    setIdNumber("");
    effectiveInputRef.current?.focus();
  }, [effectiveInputRef]);

  // Manejador de teclas para todo el componente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo para abrir modal de creación (Alt+N)
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        // Solo abrir si hay un número de ID y no hay cliente existente
        if (idNumber && !customer && !loading && !isCreateModalOpen) {
          handleOpenCreateModal();
        }
      }

      // Atajo para cerrar cliente seleccionado
      if (e.altKey && e.key === "x" && customer) {
        e.preventDefault();
        handleClearCustomer();
        toast.info("Cliente deseleccionado");
      }

      // NO manejar Enter aquí, ya se maneja en el campo de entrada
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idNumber, customer, loading, isCreateModalOpen, handleClearCustomer]);

  // Enfocar el botón de crear cuando aparece la sección "Cliente no encontrado"
  useEffect(() => {
    if (!customer && idNumber && !loading) {
      // Pequeño retraso para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        createButtonRef.current?.focus();
      }, 100);
    }
  }, [customer, idNumber, loading]);

  useHotkeys(
    "alt+shift+x",
    () => {
      if (customer) {
        handleClearCustomer();
        toast.info("Cliente deseleccionado");
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled: !!customer,
    }
  );

  const searchCustomer = async () => {
    if (!idNumber.trim()) {
      toast.error("Ingrese un número de identificación");
      return;
    }

    // Evitar búsquedas duplicadas
    if (searchInProgress) {
      console.log("Búsqueda en progreso, evitando duplicación");
      return;
    }

    setLoading(true);
    setSearchInProgress(true);

    try {
      // Llamada a la API para buscar cliente
      const response = await axios.post(
        SALES_API_ROUTES.CUSTOMER_SEARCH,
        {
          idType,
          idNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.customer) {
        console.log("Cliente encontrado:", data.customer.name);
        setCustomer(data.customer);
        onCustomerSelect(data.customer);
        setHasSearched(false);
      } else {
        setCustomer(null);
        setHasSearched(true);
        toast.info("Cliente no encontrado. Puede crear uno nuevo.");
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      toast.error("Error al buscar cliente");
      setCustomer(null);
      setHasSearched(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSearchInProgress(false);
      }, 500);
    }
  };

  // Evitar que se dispare doble evento
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation(); // Evita propagación del evento
      if (!loading && !searchInProgress) {
        console.log("Búsqueda iniciada por Enter");
        searchCustomer();
      }
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    // Restaurar el foco al campo de búsqueda
    effectiveInputRef.current?.focus();
  };

  const handleCustomerCreated = (newCustomer: Customer) => {
    setCustomer(newCustomer);
    onCustomerSelect(newCustomer);
    setIsCreateModalOpen(false);
    // No es necesario enfocar el campo de búsqueda aquí, ya que handleCloseCreateModal lo hará
  };

  // Restablecer el estado de búsqueda al cambiar el idNumber
  useEffect(() => {
    if (hasSearched && customer) {
      setHasSearched(false);
      setCustomer(null);
    }
  }, [idNumber, hasSearched, customer]);

  return (
    <div className="customer-search w-full overflow-hidden">
      <div className="flex items-center gap-1.5 mb-2">
        <select
          className="border dark:border-gray-600 dark:bg-gray-800 rounded p-1.5 w-[4.5rem] text-xs lg:text-sm"
          value={idType}
          onChange={(e) => setIdType(e.target.value as IdType)}
          aria-label="Tipo de documento"
        >
          <option value={IdType.VENEZOLANO}>V</option>
          <option value={IdType.EXTRANJERO}>E</option>
          <option value={IdType.JURIDICO}>J</option>
          <option value={IdType.PASAPORTE}>P</option>
          <option value={IdType.OTRO}>Otro</option>
        </select>

        <input
          ref={effectiveInputRef}
          type="text"
          className="border dark:border-gray-600 dark:bg-gray-800 rounded p-1.5 flex-1 min-w-0 text-xs lg:text-sm"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Número de identificación"
          aria-label="Número de identificación"
        />

        <button
          className="bg-blue-600 dark:bg-blue-700 text-white px-2 py-1.5 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center text-xs lg:text-sm whitespace-nowrap"
          onClick={searchCustomer}
          disabled={loading}
          aria-label="Buscar cliente"
        >
          <span className="hidden sm:inline mr-1">
            {loading ? "Buscando..." : "Buscar"}
          </span>
          <span className="sm:hidden">🔍</span>
          <kbd className="hidden lg:inline-block px-1 bg-blue-700 dark:bg-blue-800 text-xs rounded ml-1">
            Enter
          </kbd>
        </button>
      </div>

      {!customer && idNumber && !loading && hasSearched && (
        <div className="create-customer border dark:border-gray-700 rounded p-2 bg-yellow-50 dark:bg-yellow-900/30">
          <p className="mb-1 dark:text-yellow-200 text-xs lg:text-sm">
            Cliente no encontrado
          </p>
          <button
            ref={createButtonRef}
            className="bg-green-600 dark:bg-green-700 text-white px-2 py-1 rounded text-xs lg:text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
            onClick={handleOpenCreateModal}
            aria-label="Crear nuevo cliente"
          >
            <span className="mr-1">Crear Nuevo Cliente</span>
            <kbd className="hidden lg:inline-block px-1 bg-green-700 dark:bg-green-800 text-xs rounded">
              Alt+N
            </kbd>
          </button>
        </div>
      )}

      {idNumber && !hasSearched && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Presiona{" "}
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd>{" "}
          para buscar
        </div>
      )}

      {customer && (
        <div className="customer-info border dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-xs lg:text-sm truncate">
                {customer.name}
              </h3>
              <p className="text-xs truncate">
                {customer.idType}: {customer.idNumber}
              </p>
              {customer.phone && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  Teléfono: {customer.phone}
                </p>
              )}
              {customer.email && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  Email: {customer.email}
                </p>
              )}
            </div>
            <button
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center shrink-0"
              onClick={handleClearCustomer}
              aria-label="Eliminar cliente seleccionado"
            >
              <kbd className="hidden lg:inline-block mr-1 px-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs rounded">
                Alt+X
              </kbd>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal para crear cliente */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCustomerCreated}
        idType={idType}
        idNumber={idNumber}
      />
    </div>
  );
};

export default CustomerSearch;
 