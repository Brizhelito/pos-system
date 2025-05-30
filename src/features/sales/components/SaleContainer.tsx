"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Customer, CartItem, PaymentMethod, Sale } from "../types";
import CustomerSearch from "./CustomerSearch";
import ProductSearch from "./ProductSearch";
import CartView from "./CartView";
import SaleReceipt from "./SaleReceipt";
import PaymentDetails from "./PaymentDetails";
import SALES_API_ROUTES from "../api/routes";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { PDFService } from "../services/PDFService";
import SaleConfirmationDialog from "./SaleConfirmationDialog";
import { TAX_CONFIG } from "@/utils/constants";

// Constantes para las claves de localStorage
const STORAGE_KEYS = {
  CART_ITEMS: "pos_cart_items",
  SELECTED_CUSTOMER: "pos_selected_customer",
  PAYMENT_METHOD: "pos_payment_method",
  PAYMENT_DETAILS: "pos_payment_details",
};

const SaleContainer = () => {
  const [saleState, setSaleState] = useState(() => {
    // Estado inicial por defecto (sin intentar acceder a localStorage)
    const initialState = {
      customer: null as Customer | null,
      items: [] as CartItem[],
      paymentMethod: PaymentMethod.EFECTIVO,
      total: 0,
      subtotal: 0,
      tax: 0,
    };

    // Evitamos acceder a localStorage durante el renderizado del servidor
    if (typeof window === "undefined") {
      return initialState;
    }

    // Ahora estamos seguros de que estamos en el navegador
    try {
      const storedItems = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      const storedCustomer = localStorage.getItem(
        STORAGE_KEYS.SELECTED_CUSTOMER
      );
      const storedPaymentMethod = localStorage.getItem(
        STORAGE_KEYS.PAYMENT_METHOD
      );

      return {
        customer: storedCustomer
          ? JSON.parse(storedCustomer)
          : (null as Customer | null),
        items: storedItems ? JSON.parse(storedItems) : ([] as CartItem[]),
        paymentMethod: storedPaymentMethod
          ? JSON.parse(storedPaymentMethod)
          : PaymentMethod.EFECTIVO,
        total: 0,
        subtotal: 0,
        tax: 0,
      };
    } catch (error) {
      console.error("Error al recuperar datos guardados:", error);
      return initialState;
    }
  });

  const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>(
    () => {
      // Evitar acceder a localStorage durante el renderizado del servidor
      if (typeof window === "undefined") {
        return {};
      }

      try {
        const storedPaymentDetails = localStorage.getItem(
          STORAGE_KEYS.PAYMENT_DETAILS
        );
        return storedPaymentDetails ? JSON.parse(storedPaymentDetails) : {};
      } catch (error) {
        console.error("Error al recuperar detalles de pago:", error);
        return {};
      }
    }
  );

  const [showReceipt, setShowReceipt] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Añadir estados para los diálogos de confirmación
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  // Referencias para el enfoque de elementos
  const customerSearchRef = useRef<HTMLInputElement>(null);
  const productSearchRef = useRef<HTMLInputElement>(null);
  const processButtonRef = useRef<HTMLButtonElement>(null);
  const paymentDetailsRef = useRef<HTMLDivElement>(null);
  const effectivoButtonRef = useRef<HTMLButtonElement>(null);
  const pagoMovilButtonRef = useRef<HTMLButtonElement>(null);
  const transferenciaButtonRef = useRef<HTMLButtonElement>(null);
  const puntoButtonRef = useRef<HTMLButtonElement>(null);

  const [showShortcuts, setShowShortcuts] = useState(true);

  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | null>
  >({});
  const cartRef = useRef<HTMLDivElement>(null);

  // Memoizar métodos de pago disponibles para evitar recálculos
  const paymentMethods = useMemo(
    () => [
      PaymentMethod.EFECTIVO,
      PaymentMethod.PAGO_MOVIL,
      PaymentMethod.TRANSFERENCIA,
      PaymentMethod.PUNTO_DE_VENTA,
    ],
    []
  );

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

  const calculateTotals = useCallback(() => {
    const subtotal = saleState.items.reduce(
      (sum: number, item: CartItem) => sum + item.subtotal,
      0
    );

    // Usar las funciones mejoradas de TAX_CONFIG
    const tax = TAX_CONFIG.calculate(subtotal);
    const total = TAX_CONFIG.calculateTotal(subtotal);

    setSaleState((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }));
  }, [saleState.items]);

  // Recalcular totales cuando cambien los items
  useEffect(() => {
    calculateTotals();
  }, [saleState.items, calculateTotals]);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE_KEYS.CART_ITEMS,
      JSON.stringify(saleState.items)
    );
  }, [saleState.items]);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    if (saleState.customer) {
      localStorage.setItem(
        STORAGE_KEYS.SELECTED_CUSTOMER,
        JSON.stringify(saleState.customer)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_CUSTOMER);
    }
  }, [saleState.customer]);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE_KEYS.PAYMENT_METHOD,
      JSON.stringify(saleState.paymentMethod)
    );
  }, [saleState.paymentMethod]);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE_KEYS.PAYMENT_DETAILS,
      JSON.stringify(paymentDetails)
    );
  }, [paymentDetails]);

  // Función para limpiar completamente el almacenamiento local
  const clearSaleStorage = () => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CUSTOMER);
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_METHOD);
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_DETAILS);
  };

  // Configuración de atajos de teclado
  useHotkeys(
    "f1",
    () => {
      customerSearchRef.current?.focus();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "f2",
    () => {
      productSearchRef.current?.focus();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "f3",
    () => {
      if (saleState.paymentMethod) {
        const fields = getFieldsForMethod(saleState.paymentMethod);
        if (fields.length > 0) {
          inputRefs.current[fields[0]]?.focus();
          toast.info("Método de pago activado");
        }
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para procesar la venta (F4)
  useHotkeys(
    "f4",
    () => {
      if (canProcessSale()) {
        handleProcessSaleClick();
      } else {
        toast.error(
          "No se puede procesar la venta. Verifica cliente y productos."
        );
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para cancelar la venta completa
  useHotkeys(
    "alt+b",
    () => {
      if (saleState.items.length > 0 || saleState.customer) {
        setShowCancelDialog(true);
        toast.info("Cancelación de venta iniciada");
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Actualizar atajos de teclado para evitar el conflicto y mejorar navegación
  useHotkeys(
    "alt+x",
    () => {
      if (showReceipt) {
        handleCloseReceipt();
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Añadir atajos para cambiar el foco entre las tres secciones principales
  useHotkeys(
    "alt+1",
    () => {
      handlePaymentMethodChange(PaymentMethod.EFECTIVO);
      toast.info("Método de pago: Efectivo");
      focusPaymentMethodButton(PaymentMethod.EFECTIVO);
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+2",
    () => {
      handlePaymentMethodChange(PaymentMethod.PAGO_MOVIL);
      toast.info("Método de pago: Pago Móvil");
      focusPaymentMethodButton(PaymentMethod.PAGO_MOVIL);
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+3",
    () => {
      handlePaymentMethodChange(PaymentMethod.TRANSFERENCIA);
      toast.info("Método de pago: Transferencia");
      focusPaymentMethodButton(PaymentMethod.TRANSFERENCIA);
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+4",
    () => {
      handlePaymentMethodChange(PaymentMethod.PUNTO_DE_VENTA);
      toast.info("Método de pago: Punto de Venta");
      focusPaymentMethodButton(PaymentMethod.PUNTO_DE_VENTA);
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Navegar entre secciones principales
  useHotkeys(
    "alt+q",
    () => {
      customerSearchRef.current?.focus();
      toast.info("Sección de cliente activada");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "alt+w",
    () => {
      productSearchRef.current?.focus();
      toast.info("Sección de productos activada");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para enfocar el carrito
  useHotkeys(
    "alt+shift+c",
    () => {
      cartRef.current?.focus();
      toast.info("Carrito activado");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para enfocar los detalles de pago
  useHotkeys(
    "alt+p",
    () => {
      paymentDetailsRef.current?.focus();
      toast.info("Detalles de pago activados");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Atajo para limpiar todo el carrito (modificado para usar el diálogo)
  useHotkeys(
    "alt+l",
    () => {
      if (saleState.items.length > 0) {
        setShowClearCartDialog(true);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  const validatePaymentDetails = useCallback((): boolean => {
    switch (saleState.paymentMethod) {
      case PaymentMethod.EFECTIVO:
        return true; // No se requiere validación adicional

      case PaymentMethod.PAGO_MOVIL:
        return !!(
          paymentDetails.phoneNumber &&
          paymentDetails.bank &&
          paymentDetails.reference
        );

      case PaymentMethod.TRANSFERENCIA:
        return !!(
          paymentDetails.sourceBank &&
          paymentDetails.targetBank &&
          paymentDetails.reference
        );

      case PaymentMethod.PUNTO_DE_VENTA:
        return !!(
          paymentDetails.bank &&
          paymentDetails.lastDigits &&
          paymentDetails.reference
        );

      default:
        return true;
    }
  }, [saleState.paymentMethod, paymentDetails]);

  const canProcessSale = useCallback((): boolean => {
    return !(
      !saleState.customer ||
      saleState.items.length === 0 ||
      isProcessing ||
      !validatePaymentDetails()
    );
  }, [
    saleState.customer,
    saleState.items.length,
    isProcessing,
    validatePaymentDetails,
  ]);

  const focusPaymentMethodButton = useCallback((method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.EFECTIVO:
        effectivoButtonRef.current?.focus();
        break;
      case PaymentMethod.PAGO_MOVIL:
        pagoMovilButtonRef.current?.focus();
        break;
      case PaymentMethod.TRANSFERENCIA:
        transferenciaButtonRef.current?.focus();
        break;
      case PaymentMethod.PUNTO_DE_VENTA:
        puntoButtonRef.current?.focus();
        break;
    }
  }, []);

  const updateCartItem = useCallback((updatedItem: CartItem) => {
    setSaleState((prev) => ({
      ...prev,
      items: prev.items.map((item: CartItem) =>
        item.productId === updatedItem.productId ? updatedItem : item
      ),
    }));
  }, []);

  const removeCartItem = useCallback(
    (productId: number) => {
      const itemToRemove = saleState.items.find(
        (item: CartItem) => item.productId === productId
      );
      setSaleState((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item: CartItem) => item.productId !== productId
        ),
      }));
      if (itemToRemove) {
        toast.info(`Eliminado: ${itemToRemove.product.name}`);
      }
    },
    [saleState.items]
  );

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setSaleState((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
    // Reiniciar los detalles de pago cuando cambia el método
    setPaymentDetails({});
  }, []);

  const handlePaymentDetailsChange = useCallback(
    (data: Record<string, string>) => {
      setPaymentDetails(data);
    },
    []
  );

  const handleCustomerSelect = useCallback(
    (customer: Customer) => {
      // Comprobar si ya tenemos seleccionado este cliente para evitar cambios de estado innecesarios
      if (saleState.customer?.id === customer.id) {
        return;
      }

      setSaleState((prev) => ({
        ...prev,
        customer,
      }));
      toast.success(`Cliente seleccionado: ${customer.name}`);
      // Enfocar en búsqueda de productos después de seleccionar cliente
      productSearchRef.current?.focus();
    },
    [saleState.customer?.id]
  );

  const addItemToCart = useCallback(
    (newItem: CartItem) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = saleState.items.findIndex(
        (item: CartItem) => item.productId === newItem.productId
      );

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si ya existe
        const existingItem = saleState.items[existingItemIndex];
        const updatedQuantity = existingItem.quantity + newItem.quantity;

        // Verificar stock
        if (updatedQuantity > newItem.product.stock) {
          toast.error(
            `Stock insuficiente. Máximo disponible: ${newItem.product.stock}`
          );
          return;
        }

        const updatedItem = {
          ...existingItem,
          quantity: updatedQuantity,
          subtotal: newItem.unitPrice * updatedQuantity,
        };

        const updatedItems = [...saleState.items];
        updatedItems[existingItemIndex] = updatedItem;

        setSaleState((prev) => ({
          ...prev,
          items: updatedItems,
        }));
        toast.success(
          `Actualizado: ${newItem.product.name} (${updatedQuantity})`
        );
      } else {
        // Agregar nuevo producto
        setSaleState((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
        toast.success(
          `Agregado: ${newItem.product.name} (${newItem.quantity})`
        );
      }
    },
    [saleState.items]
  );

  // Estado para el diálogo de confirmación de venta
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Modificar la función de procesamiento de venta para usar el diálogo de confirmación
  const handleProcessSaleClick = () => {
    // Evitar procesamiento si ya está en progreso
    if (isProcessing) {
      return;
    }

    if (!saleState.customer) {
      toast.error("Debe seleccionar un cliente");
      customerSearchRef.current?.focus();
      return;
    }

    if (saleState.items.length === 0) {
      toast.error("El carrito está vacío");
      productSearchRef.current?.focus();
      return;
    }

    // Validar los detalles del pago según el método seleccionado
    if (!validatePaymentDetails()) {
      toast.error("Complete los detalles del pago para continuar");
      return;
    }

    // Mostrar el diálogo de confirmación
    setShowConfirmDialog(true);
  };

  // Función para procesar la venta después de la confirmación
  const processSale = async () => {
    // Evitar procesamiento duplicado
    if (isProcessing) {
      console.log("Procesamiento ya en curso, evitando duplicación");
      return;
    }

    setIsProcessing(true);

    try {
      const saleData = {
        customerId: saleState.customer!.id,
        items: saleState.items.map((item: CartItem) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
        paymentMethod: saleState.paymentMethod,
        total: saleState.total,
        paymentDetails: paymentDetails, // Enviamos los detalles del pago
      };

      // Guardar referencia al cliente antes de procesar, por si necesitamos restaurarlo en caso de error
      const currentCustomer = saleState.customer;

      // Enviar a la API
      const response = await fetch(SALES_API_ROUTES.PROCESS_SALE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      const result = await response.json();

      if (response.ok) {
        // Cerrar diálogo de confirmación
        setShowConfirmDialog(false);

        // Guardar la venta completada
        setCompletedSale(result.sale);

        // Mostrar el recibo
        setShowReceipt(true);

        // Toast de éxito
        toast.success("Venta procesada correctamente");

        // Limpiar almacenamiento después de procesar exitosamente
        clearSaleStorage();

        // Reiniciar el estado
        setSaleState({
          customer: null,
          items: [],
          paymentMethod: PaymentMethod.EFECTIVO,
          total: 0,
          subtotal: 0,
          tax: 0,
        });
        setPaymentDetails({});
      } else {
        toast.error(`Error al procesar la venta: ${result.message}`);

        // Restaurar el cliente si hubo un error
        setSaleState((prev) => ({
          ...prev,
          customer: currentCustomer,
        }));
      }
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      toast.error("Error al procesar la venta");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!completedSale) {
      toast.error("No hay una venta completada para imprimir");
      return;
    }

    try {
      // Verificar si la referencia al recibo existe
      if (!receiptRef.current) {
        toast.error("No se encontró el elemento del recibo para imprimir");
        console.error("receiptRef.current es null o undefined");
        return;
      }

      // Contenido HTML del recibo
      const receiptContent = receiptRef.current.innerHTML;
      if (!receiptContent) {
        toast.error("El contenido del recibo está vacío");
        return;
      }

      toast.info("Preparando documento para impresión...");

      // Crear un iframe oculto para la impresión
      const printIframe = document.createElement("iframe");
      printIframe.style.display = "none";
      document.body.appendChild(printIframe);

      // Verificar que el documento del iframe esté disponible
      if (!printIframe.contentDocument) {
        toast.error(
          "Error al preparar la impresión: no se pudo crear el documento"
        );
        document.body.removeChild(printIframe);
        return;
      }

      // Insertar el contenido en el iframe
      printIframe.contentDocument.write(`
        <html>
          <head>
            <title>${
              completedSale.invoice ? "Factura" : "Recibo"
            } de Venta</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
              }
              .receipt { 
                width: 100%; 
                max-width: 400px; 
                margin: 0 auto; 
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px; 
              }
              .info-row { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 5px; 
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0; 
              }
              th { 
                text-align: left; 
                padding: 8px; 
                border-bottom: 1px solid #ddd; 
              }
              td { 
                padding: 8px; 
                border-bottom: 1px solid #ddd; 
              }
              .total-row { 
                font-weight: bold; 
              }
              .footer { 
                text-align: center; 
                margin-top: 20px; 
                font-size: 12px; 
              }
              @media print {
                body { 
                  -webkit-print-color-adjust: exact; 
                  color-adjust: exact; 
                }
                button, .no-print { 
                  display: none !important; 
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${receiptContent}
            </div>
            <script>
              // Eliminar botones y elementos que no deberían imprimirse
              document.querySelectorAll('button, .no-print').forEach(el => {
                el.style.display = 'none';
              });
            </script>
          </body>
        </html>
      `);

      // Cerrar el documento
      printIframe.contentDocument.close();

      // Esperar a que el contenido se cargue para imprimir (solo una vez)
      setTimeout(() => {
        try {
          // Verificar si la ventana está disponible antes de imprimir
          if (printIframe.contentWindow) {
            printIframe.contentWindow.print();
            // Eliminar el iframe después de un tiempo
            setTimeout(() => {
              document.body.removeChild(printIframe);
              toast.success("Documento enviado a impresión");
            }, 1000);
          } else {
            document.body.removeChild(printIframe);
            toast.error("Error durante la impresión: ventana no disponible");
          }
        } catch (err) {
          document.body.removeChild(printIframe);
          toast.error("Error durante la impresión");
          console.error("Error de impresión:", err);
        }
      }, 500);
    } catch (err) {
      toast.error("Error al preparar la impresión");
      console.error("Error de impresión:", err);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCompletedSale(null);

    // Asegurarse de que el estado está limpio
    if (saleState.customer !== null || saleState.items.length > 0) {
      // Reiniciar el estado explícitamente
      setSaleState({
        customer: null,
        items: [],
        paymentMethod: PaymentMethod.EFECTIVO,
        total: 0,
        subtotal: 0,
        tax: 0,
      });
      setPaymentDetails({});
    }

    // Limpiar almacenamiento
    clearSaleStorage();

    // Enfocar en la búsqueda de cliente para comenzar una nueva venta
    customerSearchRef.current?.focus();

    // Mostrar notificación de nueva venta lista
    toast.success("Listo para iniciar una nueva venta");
  };

  // Función para limpiar el carrito
  const handleClearCart = () => {
    setSaleState((prev) => ({
      ...prev,
      items: [],
    }));
    clearSaleStorage();
    toast.success("Carrito limpiado completamente");
  };

  const handleDownloadPDF = async () => {
    if (!completedSale) {
      toast.error("No hay una venta completada para generar PDF");
      return;
    }

    try {
      // Validar que los datos necesarios estén presentes
      if (!completedSale.customer) {
        toast.error("No hay datos de cliente para la factura");
        return;
      }

      const items =
        completedSale.saleitem
          ?.filter((item) => item.product)
          .map((item) => ({
            productId: item.productId,
            product: item.product!,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })) || [];

      if (items.length === 0) {
        toast.error("No hay productos en la venta para generar PDF");
        return;
      }

      // Generar PDF usando nuestro servicio
      toast.info("Generando PDF...");
      const pdfBlob = await PDFService.generateSaleReceipt(
        completedSale,
        completedSale.customer as Customer,
        items
      );

      // Crear URL para descargar el PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura-${
        completedSale.invoice?.number || completedSale.id
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF descargado correctamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <>
      <div className="sale-container grid grid-cols-1 lg:grid-cols-12 h-screen max-h-screen overflow-hidden bg-background">
        {/* Panel de atajos de teclado */}
        <div
          className={`fixed bottom-4 right-4 bg-background/90 backdrop-blur-sm border shadow-lg p-3 rounded-lg transition-all duration-300 z-50 ${
            showShortcuts
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">
              Atajos de Teclado
            </h3>
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showShortcuts ? "Ocultar atajos" : "Mostrar atajos"}
            >
              {showShortcuts ? "▼" : "▲"}
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                F1
              </kbd>
              <span className="text-muted-foreground">Cliente</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                F2
              </kbd>
              <span className="text-muted-foreground">Producto</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                F3
              </kbd>
              <span className="text-muted-foreground">Método</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                F4
              </kbd>
              <span className="text-muted-foreground">Procesar</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                Alt+L
              </kbd>
              <span className="text-muted-foreground">Limpiar</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                Alt+X
              </kbd>
              <span className="text-muted-foreground">Cerrar recibo</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-accent rounded text-accent-foreground">
                Alt+Q/W/E
              </kbd>
              <span className="text-muted-foreground">Cambiar sección</span>
            </div>
          </div>
        </div>

        {/* Sección Izquierda: Selección de cliente y búsqueda de productos (25%) */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r p-4 flex flex-col h-full overflow-hidden">
          <div className="customer-selection mb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center text-foreground">
              <span className="mr-2 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                F1
              </span>
              Selección de Cliente
            </h2>
            <CustomerSearch
              onCustomerSelect={handleCustomerSelect}
              inputRef={customerSearchRef}
            />
          </div>

          <div className="product-search flex-1 overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-2 flex items-center text-foreground">
              <span className="mr-2 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                F2
              </span>
              Búsqueda de Productos
            </h2>
            <ProductSearch
              onAddToCart={addItemToCart}
              inputRef={productSearchRef}
            />
          </div>
        </div>

        {/* Sección Central: Carrito actual (50%) */}
        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r p-4 h-full flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-foreground">
              Carrito de Compras
            </h2>
            {saleState.items.length > 0 && (
              <button
                className="text-destructive text-sm hover:text-destructive/90 flex items-center transition-colors"
                onClick={() => setShowClearCartDialog(true)}
                aria-label="Limpiar carrito"
              >
                <span className="mr-1">Limpiar</span>
                <kbd className="px-1 bg-destructive/10 text-destructive text-xs rounded">
                  Alt+L
                </kbd>
              </button>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <CartView
              items={saleState.items}
              onUpdateItem={updateCartItem}
              onRemoveItem={removeCartItem}
            />
          </div>
        </div>

        {/* Sección Derecha: Resumen y pago (25%) */}
        <div className="lg:col-span-3 p-4 h-full flex flex-col overflow-auto">
          <h2 className="text-lg font-semibold mb-2 text-foreground">
            Resumen de Venta
          </h2>
          <div className="summary mb-4 p-3 bg-accent/50 rounded-lg border">
            <p className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>{" "}
              <span>${saleState.subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-muted-foreground">
              <span>
                {TAX_CONFIG.label} ({TAX_CONFIG.percentage}):
              </span>{" "}
              <span>${saleState.tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t text-foreground">
              <span>TOTAL:</span> <span>${saleState.total.toFixed(2)}</span>
            </p>
          </div>

          <div className="payment-method mb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center text-foreground">
              <span className="mr-2 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                F3
              </span>
              Método de Pago
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {paymentMethods.map((method, index) => (
                <button
                  key={method}
                  ref={
                    method === PaymentMethod.EFECTIVO
                      ? effectivoButtonRef
                      : method === PaymentMethod.PAGO_MOVIL
                      ? pagoMovilButtonRef
                      : method === PaymentMethod.TRANSFERENCIA
                      ? transferenciaButtonRef
                      : puntoButtonRef
                  }
                  className={`p-2 rounded-lg border transition-all duration-200 flex justify-center items-center ${
                    saleState.paymentMethod === method
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handlePaymentMethodChange(method)}
                  aria-label={`Pago con ${method.toLowerCase()}`}
                  aria-pressed={saleState.paymentMethod === method}
                >
                  <span>
                    {method === PaymentMethod.EFECTIVO
                      ? "Efectivo"
                      : method === PaymentMethod.PAGO_MOVIL
                      ? "Pago Móvil"
                      : method === PaymentMethod.TRANSFERENCIA
                      ? "Transferencia"
                      : "Punto de Venta"}
                  </span>
                  <kbd className="ml-1 px-1 bg-accent text-accent-foreground text-xs rounded">
                    Alt+{index + 1}
                  </kbd>
                </button>
              ))}
            </div>

            {/* Mostrar detalles específicos del método de pago */}
            <div ref={paymentDetailsRef} tabIndex={-1}>
              <PaymentDetails
                method={saleState.paymentMethod}
                onDataChange={handlePaymentDetailsChange}
                total={saleState.total}
                onProcessPayment={handleProcessSaleClick}
                onCancel={() => {
                  setSaleState((prev) => ({
                    ...prev,
                    paymentMethod: PaymentMethod.EFECTIVO,
                  }));
                  setPaymentDetails({});
                }}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          <button
            ref={processButtonRef}
            className={`mt-auto p-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
              canProcessSale() && !isProcessing
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            onClick={handleProcessSaleClick}
            disabled={!canProcessSale() || isProcessing}
            aria-label="Procesar venta"
          >
            <span className="mr-2 bg-primary-foreground/10 text-primary-foreground px-2 py-1 rounded text-xs">
              F4
            </span>
            <span className="mr-1">
              {isProcessing ? "Procesando..." : "Procesar Venta"}
            </span>
            {!isProcessing && canProcessSale() && (
              <kbd className="px-1 bg-primary-foreground/10 text-primary-foreground text-xs rounded">
                Alt+V
              </kbd>
            )}
          </button>

          {/* Botón para cancelar la venta completa */}
          {(saleState.items.length > 0 || saleState.customer) && (
            <button
              className="mt-3 p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200 flex items-center justify-center"
              onClick={() => setShowCancelDialog(true)}
              aria-label="Cancelar venta"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancelar venta
              <kbd className="ml-2 px-1 bg-destructive/20 text-destructive text-xs rounded">
                Alt+B
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* Recibo de Venta (Modal) */}
      {showReceipt && completedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={receiptRef}>
            <SaleReceipt
              sale={completedSale}
              customer={completedSale.customer!}
              items={
                completedSale.saleitem
                  ?.filter((item) => item.product)
                  .map((item) => ({
                    productId: item.productId,
                    product: item.product!,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal,
                  })) || []
              }
              onClose={handleCloseReceipt}
              onPrint={handlePrintReceipt}
              onDownloadPDF={handleDownloadPDF}
            />
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para limpiar carrito */}
      <ConfirmDialog
        isOpen={showClearCartDialog}
        onClose={() => setShowClearCartDialog(false)}
        onConfirm={handleClearCart}
        title="Limpiar carrito"
        description="¿Está seguro que desea eliminar todos los productos del carrito? Esta acción no se puede deshacer."
        confirmText="Limpiar"
        cancelText="Cancelar"
        confirmVariant="destructive"
      />

      {/* Diálogo de confirmación para cancelar venta */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          clearSaleStorage();
          setSaleState({
            customer: null,
            items: [],
            paymentMethod: PaymentMethod.EFECTIVO,
            total: 0,
            subtotal: 0,
            tax: 0,
          });
          setPaymentDetails({});
          toast.success("Venta cancelada correctamente");
        }}
        title="Cancelar venta"
        description="¿Está seguro que desea cancelar esta venta? Se perderán todos los datos ingresados."
        confirmText="Cancelar venta"
        cancelText="Volver"
        confirmVariant="destructive"
      />

      {/* Diálogo de confirmación de venta */}
      <SaleConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={processSale}
        customer={saleState.customer}
        items={saleState.items}
        paymentMethod={saleState.paymentMethod}
        total={saleState.total}
        paymentDetails={paymentDetails}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default SaleContainer;
 