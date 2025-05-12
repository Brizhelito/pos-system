/**
 * Tipos para los reportes financieros
 */

// Análisis de rentabilidad
export interface ProfitAnalysisData {
  periodo: string;
  ingresos: number;
  costos: number;
  gananciaBruta: number;
  margenBruto: number;
  gastos: number;
  gananciaNeta: number;
  margenNeto: number;
}

// Flujo de caja
export interface CashFlowData {
  fecha: string;
  ingresosVentas: number;
  otrosIngresos: number;
  totalIngresos: number;
  pagosProveedores: number;
  gastosOperativos: number;
  otrosEgresos: number;
  totalEgresos: number;
  flujoNeto: number;
  saldoAcumulado: number;
}

// Análisis de costos vs ingresos
export interface CostVsRevenueData {
  categoria: string;
  producto?: string;
  ingresos: number;
  costos: number;
  margen: number;
  porcentajeMargen: number;
  unidadesVendidas: number;
  puntoEquilibrio: number;
}

// Reporte fiscal
export interface TaxReportData {
  periodo: string;
  ventasNetas: number;
  impuestosCobrados: number;
  impuestosPagados: number;
  saldoImpuestos: number;
  baseImponible: number;
  tasaImpositiva: number;
}

// Desglose de gastos
export interface ExpenseBreakdownData {
  categoria: string;
  subcategoria?: string;
  monto: number;
  porcentaje: number;
  tendencia: number; // porcentaje de cambio con respecto al periodo anterior
}

// Resumen financiero
export interface FinancialSummaryData {
  totalIngresos: number;
  totalCostos: number;
  totalGastos: number;
  gananciaBruta: number;
  gananciaNeta: number;
  margenBruto: number;
  margenNeto: number;
  roi: number;
  liquidez: number;
}

// Parámetros para reportes financieros
export interface FinancialReportParams {
  startDate?: Date;
  endDate?: Date;
  period?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  categories?: string[];
  includeTax?: boolean;
  includeCredits?: boolean;
}
