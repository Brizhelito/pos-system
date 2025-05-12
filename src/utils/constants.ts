import {
  COMPANY_CONFIG,
  TAX_CONFIG as ENV_TAX_CONFIG,
  CURRENCY_CONFIG as ENV_CURRENCY_CONFIG,
  APP_CONFIG as ENV_APP_CONFIG,
} from "@/lib/config/env";

// Configuración de la empresa
export const COMPANY_INFO = COMPANY_CONFIG;

// Configuración de impuestos
export const TAX_CONFIG = ENV_TAX_CONFIG;

// Configuración de moneda
export const CURRENCY_CONFIG = ENV_CURRENCY_CONFIG;

// Otros valores constantes para la aplicación
export const APP_CONFIG = ENV_APP_CONFIG;
