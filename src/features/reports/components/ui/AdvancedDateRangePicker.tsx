"use client";

import * as React from "react";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card, CardContent } from "@/components/ui/card";

export interface DateRangeOption {
  label: string;
  value: string;
  dateRange: DateRange | (() => DateRange);
}

interface AdvancedDateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  align?: "start" | "center" | "end";
  className?: string;
  additionalOptions?: DateRangeOption[];
  placeholder?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export function AdvancedDateRangePicker({
  value,
  onChange,
  align = "start",
  className = "",
  additionalOptions = [],
  placeholder = "Seleccionar fechas",
  showIcon = true,
  compact = false,
}: AdvancedDateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedPresetLabel, setSelectedPresetLabel] =
    React.useState<string>("");

  const today = React.useMemo(() => new Date(), []);

  // Combinar opciones predeterminadas con opciones adicionales
  const presets = React.useMemo(() => {
    // Opciones de rango predefinidas
    const defaultPresets: DateRangeOption[] = [
      {
        label: "Hoy",
        value: "today",
        dateRange: {
          from: today,
          to: today,
        },
      },
      {
        label: "Ayer",
        value: "yesterday",
        dateRange: {
          from: subDays(today, 1),
          to: subDays(today, 1),
        },
      },
      {
        label: "Últimos 7 días",
        value: "last_7_days",
        dateRange: {
          from: subDays(today, 6),
          to: today,
        },
      },
      {
        label: "Esta semana",
        value: "this_week",
        dateRange: {
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        },
      },
      {
        label: "Última semana",
        value: "last_week",
        dateRange: () => {
          const lastWeekStart = subDays(
            startOfWeek(today, { weekStartsOn: 1 }),
            7
          );
          return {
            from: lastWeekStart,
            to: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
          };
        },
      },
      {
        label: "Este mes",
        value: "this_month",
        dateRange: {
          from: startOfMonth(today),
          to: endOfMonth(today),
        },
      },
      {
        label: "Último mes",
        value: "last_month",
        dateRange: () => {
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return {
            from: startOfMonth(lastMonth),
            to: endOfMonth(lastMonth),
          };
        },
      },
      {
        label: "Este año",
        value: "this_year",
        dateRange: {
          from: startOfYear(today),
          to: endOfYear(today),
        },
      },
      {
        label: "Últimos 30 días",
        value: "last_30_days",
        dateRange: {
          from: subDays(today, 29),
          to: today,
        },
      },
      {
        label: "Últimos 90 días",
        value: "last_90_days",
        dateRange: {
          from: subDays(today, 89),
          to: today,
        },
      },
    ];

    return [...defaultPresets, ...additionalOptions];
  }, [today, additionalOptions]);

  // Aplica un rango predefinido
  const applyPreset = (preset: DateRangeOption) => {
    let rangeToApply: DateRange;

    if (typeof preset.dateRange === "function") {
      rangeToApply = preset.dateRange();
    } else {
      rangeToApply = preset.dateRange;
    }

    onChange(rangeToApply);
    setSelectedPresetLabel(preset.label);
    setIsCalendarOpen(false);
  };

  // Verifica si el rango actual coincide con algún preset
  React.useEffect(() => {
    if (!value?.from || !value?.to) return;

    // Buscar si algún preset coincide con el rango actual
    for (const preset of presets) {
      const presetRange =
        typeof preset.dateRange === "function"
          ? preset.dateRange()
          : preset.dateRange;

      if (
        presetRange.from &&
        presetRange.to &&
        isSameDay(value.from, presetRange.from) &&
        isSameDay(value.to, presetRange.to)
      ) {
        setSelectedPresetLabel(preset.label);
        return;
      }
    }

    // Si no coincide con ningún preset, establecer etiqueta personalizada
    setSelectedPresetLabel("");
  }, [value, presets]);

  const formatDateRange = () => {
    if (!value?.from) return placeholder;

    if (selectedPresetLabel) {
      return selectedPresetLabel;
    }

    if (value.to) {
      return `${format(value.from, "dd/MM/yyyy", { locale: es })} - ${format(
        value.to,
        "dd/MM/yyyy",
        { locale: es }
      )}`;
    }

    return format(value.from, "dd/MM/yyyy", { locale: es });
  };

  return (
    <div
      className={`flex ${compact ? "flex-col" : "flex-row"} gap-2 ${className}`}
    >
      {/* Selector de calendario */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${compact ? "w-full" : "flex-1"} justify-between`}
          >
            {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
            <span className="truncate">{formatDateRange()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Card>
            <CardContent className="p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={value?.from}
                selected={value}
                onSelect={(newRange) => {
                  if (newRange) onChange(newRange);
                }}
                numberOfMonths={2}
                locale={es}
              />

              <div className="flex flex-wrap gap-2 p-3 border-t">
                {presets.slice(0, 6).map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
