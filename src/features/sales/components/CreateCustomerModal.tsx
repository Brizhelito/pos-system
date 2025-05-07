import { useState, useEffect, useRef } from "react";
import { Customer, IdType } from "../types";
import axios from "axios";
import SALES_API_ROUTES from "../api/routes";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: Customer) => void;
  idType: IdType;
  idNumber: string;
}

const CreateCustomerModal = ({
  isOpen,
  onClose,
  onSuccess,
  idType,
  idNumber,
}: CreateCustomerModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Referencias para los campos del formulario
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Enfocar el campo de nombre cuando se abre el modal
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      // Pequeño retraso para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }

    // Limpiar formulario cuando se abre
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setError("");
    }
  }, [isOpen]);

  // Controlar el cierre con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Cerrar con Escape
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      nameInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        SALES_API_ROUTES.CUSTOMER_CREATE,
        {
          name,
          idType,
          idNumber,
          email: email.trim() || undefined, // Solo enviar si no está vacío
          phone: phone.trim() || undefined, // Solo enviar si no está vacío
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newCustomer = response.data.customer;
      onSuccess(newCustomer);
      onClose();
    } catch (error: unknown) {
      console.error("Error al crear cliente:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al crear cliente. Intente nuevamente."
      );
      // Enfocar el campo con error o el botón de enviar
      nameInputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Evitar que el componente renderice si no está abierto
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Cerrar al hacer clic fuera del modal
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          if (!loading) onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 dark:text-white"
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Crear Nuevo Cliente
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-medium">
                {idType}: {idNumber}
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customer-name"
              >
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="customer-name"
                ref={nameInputRef}
                type="text"
                className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                required
                autoComplete="off"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customer-phone"
              >
                Teléfono
              </label>
              <input
                id="customer-phone"
                ref={phoneInputRef}
                type="tel"
                className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded p-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Teléfono (opcional)"
                autoComplete="off"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customer-email"
              >
                Email
              </label>
              <input
                id="customer-email"
                ref={emailInputRef}
                type="email"
                className="w-full border dark:border-gray-600 dark:bg-gray-700 rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (opcional)"
                autoComplete="off"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              ref={cancelButtonRef}
              className="px-4 py-2 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
              onClick={onClose}
              disabled={loading}
              aria-label="Cancelar creación de cliente"
            >
              <span className="mr-1">Cancelar</span>
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
                Esc
              </kbd>
            </button>
            <button
              type="submit"
              ref={submitButtonRef}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
              disabled={loading}
              aria-label="Confirmar creación de cliente"
            >
              <span className="mr-1">
                {loading ? "Creando..." : "Crear Cliente"}
              </span>
              {!loading && (
                <kbd className="px-1 bg-green-700 dark:bg-green-800 text-xs rounded">
                  Enter
                </kbd>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerModal;
