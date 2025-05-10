import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { PeriodComparison } from "../types";

/**
 * Formatea una fecha como string según el formato especificado
 */
export const formatDate = (
  date: Date,
  dateFormat: string = "dd/MM/yyyy"
): string => {
  return format(date, dateFormat);
};

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (
  value: number,
  currency: string = "EUR"
): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Calcula la comparación entre dos períodos
 */
export const calculatePeriodComparison = (
  current: number,
  previous: number
): PeriodComparison => {
  const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

  const changeType =
    change > 0 ? "positive" : change < 0 ? "negative" : "neutral";

  return {
    current,
    previous,
    change: Number(change.toFixed(2)),
    changeType,
  };
};

/**
 * Obtiene las fechas de inicio y fin del mes anterior
 */
export const getPreviousMonthDateRange = () => {
  const today = new Date();
  const previousMonth = subMonths(today, 1);
  return {
    from: startOfMonth(previousMonth),
    to: endOfMonth(previousMonth),
  };
};

/**
 * Ajusta la cantidad de valores null en un conjunto de datos para gráficos
 */
export const normalizeChartData = <T extends Record<string, unknown>>(
  data: T[],
  xKey: keyof T,
  yKeys: (keyof T)[]
): T[] => {
  if (!data || data.length === 0) return [];

  // Crea un conjunto único de valores del eje X
  const xValues = [...new Set(data.map((item) => item[xKey]))];

  // Asegúrate de que cada valor X tenga un punto de datos para cada serie Y
  return xValues.map((xValue) => {
    const existingPoint = data.find((item) => item[xKey] === xValue);

    if (existingPoint) return existingPoint;

    // Crea un nuevo punto con valores cero para las series que faltan
    const newPoint = { [xKey]: xValue } as Partial<T>;
    yKeys.forEach((key) => {
      newPoint[key] = 0 as unknown as T[keyof T];
    });

    return newPoint as T;
  });
};

/**
 * Convierte datos de objeto a array para exportación
 */
export const objectToExportArray = <T extends Record<string, unknown>>(
  data: T[],
  fieldMapping: Record<keyof T, string> = {} as Record<keyof T, string>
): Array<Record<string, unknown>> => {
  return data.map((item) => {
    const result: Record<string, unknown> = {};

    Object.keys(item).forEach((key) => {
      const mappedKey = fieldMapping[key as keyof T] || key;
      result[mappedKey] = item[key as keyof T];
    });

    return result;
  });
};
