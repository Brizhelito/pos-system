/**
 * Configuración Global de Reportes
 *
 * Este archivo centraliza todas las constantes y configuraciones usadas en los
 * componentes de reportes para facilitar el mantenimiento y personalización.
 *
 * Última actualización: Mayo 2023
 */

// Configuración de moneda
export const CURRENCY = {
  symbol: "€",
  code: "EUR",
  name: "Euro",
  format: (value: number) => `${CURRENCY.symbol}${value.toFixed(2)}`,
  formatWithCode: (value: number) =>
    `${CURRENCY.symbol}${value.toFixed(2)} ${CURRENCY.code}`,
  formatCompact: (value: number) => {
    if (value >= 1000000)
      return `${CURRENCY.symbol}${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${CURRENCY.symbol}${(value / 1000).toFixed(1)}K`;
    return `${CURRENCY.symbol}${value.toFixed(0)}`;
  },
};

// Definición de tipos para paletas de colores
type ColorPalette = string[];
type ChartColorConfig = {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  danger: ColorPalette;
  warning: ColorPalette;
  neutral: ColorPalette;
  success: ColorPalette;
  info: ColorPalette;
  pie: ColorPalette;
  sequential: ColorPalette;
  get: (palette: keyof Omit<ChartColorConfig, "get">, index: number) => string;
};

// Configuración de gráficos
export const CHART_COLORS: ChartColorConfig = {
  primary: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
  secondary: ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"],
  accent: ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff"],
  danger: ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca"],
  warning: ["#ca8a04", "#eab308", "#facc15", "#fde047", "#fef08a"],
  neutral: ["#18181b", "#27272a", "#3f3f46", "#52525b", "#71717a", "#a1a1aa"],
  success: ["#15803d", "#22c55e", "#4ade80"],
  info: ["#0369a1", "#0ea5e9", "#7dd3fc"],

  // Colores específicos para tipos de gráficos
  pie: ["#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308", "#0ea5e9"],
  sequential: [
    "#f8fafc",
    "#e2e8f0",
    "#cbd5e1",
    "#94a3b8",
    "#64748b",
    "#475569",
    "#334155",
    "#1e293b",
    "#0f172a",
  ],

  // Función para obtener colores según índice con efecto cíclico
  get: (
    palette: keyof Omit<ChartColorConfig, "get">,
    index: number
  ): string => {
    const colors = CHART_COLORS[palette];
    if (!colors || !Array.isArray(colors)) return "#000000";
    return colors[index % colors.length];
  },
};

// Configuración de fechas
export const DATE_FORMAT = {
  display: "dd/MM/yyyy",
  api: "yyyy-MM-dd",
  short: "dd MMM",
  month: "MMM yyyy",
  full: "dd MMMM yyyy",
  dayOfWeek: "EEE, dd MMM",
};

// Opciones para los reportes
export const REPORT_OPTIONS = {
  maxItemsInTables: 100,
  maxItemsInCharts: 10,
  defaultDateRange: 30, // días
  defaultTopItems: 5,
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  charts: {
    animation: {
      enabled: true,
      duration: 500,
    },
    responsiveBreakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    tooltips: {
      enabled: true,
      displayMode: "item", // 'item' | 'index'
    },
  },
};

// Configuración de exportación
export const EXPORT_OPTIONS = {
  dateFormat: "yyyy-MM-dd",
  defaultFilename: "reporte",
  formats: {
    csv: {
      delimiter: ";",
      includeHeaders: true,
    },
    excel: {
      creator: "Sistema POS",
      fileExtension: ".xlsx",
    },
    pdf: {
      orientation: "portrait", // 'portrait' | 'landscape'
      pageSize: "a4", // 'a4' | 'letter'
      includeHeader: true,
      includeFooter: true,
    },
  },
};

// Rangos de fechas predefinidos (para el componente DateRangePicker)
export const PREDEFINED_DATE_RANGES = {
  today: "Hoy",
  yesterday: "Ayer",
  thisWeek: "Esta semana",
  lastWeek: "Última semana",
  thisMonth: "Este mes",
  lastMonth: "Último mes",
  thisYear: "Este año",
  last30Days: "Últimos 30 días",
  last90Days: "Últimos 90 días",
  allTime: "Todo el tiempo",
};

// Mensajes reutilizables
export const MESSAGES = {
  noData: "No hay datos disponibles para mostrar",
  loading: "Cargando datos...",
  error: "Ocurrió un error al cargar los datos",
  noResults: "No se encontraron resultados",
  filterPlaceholder: "Filtrar...",
  exportSuccess: "Datos exportados correctamente",
  exportError: "Error al exportar datos",
};

// Nombres de clases CSS personalizables
export const CSS_CLASSES = {
  reportCard: "rounded-lg border shadow-sm",
  reportHeader: "p-4 border-b",
  reportBody: "p-6",
  reportFooter: "p-4 border-t bg-muted/50",
  positiveChange: "text-success-600 font-medium",
  negativeChange: "text-danger-600 font-medium",
  neutralChange: "text-gray-500",
};

// Breakpoints para responsive design
export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
