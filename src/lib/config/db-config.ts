/**
 * Exportación centralizada de configuraciones desde variables de entorno
 * Este archivo reemplaza la configuración antigua basada en base de datos
 */
import { INVOICE_CONFIG, TAX_CONFIG, APP_CONFIG } from "./env";

export const getInvoicePrefix = (): string => {
  return INVOICE_CONFIG.prefix;
};

export const getTaxRate = (): number => {
  return TAX_CONFIG.rate;
};

export const getDefaultPaymentMethod = (): string => {
  return APP_CONFIG.defaultPaymentMethod;
};
