/**
 * Configuración centralizada basada en variables de entorno
 * 
 * Este archivo carga todas las variables de entorno desde el archivo .env
 * y proporciona valores predeterminados seguros en caso de que alguna variable no esté definida.
 * 
 * IMPORTANTE: No guardar información sensible directamente en este archivo.
 * Las credenciales y secretos deben colocarse únicamente en el archivo .env
 */

// =========================================
// Configuración de la Base de Datos
// =========================================
export const DATABASE_CONFIG = {
  // URL de conexión a PostgreSQL
  url:
    process.env.DATABASE_URL ||
    "postgresql://username:password@localhost:5432/pos_system",
};

// =========================================
// Configuración de Autenticación
// =========================================
export const AUTH_CONFIG = {
  // Contraseña para encriptar cookies (mínimo 32 caracteres)
  secretCookiePassword:
    process.env.SECRET_COOKIE_PASSWORD ||
    "una-contraseña-segura-de-al-menos-32-caracteres",

  // Valor secreto para reforzar el hashing de contraseñas
  bcryptPepper: process.env.BCRYPT_PEPPER || "un-valor-secreto-para-bcrypt",

  // Duración de las sesiones en días
  sessionDurationDays: Number(process.env.SESSION_DURATION_DAYS || 7),

  // Nombre de la cookie de sesión
  cookieName: "app-session",
};

// =========================================
// Información de la Empresa
// =========================================
export const COMPANY_CONFIG = {
  // Nombre comercial de la empresa
  name: process.env.COMPANY_NAME || "Mundo de la Pasta",

  // Dirección física
  address: process.env.COMPANY_ADDRESS || "Av. Principal 123",

  // Ciudad y estado
  city: process.env.COMPANY_CITY || "Ciudad, Estado",

  // Código postal
  zip: process.env.COMPANY_ZIP || "12345",

  // Teléfono de contacto
  phone: process.env.COMPANY_PHONE || "+58 123-456-7890",

  // Correo electrónico de contacto
  email: process.env.COMPANY_EMAIL || "contacto@mundo.com",

  // RIF o número de identificación fiscal
  rif: process.env.COMPANY_RIF || "J-12345678-9",

  // Sitio web de la empresa
  website: process.env.COMPANY_WEBSITE || "www.mundo.com",

  // URL del logotipo de la empresa
  logoUrl: process.env.COMPANY_LOGO_URL || "/logo.png",
};

/**
 * Función auxiliar para convertir string a booleano de forma segura
 * Convierte "true", "1", "yes" a true, todo lo demás a false
 */
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

// =========================================
// Configuración de Impuestos
// =========================================
export const TAX_CONFIG = {
  // Tasa de impuesto (como decimal, ej: 0.16 para 16%)
  rate: Number(process.env.TAX_RATE || 0.16),

  // Etiqueta para mostrar en facturas y recibos
  label: process.env.TAX_LABEL || "IVA",

  // Formato de porcentaje para mostrar (ej: "16%")
  percentage: process.env.TAX_RATE
    ? `${Number(process.env.TAX_RATE) * 100}%`
    : "16%",

  // Habilitar o deshabilitar cálculo de impuestos
  enabled: parseBoolean(process.env.TAX_ENABLED),

  /**
   * Calcula el impuesto para un monto dado
   * Si los impuestos están deshabilitados, devuelve 0
   */
  calculate: function (amount: number): number {
    if (!this.enabled) return 0;
    return amount * this.rate;
  },

  /**
   * Calcula el monto total incluyendo impuestos
   * Si los impuestos están deshabilitados, devuelve el monto original
   */
  calculateTotal: function (amount: number): number {
    if (!this.enabled) return amount;
    return amount + this.calculate(amount);
  },
};

// =========================================
// Configuración de Moneda
// =========================================
export const CURRENCY_CONFIG = {
  // Código de moneda según ISO 4217 (ej: USD, EUR, VES)
  code: process.env.CURRENCY_CODE || "USD",

  // Símbolo de la moneda (ej: $, €, Bs.)
  symbol: process.env.CURRENCY_SYMBOL || "$",

  // Configuración regional para formateo
  locale: process.env.CURRENCY_LOCALE || "es-VE",

  /**
   * Formatea un valor numérico a formato de moneda
   */
  format: function (value: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency: this.code,
    }).format(value);
  },
};

// =========================================
// Configuración de Facturación
// =========================================
export const INVOICE_CONFIG = {
  // Prefijo para números de factura (ej: "FAC-", "INV-", etc.)
  prefix: process.env.INVOICE_PREFIX || "FAC-",
};

// =========================================
// Configuración General de la Aplicación
// =========================================
export const APP_CONFIG = {
  // Nombre de la aplicación
  name: process.env.APP_NAME || "Sistema POS",

  // Método de pago predeterminado
  defaultPaymentMethod: process.env.DEFAULT_PAYMENT_METHOD || "EFECTIVO",

  // Límite predeterminado para paginación
  paginationLimit: Number(process.env.DEFAULT_PAGINATION_LIMIT || 20),

  // Entorno de ejecución (development, production, test)
  environment: process.env.NODE_ENV || "development",

  // Indicador si estamos en producción
  isProduction: process.env.NODE_ENV === "production",

  // Texto de copyright para recibos y facturas
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
