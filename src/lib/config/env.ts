/**
 * Configuración centralizada basada en variables de entorno
 * Este archivo carga todas las variables de entorno y proporciona valores predeterminados seguros
 */

// Configuración de la base de datos
export const DATABASE_CONFIG = {
  url:
    process.env.DATABASE_URL ||
    "postgresql://username:password@localhost:5432/pos_system",
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  secretCookiePassword:
    process.env.SECRET_COOKIE_PASSWORD ||
    "una-contraseña-segura-de-al-menos-32-caracteres",
  bcryptPepper: process.env.BCRYPT_PEPPER || "un-valor-secreto-para-bcrypt",
  sessionDurationDays: Number(process.env.SESSION_DURATION_DAYS || 7),
  cookieName: "app-session",
};

// Configuración de la empresa
export const COMPANY_CONFIG = {
  name: process.env.COMPANY_NAME || "Mundo de la Pasta",
  address: process.env.COMPANY_ADDRESS || "Av. Principal 123",
  city: process.env.COMPANY_CITY || "Ciudad, Estado",
  zip: process.env.COMPANY_ZIP || "12345",
  phone: process.env.COMPANY_PHONE || "+58 123-456-7890",
  email: process.env.COMPANY_EMAIL || "contacto@mundo.com",
  rif: process.env.COMPANY_RIF || "J-12345678-9",
  website: process.env.COMPANY_WEBSITE || "www.mundo.com",
  logoUrl: process.env.COMPANY_LOGO_URL || "/logo.png",
};

// Configuración de impuestos
export const TAX_CONFIG = {
  rate: Number(process.env.TAX_RATE || 0.16),
  label: process.env.TAX_LABEL || "IVA",
  percentage: process.env.TAX_RATE
    ? `${Number(process.env.TAX_RATE) * 100}%`
    : "16%",
  enabled: process.env.TAX_ENABLED ? process.env.TAX_ENABLED === "true" : true,
};

// Configuración de moneda
export const CURRENCY_CONFIG = {
  code: process.env.CURRENCY_CODE || "USD",
  symbol: process.env.CURRENCY_SYMBOL || "$",
  locale: process.env.CURRENCY_LOCALE || "en-US",
};

// Configuración de facturación
export const INVOICE_CONFIG = {
  prefix: process.env.INVOICE_PREFIX || "FAC-",
};

// Configuración general de la aplicación
export const APP_CONFIG = {
  name: process.env.APP_NAME || "POS System",
  defaultPaymentMethod: process.env.DEFAULT_PAYMENT_METHOD || "EFECTIVO",
  paginationLimit: Number(process.env.DEFAULT_PAGINATION_LIMIT || 20),
  environment: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  receiptCopyright: `© ${new Date().getFullYear()} ${
    process.env.COMPANY_NAME || "Mundo de la Pasta"
  } - Todos los derechos reservados`,
};

// Objeto de configuración para exportación por defecto
const configExport = {
  database: DATABASE_CONFIG,
  auth: AUTH_CONFIG,
  company: COMPANY_CONFIG,
  tax: TAX_CONFIG,
  currency: CURRENCY_CONFIG,
  invoice: INVOICE_CONFIG,
  app: APP_CONFIG,
};

// Exportación para facilitar el uso
export default configExport;
