import { DateRange } from "react-day-picker";
import { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";

// Interfaces base para reportes
export interface BaseReportParams {
  startDate?: Date;
  endDate?: Date;
  dateRange?: DateRange;
  limit?: number;
  page?: number;
  filter?: string;
  [key: string]: unknown;
}

export interface ReportConfiguration {
  title: string;
  subtitle: string;
  exportFilename: string;
  backLink: string;
  exportOptions: {
    dateFields?: string[];
    numberFields: string[];
    title: string;
  };
  filterOptions?: { label: string; value: string }[];
}

export interface ReportChartData {
  [key: string]: string | number;
}

export interface ReportTableOptions<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchColumn?: string;
  searchPlaceholder?: string;
  filterColumn?: string;
  filterOptions?: {
    label: string;
    value: string;
    icon?: ReactNode;
  }[];
  emptyStateMessage?: string;
}

// Tipos para comparaciones y cambios
export type PeriodComparison = {
  current: number;
  previous: number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
};

// Interfaces específicas para cada tipo de reporte
export type SalesReportData = Record<string, unknown>;

export type InventoryReportData = Record<string, unknown>;

export type CustomersReportData = Record<string, unknown>;

export type SellersReportData = Record<string, unknown>;

// Exportamos tipos e interfaces
export * from "./reports";
