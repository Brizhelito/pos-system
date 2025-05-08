/**
 * Utilidades de formateo para la aplicación
 */

/**
 * Formatea un valor numérico como moneda en formato venezolano
 * @param amount Cantidad a formatear
 * @returns Representación formateada como moneda
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
  }).format(amount);
};

/**
 * Formatea una fecha en formato local venezolano
 * @param date Fecha a formatear
 * @returns Fecha formateada
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Formatea una fecha y hora en formato local venezolano
 * @param date Fecha a formatear
 * @returns Fecha y hora formateada
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};
