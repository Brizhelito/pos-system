export interface ReportConfig {
  title: string;
  subtitle: string;
  exportFilename: string;
  exportOptions: {
    dateFields?: string[];
    numberFields: string[];
    title: string;
  };
  filterOptions?: { label: string; value: string }[];
}

export const RFM_REPORT_CONFIG: ReportConfig = {
  title: "Análisis RFM de Clientes",
  subtitle:
    "Segmentación de clientes basada en Recencia, Frecuencia y Monetización",
  exportFilename: "analisis-rfm-clientes",
  exportOptions: {
    dateFields: [],
    numberFields: ["recencia", "frecuencia", "monetizacion", "puntuacionRFM"],
    title: "Análisis RFM de Clientes",
  },
  filterOptions: [
    { label: "Campeones", value: "Campeones" },
    { label: "Leales", value: "Leales" },
    { label: "Potenciales", value: "Potenciales" },
    { label: "En Riesgo", value: "En Riesgo" },
    { label: "Necesitan Atención", value: "Necesitan Atención" },
    { label: "Nuevos", value: "Nuevos" },
    { label: "Durmientes", value: "Durmientes" },
    { label: "Ocasionales", value: "Ocasionales" },
  ],
};

export const LIFECYCLE_REPORT_CONFIG: ReportConfig = {
  title: "Ciclo de Vida de Clientes",
  subtitle: "Análisis del valor del cliente a lo largo del tiempo",
  exportFilename: "ciclo-vida-clientes",
  exportOptions: {
    dateFields: ["primerCompra", "ultimaCompra"],
    numberFields: [
      "diasComoCliente",
      "comprasPorMes",
      "valorTotal",
      "valorPromedio",
    ],
    title: "Ciclo de Vida de Clientes",
  },
  filterOptions: [
    { label: "Activo", value: "Activo" },
    { label: "Inactivo", value: "Inactivo" },
    { label: "Nuevo", value: "Nuevo" },
    { label: "En riesgo", value: "En riesgo" },
  ],
};

export const RETENTION_REPORT_CONFIG: ReportConfig = {
  title: "Tasa de Retención",
  subtitle: "Análisis de retención de clientes por periodo",
  exportFilename: "tasa-retencion-clientes",
  exportOptions: {
    dateFields: [],
    numberFields: ["nuevos", "recurrentes", "perdidos", "tasaRetencion"],
    title: "Tasa de Retención de Clientes",
  },
};

export const SEASONAL_REPORT_CONFIG: ReportConfig = {
  title: "Patrones Estacionales",
  subtitle: "Análisis de patrones de compra por estación o periodo",
  exportFilename: "patrones-estacionales-clientes",
  exportOptions: {
    dateFields: [],
    numberFields: ["clientes", "transacciones", "valorPromedio", "valorTotal"],
    title: "Patrones Estacionales de Compra",
  },
};

// Configuración para reportes de vendedores
export const SELLER_SUMMARY_CONFIG: ReportConfig = {
  title: "Resumen de Vendedores",
  subtitle: "Análisis de rendimiento por vendedor",
  exportFilename: "resumen-vendedores",
  exportOptions: {
    dateFields: [],
    numberFields: ["numVentas", "totalVentas", "ticketPromedio"],
    title: "Resumen de Vendedores",
  },
};

export const SELLER_PRODUCTS_CONFIG: ReportConfig = {
  title: "Productos por Vendedor",
  subtitle: "Productos más vendidos por cada vendedor",
  exportFilename: "productos-por-vendedor",
  exportOptions: {
    dateFields: [],
    numberFields: ["cantidad", "total"],
    title: "Productos por Vendedor",
  },
};
