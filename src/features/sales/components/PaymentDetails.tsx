import React, { useState, useRef, useEffect } from "react";
import { PaymentMethod } from "../types";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

interface PaymentDetailsProps {
  method: PaymentMethod;
  onDataChange: (data: Record<string, string>) => void;
  total: number;
  onProcessPayment: () => void;
  onCancel: () => void;
}

const PaymentDetails = ({
  method,
  onDataChange,
  total,
  onProcessPayment,
  onCancel,
}: PaymentDetailsProps) => {
  const [paymentData, setPaymentData] = useState<Record<string, string>>({});
  const [amountInput, setAmountInput] = useState<string>("");
  const [navigationMode, setNavigationMode] = useState<
    "fields" | "buttons" | "suggestions"
  >("fields");
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);

  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | null>
  >({});
  const suggestionRefs = useRef<HTMLButtonElement[]>([]);
  const processButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Denominations for cash payment suggestions
  const denominations = [5, 10, 20, 50, 100];

  useEffect(() => {
    // Inicializar el valor con el guardado en paymentData, si existe
    if (paymentData.amountReceived) {
      setAmountInput(paymentData.amountReceived);
    }
  }, [paymentData.amountReceived]);

  // Reset navigation state when payment method changes
  useEffect(() => {
    setNavigationMode("fields");
    setSelectedButtonIndex(-1);
    setSelectedSuggestionIndex(-1);
  }, [method]);

  // Calcular el cambio
  const calculateChange = (): number => {
    if (!paymentData.amountReceived) return 0;
    const amountReceived = parseFloat(paymentData.amountReceived);
    return amountReceived > total ? amountReceived - total : 0;
  };

  // Sugerir montos comunes para el pago en efectivo
  const suggestAmount = (amount: number) => {
    const roundedAmount = Math.ceil(amount / 5) * 5; // Redondear al siguiente múltiplo de 5
    setAmountInput(roundedAmount.toString());
    // Establecer directamente sin validación ya que sugerimos un valor válido
    const newData = {
      ...paymentData,
      amountReceived: roundedAmount.toString(),
    };
    setPaymentData(newData);
    onDataChange(newData);
  };

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Validar el monto recibido
  const validateAmount = (amount: string): boolean => {
    if (!amount) return true; // No validar si está vacío
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < total) {
      toast.error(`El monto debe ser mayor o igual a ${formatCurrency(total)}`);
      return false;
    }
    return true;
  };

  // Manejar cambios en el input de monto con debounce
  const handleAmountInputChange = (value: string) => {
    setAmountInput(value);

    // Limpiar timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Configurar nuevo timer para validar después de 500ms
    debounceTimerRef.current = setTimeout(() => {
      if (validateAmount(value)) {
        const newData = { ...paymentData, amountReceived: value };
        setPaymentData(newData);
        onDataChange(newData);
      }
    }, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    // Solo para campos que no son el monto recibido
    if (field !== "amountReceived") {
      const newData = { ...paymentData, [field]: value };
      setPaymentData(newData);
      onDataChange(newData);
    }
  };

  // Función para navegar al siguiente campo
  const focusNextField = (currentField: string) => {
    const fields = getFieldsForMethod(method);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      inputRefs.current[nextField]?.focus();
      setNavigationMode("fields");
    } else {
      // Si es el último campo, mover a los botones
      setNavigationMode("buttons");
      setSelectedButtonIndex(0);
      processButtonRef.current?.focus();
    }
  };

  // Función para navegar al campo anterior
  const focusPreviousField = (currentField: string) => {
    const fields = getFieldsForMethod(method);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex > 0) {
      const prevField = fields[currentIndex - 1];
      inputRefs.current[prevField]?.focus();
    }
  };

  // Obtener los campos según el método de pago
  const getFieldsForMethod = (method: PaymentMethod): string[] => {
    switch (method) {
      case PaymentMethod.EFECTIVO:
        return ["amountReceived"];
      case PaymentMethod.PAGO_MOVIL:
        return ["phoneNumber", "bank", "reference"];
      case PaymentMethod.TRANSFERENCIA:
        return ["sourceBank", "targetBank", "reference"];
      case PaymentMethod.PUNTO_DE_VENTA:
        return ["bank", "lastDigits", "reference"];
      default:
        return [];
    }
  };

  // Manejar navegación con flechas en sugerencias
  const handleSuggestionNavigation = (e: React.KeyboardEvent) => {
    if (method !== PaymentMethod.EFECTIVO) return;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => {
          const newIndex =
            prev === -1 || prev >= denominations.length - 1 ? 0 : prev + 1;
          suggestionRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case "ArrowLeft":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => {
          const newIndex = prev <= 0 ? denominations.length - 1 : prev - 1;
          suggestionRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        // Volver al campo de entrada
        setNavigationMode("fields");
        inputRefs.current["amountReceived"]?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        // Ir a los botones principales
        setNavigationMode("buttons");
        setSelectedButtonIndex(0);
        processButtonRef.current?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (selectedSuggestionIndex !== -1) {
          suggestAmount(total + denominations[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setNavigationMode("fields");
        inputRefs.current["amountReceived"]?.focus();
        break;
    }
  };

  // Manejar navegación entre botones principales
  const handleButtonNavigation = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        setSelectedButtonIndex((prev) => {
          const newIndex = prev === 0 ? 1 : 0;
          if (newIndex === 0) {
            processButtonRef.current?.focus();
          } else {
            cancelButtonRef.current?.focus();
          }
          return newIndex;
        });
        break;
      case "ArrowLeft":
        e.preventDefault();
        setSelectedButtonIndex((prev) => {
          const newIndex = prev === 1 ? 0 : 1;
          if (newIndex === 0) {
            processButtonRef.current?.focus();
          } else {
            cancelButtonRef.current?.focus();
          }
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        if (method === PaymentMethod.EFECTIVO) {
          // Ir a las sugerencias
          setNavigationMode("suggestions");
          setSelectedSuggestionIndex(0);
          suggestionRefs.current[0]?.focus();
        } else {
          // Ir al último campo
          const fields = getFieldsForMethod(method);
          const lastField = fields[fields.length - 1];
          setNavigationMode("fields");
          inputRefs.current[lastField]?.focus();
        }
        break;
      case "Escape":
        e.preventDefault();
        const fields = getFieldsForMethod(method);
        const lastField = fields[fields.length - 1];
        setNavigationMode("fields");
        inputRefs.current[lastField]?.focus();
        break;
      case "Enter":
      case " ":
        // El comportamiento natural del botón se ejecutará
        break;
    }
  };

  // Manejar teclas de navegación
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        focusNextField(field);
        break;
      case "Tab":
        if (e.shiftKey) {
          e.preventDefault();
          focusPreviousField(field);
        } else {
          e.preventDefault();
          focusNextField(field);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (method === PaymentMethod.EFECTIVO && field === "amountReceived") {
          // En efectivo, ir a las sugerencias
          setNavigationMode("suggestions");
          setSelectedSuggestionIndex(0);
          suggestionRefs.current[0]?.focus();
        } else {
          focusNextField(field);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        focusPreviousField(field);
        break;
    }
  };

  // Atajo para enfocar el primer campo
  useHotkeys(
    "alt+p",
    () => {
      const fields = getFieldsForMethod(method);
      if (fields.length > 0) {
        setNavigationMode("fields");
        inputRefs.current[fields[0]]?.focus();
        toast.info("Detalles de pago activados");
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para ir directo a los botones principales
  useHotkeys(
    "alt+enter",
    () => {
      setNavigationMode("buttons");
      setSelectedButtonIndex(0);
      processButtonRef.current?.focus();
      toast.info("Procesar pago");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajos para las sugerencias de denominaciones en pago en efectivo
  useHotkeys(
    "alt+shift+1",
    () => {
      if (method === PaymentMethod.EFECTIVO) {
        suggestAmount(total + 5);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+shift+2",
    () => {
      if (method === PaymentMethod.EFECTIVO) {
        suggestAmount(total + 10);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+shift+3",
    () => {
      if (method === PaymentMethod.EFECTIVO) {
        suggestAmount(total + 20);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+shift+4",
    () => {
      if (method === PaymentMethod.EFECTIVO) {
        suggestAmount(total + 50);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+shift+5",
    () => {
      if (method === PaymentMethod.EFECTIVO) {
        suggestAmount(total + 100);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para calcular cambio exacto
  useHotkeys(
    "alt+m",
    () => {
      if (method === PaymentMethod.EFECTIVO) {
        const exactAmount = total;
        setAmountInput(exactAmount.toString());
        const newData = {
          ...paymentData,
          amountReceived: exactAmount.toString(),
        };
        setPaymentData(newData);
        onDataChange(newData);

        // Solo mostrar toast para monto exacto (informativo importante)
        toast.info("Monto exacto establecido");
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  const renderInputs = () => {
    switch (method) {
      case PaymentMethod.EFECTIVO:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Monto recibido
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      ref={(el) => {
                        inputRefs.current["amountReceived"] = el;
                      }}
                      type="number"
                      step="0.01"
                      min={total}
                      className="border rounded-lg p-2 pl-7 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                      onChange={(e) => handleAmountInputChange(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, "amountReceived")}
                      value={amountInput}
                    />
                  </div>
                  <button
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 whitespace-nowrap font-medium text-sm"
                    onClick={() => suggestAmount(total)}
                    type="button"
                    title="Alt+S"
                  >
                    Sugerir
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Cambio
                </label>
                <div className="border bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-right font-medium text-lg text-green-600 dark:text-green-400">
                  {formatCurrency(calculateChange())}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {denominations.map((denomination, index) => (
                <button
                  key={denomination}
                  ref={(el) => {
                    if (el) suggestionRefs.current[index] = el;
                  }}
                  className={`bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:shadow-sm ${
                    navigationMode === "suggestions" &&
                    selectedSuggestionIndex === index
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : ""
                  }`}
                  onClick={() => suggestAmount(total + denomination)}
                  onKeyDown={handleSuggestionNavigation}
                  type="button"
                  title={`Alt+Shift+${
                    denomination === 5
                      ? "5"
                      : denomination === 10
                      ? "1"
                      : denomination === 20
                      ? "2"
                      : denomination === 50
                      ? "3"
                      : "4"
                  }`}
                >
                  +{denomination}
                </button>
              ))}
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Use{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Tab
                </kbd>{" "}
                para avanzar,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  ↓
                </kbd>{" "}
                para ir a sugerencias,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+Enter
                </kbd>{" "}
                para procesar
              </p>
              <p className="mt-1">
                Sugerencias rápidas:{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+S
                </kbd>{" "}
                monto exacto,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+Shift+1-5
                </kbd>{" "}
                para denominaciones,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+M
                </kbd>{" "}
                para cambio
              </p>
            </div>
          </div>
        );

      case PaymentMethod.PAGO_MOVIL:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Número de teléfono
                </label>
                <input
                  ref={(el) => {
                    inputRefs.current["phoneNumber"] = el;
                  }}
                  type="tel"
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="04XX-XXX-XXXX"
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "phoneNumber")}
                  value={paymentData.phoneNumber || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Banco
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["bank"] = el;
                  }}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onChange={(e) => handleInputChange("bank", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "bank")}
                  value={paymentData.bank || ""}
                >
                  <option value="">Seleccione un banco</option>
                  <option value="BANESCO">Banesco</option>
                  <option value="PROVINCIAL">Provincial</option>
                  <option value="MERCANTIL">Mercantil</option>
                  <option value="VENEZUELA">Venezuela</option>
                  <option value="BNC">BNC</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Referencia
              </label>
              <div className="flex gap-2">
                <input
                  ref={(el) => {
                    inputRefs.current["reference"] = el;
                  }}
                  type="text"
                  className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Número de referencia"
                  onChange={(e) =>
                    handleInputChange("reference", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "reference")}
                  value={paymentData.reference || ""}
                />
                <button
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 whitespace-nowrap font-medium text-sm"
                  onClick={() => {
                    const randomRef = Math.floor(Math.random() * 1000000)
                      .toString()
                      .padStart(6, "0");
                    handleInputChange("reference", randomRef);
                  }}
                  type="button"
                >
                  Generar
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Use{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Tab
                </kbd>{" "}
                o{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  ↓
                </kbd>{" "}
                para avanzar,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+Enter
                </kbd>{" "}
                para procesar
              </p>
            </div>
          </div>
        );

      case PaymentMethod.TRANSFERENCIA:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Banco origen
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["sourceBank"] = el;
                  }}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onChange={(e) =>
                    handleInputChange("sourceBank", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "sourceBank")}
                  value={paymentData.sourceBank || ""}
                >
                  <option value="">Seleccione un banco</option>
                  <option value="BANESCO">Banesco</option>
                  <option value="PROVINCIAL">Provincial</option>
                  <option value="MERCANTIL">Mercantil</option>
                  <option value="VENEZUELA">Venezuela</option>
                  <option value="BNC">BNC</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Banco destino
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["targetBank"] = el;
                  }}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onChange={(e) =>
                    handleInputChange("targetBank", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "targetBank")}
                  value={paymentData.targetBank || ""}
                >
                  <option value="">Seleccione un banco</option>
                  <option value="BANESCO">Banesco</option>
                  <option value="PROVINCIAL">Provincial</option>
                  <option value="MERCANTIL">Mercantil</option>
                  <option value="VENEZUELA">Venezuela</option>
                  <option value="BNC">BNC</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Referencia
              </label>
              <input
                ref={(el) => {
                  inputRefs.current["reference"] = el;
                }}
                type="text"
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Número de referencia"
                onChange={(e) => handleInputChange("reference", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "reference")}
                value={paymentData.reference || ""}
              />
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Use{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Tab
                </kbd>{" "}
                o{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  ↓
                </kbd>{" "}
                para avanzar,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+Enter
                </kbd>{" "}
                para procesar
              </p>
            </div>
          </div>
        );

      case PaymentMethod.PUNTO_DE_VENTA:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Banco
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["bank"] = el;
                  }}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onChange={(e) => handleInputChange("bank", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "bank")}
                  value={paymentData.bank || ""}
                >
                  <option value="">Seleccione un banco</option>
                  <option value="BANESCO">Banesco</option>
                  <option value="PROVINCIAL">Provincial</option>
                  <option value="MERCANTIL">Mercantil</option>
                  <option value="VENEZUELA">Venezuela</option>
                  <option value="BNC">BNC</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Últimos 4 dígitos
                </label>
                <input
                  ref={(el) => {
                    inputRefs.current["lastDigits"] = el;
                  }}
                  type="text"
                  maxLength={4}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="XXXX"
                  onChange={(e) =>
                    handleInputChange("lastDigits", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "lastDigits")}
                  value={paymentData.lastDigits || ""}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Referencia
              </label>
              <input
                ref={(el) => {
                  inputRefs.current["reference"] = el;
                }}
                type="text"
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Número de referencia"
                onChange={(e) => handleInputChange("reference", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "reference")}
                value={paymentData.reference || ""}
              />
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Use{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Tab
                </kbd>{" "}
                o{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  ↓
                </kbd>{" "}
                para avanzar,{" "}
                <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Alt+Enter
                </kbd>{" "}
                para procesar
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Cancelar el timer de debounce al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="payment-details border-t pt-2 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            Detalles del pago
          </h3>
          <div className="text-right">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total:
            </span>
            <span className="ml-1 text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
        <div className="space-y-4">{renderInputs()}</div>
      </div>
      <div className="mt-4 pt-3 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <button
            ref={processButtonRef}
            onClick={onProcessPayment}
            className={`flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium ${
              navigationMode === "buttons" && selectedButtonIndex === 0
                ? "ring-2 ring-blue-300"
                : ""
            }`}
            onKeyDown={handleButtonNavigation}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Procesar Pago
          </button>
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className={`flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium ${
              navigationMode === "buttons" && selectedButtonIndex === 1
                ? "ring-2 ring-blue-300"
                : ""
            }`}
            onKeyDown={handleButtonNavigation}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
