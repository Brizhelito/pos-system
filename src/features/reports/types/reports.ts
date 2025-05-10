// Tipos comunes para reportes

// Intervalo de fechas
export interface DateInterval {
  startDate: Date;
  endDate: Date;
}

// Parámetros base para reportes
export interface ReportBaseParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

// Filtro para reportes
export interface ReportFilter {
  id: string;
  label: string;
  type:
    | "select"
    | "multiselect"
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "daterange";
  options?: Array<{ label: string; value: string | number | boolean }>;
  defaultValue?: unknown;
}

// Interfaz genérica para configuración de reportes
export interface ReportConfig<T = unknown> {
  title: string;
  description?: string;
  filters?: ReportFilter[];
  columns: ReportColumn<T>[];
  defaultSorting?: { id: string; desc: boolean };
}

// Columna para tablas de reportes
export interface ReportColumn<T = unknown> {
  id: string;
  header: string;
  accessorKey?: string;
  cell?: (row: T) => React.ReactNode;
  enableSorting?: boolean;
  meta?: Record<string, unknown>;
}

// Métrica para tarjetas
export interface ReportMetric {
  title: string;
  value: string | number;
  change?: string | number;
  icon?: React.ReactNode;
  changeType?: "positive" | "negative" | "neutral";
}

// Respuesta genérica para reportes
export interface ReportResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
