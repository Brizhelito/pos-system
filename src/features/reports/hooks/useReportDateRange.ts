"use client";

import { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";

interface UseReportDateRangeOptions {
  defaultDays?: number;
  onRangeChange?: (range: DateRange) => void;
}

export function useReportDateRange(options: UseReportDateRangeOptions = {}) {
  const { defaultDays = 30, onRangeChange } = options;

  // Inicializar con rango de fechas predeterminado (últimos X días)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - defaultDays)),
    to: new Date(),
  });

  // Verificar si el rango es válido (con from y to definidos)
  const isDateRangeValid = useCallback(() => {
    return Boolean(dateRange.from && dateRange.to);
  }, [dateRange]);

  // Handler para actualizar el rango de fechas
  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      if (range && range.from && range.to) {
        setDateRange(range);
        onRangeChange?.(range);
      }
    },
    [onRangeChange]
  );

  // Calcular diferencia de días entre las fechas
  const daysBetween = useCallback(() => {
    if (!dateRange.from || !dateRange.to) return 0;

    const diffTime = Math.abs(
      dateRange.to.getTime() - dateRange.from.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [dateRange]);

  return {
    dateRange,
    setDateRange: handleDateRangeChange,
    isDateRangeValid,
    daysBetween,
  };
}
