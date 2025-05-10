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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateRangePickerProps {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange | undefined) => void;
  className?: string;
  buttonClassName?: string;
}

export function DateRangePicker({
  dateRange,
  setDateRange,
  className = "",
  buttonClassName = "",
}: DateRangePickerProps) {
  const today = new Date();

  // Rangos predefinidos
  const predefinedRanges = [
    {
      label: "Hoy",
      value: "today",
      getRange: () => ({
        from: today,
        to: today,
      }),
    },
    {
      label: "Ayer",
      value: "yesterday",
      getRange: () => ({
        from: subDays(today, 1),
        to: subDays(today, 1),
      }),
    },
    {
      label: "Esta semana",
      value: "this_week",
      getRange: () => ({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      }),
    },
    {
      label: "Última semana",
      value: "last_week",
      getRange: () => {
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
      getRange: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
    },
    {
      label: "Último mes",
      value: "last_month",
      getRange: () => {
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
      getRange: () => ({
        from: startOfYear(today),
        to: endOfYear(today),
      }),
    },
    {
      label: "Últimos 30 días",
      value: "last_30_days",
      getRange: () => ({
        from: subDays(today, 30),
        to: today,
      }),
    },
  ];

  const applyPredefinedRange = (rangeGetter: () => DateRange) => {
    const range = rangeGetter();
    setDateRange(range);
  };

  return (
    <div className={`grid gap-2 ${className}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={`w-full md:w-[300px] justify-start text-left font-normal ${buttonClassName}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Tabs defaultValue="calendar">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="predefined">Rangos</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={es}
              />
            </TabsContent>
            <TabsContent value="predefined" className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {predefinedRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => applyPredefinedRange(range.getRange)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}
