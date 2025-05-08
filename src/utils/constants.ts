// Configuración de la empresa
export const COMPANY_INFO = {
  name: "Mundo de la Pasta",
  address: "Av. Principal 123",
  city: "Ciudad, Estado",
  zip: "12345",
  phone: "+58 123-456-7890",
  email: "contacto@mundo.com",
  rif: "J-12345678-9", // Registro de Información Fiscal (Venezuela)
  website: "www.mundo.com",
  logoUrl: "/logo.png", // Ruta relativa desde public
};

// Configuración de impuestos
export const TAX_CONFIG = {
  rate: 0.16, // 16%
  label: "IVA",
  percentage: "16%",
  enabled: true, // Si está deshabilitado, no se calcula impuesto
};

// Configuración de moneda
export const CURRENCY_CONFIG = {
  code: "USD",
  symbol: "$",
  locale: "en-US",
};

// Otros valores constantes para la aplicación
export const APP_CONFIG = {
  receiptCopyright: "© 2025 Mundo de la Pasta - Todos los derechos reservados",
  defaultPaymentMethod: "EFECTIVO",
};
