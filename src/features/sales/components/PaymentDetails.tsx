import React, { useState, useRef } from "react";
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
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | null>
  >({});

  // Calcular el cambio
  const calculateChange = (): number => {
    if (!paymentData.amountReceived) return 0;
    const amountReceived = parseFloat(paymentData.amountReceived);
    return amountReceived - total;
  };

  // Sugerir montos comunes para el pago en efectivo
  const suggestAmount = (amount: number) => {
    const roundedAmount = Math.ceil(amount / 5) * 5; // Redondear al siguiente múltiplo de 5
    handleInputChange("amountReceived", roundedAmount.toString());
    toast.info(`Monto sugerido: ${roundedAmount}`);
  };

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
    }).format(amount);
  };

  // Validar el monto recibido
  const validateAmount = (amount: string): boolean => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < total) {
      toast.error(`El monto debe ser mayor o igual a ${formatCurrency(total)}`);
      return false;
    }
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "amountReceived" && !validateAmount(value)) {
      return;
    }
    const newData = { ...paymentData, [field]: value };
    setPaymentData(newData);
    onDataChange(newData);
  };

  // Función para navegar al siguiente campo
  const focusNextField = (currentField: string) => {
    const fields = getFieldsForMethod(method);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      inputRefs.current[nextField]?.focus();
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

  // Manejar teclas de navegación
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextField(field);
    } else if (e.key === "Tab") {
      if (e.shiftKey) {
        e.preventDefault();
        focusPreviousField(field);
      } else {
        e.preventDefault();
        focusNextField(field);
      }
    }
  };

  // Atajo para enfocar el primer campo
  useHotkeys(
    "alt+p",
    () => {
      const fields = getFieldsForMethod(method);
      if (fields.length > 0) {
        inputRefs.current[fields[0]]?.focus();
        toast.info("Detalles de pago activados");
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Monto recibido
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      ref={(el) => {
                        inputRefs.current["amountReceived"] = el;
                      }}
                      type="number"
                      className="border rounded-lg p-3 pl-8 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                      onChange={(e) =>
                        handleInputChange("amountReceived", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, "amountReceived")}
                      value={paymentData.amountReceived || ""}
                    />
                  </div>
                  <button
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 whitespace-nowrap font-medium"
                    onClick={() => suggestAmount(total)}
                    type="button"
                  >
                    Sugerir
                  </button>
                </div>
              </div>
              {paymentData.amountReceived &&
                parseFloat(paymentData.amountReceived) > 0 && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Cambio
                    </label>
                    <div className="border bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-right font-medium text-lg text-green-600 dark:text-green-400">
                      {formatCurrency(calculateChange())}
                    </div>
                  </div>
                )}
            </div>
            {paymentData.amountReceived &&
              parseFloat(paymentData.amountReceived) > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[5, 10, 20, 50, 100].map((denomination) => (
                    <button
                      key={denomination}
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:shadow-sm"
                      onClick={() => suggestAmount(total + denomination)}
                      type="button"
                    >
                      +{denomination}
                    </button>
                  ))}
                </div>
              )}
          </div>
        );

      case PaymentMethod.PAGO_MOVIL:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Número de teléfono
                </label>
                <input
                  ref={(el) => {
                    inputRefs.current["phoneNumber"] = el;
                  }}
                  type="tel"
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="04XX-XXX-XXXX"
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "phoneNumber")}
                  value={paymentData.phoneNumber || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Banco
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["bank"] = el;
                  }}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Referencia
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={(el) => {
                    inputRefs.current["reference"] = el;
                  }}
                  type="text"
                  className="border rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Número de referencia"
                  onChange={(e) =>
                    handleInputChange("reference", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "reference")}
                  value={paymentData.reference || ""}
                />
                <button
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 whitespace-nowrap font-medium"
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
          </div>
        );

      case PaymentMethod.TRANSFERENCIA:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Banco origen
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["sourceBank"] = el;
                  }}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Banco destino
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["targetBank"] = el;
                  }}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Referencia
              </label>
              <input
                ref={(el) => {
                  inputRefs.current["reference"] = el;
                }}
                type="text"
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Número de referencia"
                onChange={(e) => handleInputChange("reference", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "reference")}
                value={paymentData.reference || ""}
              />
            </div>
          </div>
        );

      case PaymentMethod.PUNTO_DE_VENTA:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Banco
                </label>
                <select
                  ref={(el) => {
                    inputRefs.current["bank"] = el;
                  }}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Últimos 4 dígitos
                </label>
                <input
                  ref={(el) => {
                    inputRefs.current["lastDigits"] = el;
                  }}
                  type="text"
                  maxLength={4}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Referencia
              </label>
              <input
                ref={(el) => {
                  inputRefs.current["reference"] = el;
                }}
                type="text"
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Número de referencia"
                onChange={(e) => handleInputChange("reference", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "reference")}
                value={paymentData.reference || ""}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="payment-details mt-3 border-t pt-3 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Detalles del pago
          </h3>
          <div className="text-right">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total a pagar:
            </span>
            <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
        <div className="space-y-6">{renderInputs()}</div>
      </div>
      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onProcessPayment}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            onClick={onCancel}
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
