/**
 * Utilidades de formateo para la aplicación
 */
import { CURRENCY_CONFIG } from "@/lib/config/env";

/**
 * Formatea un valor numérico como moneda según la configuración del sistema
 * @param amount Cantidad a formatear
 * @returns Representación formateada como moneda
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: "currency",
    currency: CURRENCY_CONFIG.code,
  }).format(amount);
};

/**
 * Formatea una fecha en formato local según la configuración regional
 * @param date Fecha a formatear
 * @returns Fecha formateada
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(CURRENCY_CONFIG.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Formatea una fecha y hora en formato local según la configuración regional
 * @param date Fecha a formatear
 * @returns Fecha y hora formateada
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat(CURRENCY_CONFIG.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

/**
 * Formatea un número como porcentaje
 * @param value Valor a formatear (0-1)
 * @param decimals Número de decimales a mostrar
 * @returns Cadena formateada como porcentaje
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formatea un precio con el símbolo de moneda
 * @param price Precio a formatear
 * @returns Precio formateado con símbolo de moneda
 */
export const formatPrice = (price: number): string => {
  return `${CURRENCY_CONFIG.symbol}${price.toFixed(2)}`;
};
