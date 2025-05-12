"use client";

import React, { useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProfitAnalysisData } from "@/features/reports/types/finances";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, TrendingUp, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCY } from "../../config/constants";
import { ExportButtons } from "../../components/ExportButtons";

interface ProfitMarginChartProps {
  data: ProfitAnalysisData[];
  title?: string;
  subtitle?: string;
}

// Definir tipos de datos para el gráfico
interface ChartDatum {
  [key: string]: string | number;
}

export const ProfitMarginChart = ({
  data,
  title = "Análisis de Rentabilidad",
  subtitle = "",
}: ProfitMarginChartProps) => {
  const [displayMetric, setDisplayMetric] = useState<"amounts" | "margins">(
    "amounts"
  );
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Función para formatear la moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(CURRENCY.code === "USD" ? "en-US" : "es-ES", {
      style: "currency",
      currency: CURRENCY.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  // Función para formatear períodos en formatos variados
  const formatPeriod = (periodo: string) => {
    try {
      if (periodo.includes("-S")) {
        // Es formato semanal (YYYY-SWW)
        const [year, week] = periodo.split("-S");
        return `S${week}'${year.slice(2)}`; // Formato más conciso: S01'23
      } else if (periodo.length === 7) {
        // Es formato mensual (YYYY-MM)
        const date = new Date(periodo + "-01");
        return format(date, "MMM yy", { locale: es }); // Usar año con 2 dígitos
      } else if (periodo.length === 10) {
        // Es formato diario (YYYY-MM-DD)
        const date = new Date(periodo);
        return format(date, "dd MMM", { locale: es });
      }
      return periodo;
    } catch {
      return periodo;
    }
  };

  // Transformar datos según la métrica seleccionada
  const chartData = useMemo(() => {
    return data.map((item) => {
      if (displayMetric === "amounts") {
        return {
          periodo: formatPeriod(item.periodo),
          Ingresos: Math.round(item.ingresos),
          Costos: Math.round(item.costos),
          Gastos: Math.round(item.gastos),
          "Ganancia Neta": Math.round(item.gananciaNeta),
        } as ChartDatum;
      } else {
        return {
          periodo: formatPeriod(item.periodo),
          "Margen Bruto": Math.round(item.margenBruto * 10) / 10,
          "Margen Neto": Math.round(item.margenNeto * 10) / 10,
        } as ChartDatum;
      }
    });
  }, [data, displayMetric]);

  // Preparar datos para exportación
  const getExportData = () => {
    return data.map((item) => ({
      Periodo: item.periodo,
      Ingresos: item.ingresos,
      Costos: item.costos,
      Gastos: item.gastos,
      GananciaNeta: item.gananciaNeta,
      MargenBruto: item.margenBruto,
      MargenNeto: item.margenNeto,
    }));
  };

  // Determinar si necesitamos rotar las etiquetas basado en el número de períodos
  const shouldRotateLabels = data.length > 6;

  // Paletas de colores optimizadas para modo claro y oscuro
  const lightThemeColors = ["#4ade80", "#f87171", "#fdba74", "#60a5fa"];
  const darkThemeColors = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];
  const marginColors = isDark ? ["#22c55e", "#3b82f6"] : ["#4ade80", "#60a5fa"];

  // Definir las claves de datos según el modo de visualización
  const amountKeys = ["Ingresos", "Costos", "Gastos", "Ganancia Neta"];
  const marginKeys = ["Margen Bruto", "Margen Neto"];

  // Calcular datos de resumen para el cuadro de resumen
  const summaryData = useMemo(() => {
    if (!data || data.length < 2) return null;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    const ingresosTrend = latest.ingresos - previous.ingresos;
    const ingresosPct = (ingresosTrend / previous.ingresos) * 100;

    const gananciaNetaTrend = latest.gananciaNeta - previous.gananciaNeta;
    const gananciaNetaPct =
      (gananciaNetaTrend / Math.max(1, previous.gananciaNeta)) * 100;

    const margenNetoDiff = latest.margenNeto - previous.margenNeto;

    return {
      ingresosTrend,
      ingresosPct,
      gananciaNetaTrend,
      gananciaNetaPct,
      margenNetoDiff,
      latest,
    };
  }, [data]);

  // Configuración común para ambos tipos de gráficos
  const commonConfig = {
    indexBy: "periodo",
    margin: {
      top: 40,
      right: 130,
      bottom: shouldRotateLabels ? 60 : 80, // Más espacio si las etiquetas son horizontales
      left: displayMetric === "amounts" ? 70 : 40,
    },
    padding: shouldRotateLabels ? 0.4 : 0.3, // Más padding si hay muchas barras
    valueScale: { type: "linear" } as const,
    indexScale: { type: "band", round: true } as const,
    borderRadius: 4,
    borderWidth: isDark ? 1 : 0,
    axisTop: null,
    axisRight: null,
    axisBottom: {
      tickSize: 5,
      tickPadding: 10,
      tickRotation: shouldRotateLabels ? -45 : 0, // Rotar solo si hay muchos períodos
      legend: "Período",
      legendPosition: "middle" as const,
      legendOffset: 45,
      truncateTickAt: 0,
    },
    enableGridY: true,
    gridYValues: 5,
    labelSkipWidth: 32,
    labelSkipHeight: 20,
    valueFormat: (value: number | string) =>
      Math.round(Number(value)).toString(),
    animate: true,
    motionConfig: "gentle",
    role: "application",
    ariaLabel: "Gráfico de Análisis Financiero",
  };

  // Configuración del tema para el gráfico de barras
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: isDark ? "#94a3b8" : "#64748b",
          fontSize: 10, // Reducir tamaño de fuente para evitar solapamiento
        },
      },
      legend: {
        text: {
          fill: isDark ? "#e2e8f0" : "#334155",
          fontSize: 12,
          fontWeight: "bold",
        },
      },
    },
    grid: {
      line: {
        stroke: isDark ? "#334155" : "#e2e8f0",
        strokeWidth: 1,
        strokeDasharray: "4 4",
      },
    },
    legends: {
      text: {
        fill: isDark ? "#e2e8f0" : "#334155",
        fontSize: 12,
      },
    },
    tooltip: {
      container: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#e2e8f0" : "#334155",
        fontSize: 12,
        borderRadius: 8,
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Tarjetas de resumen */}
      {summaryData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              "rounded-lg p-3 flex items-center justify-between",
              isDark ? "bg-slate-800/60" : "bg-blue-50/60"
            )}
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Ingresos
              </p>
              <p className="text-lg font-bold">
                {formatCurrency(summaryData.latest.ingresos)}
              </p>
              <div className="flex items-center text-xs mt-1">
                <span
                  className={
                    summaryData.ingresosPct >= 0
                      ? "text-emerald-500 flex items-center"
                      : "text-red-500 flex items-center"
                  }
                >
                  {summaryData.ingresosPct >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(summaryData.ingresosPct).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs anterior</span>
              </div>
            </div>
            <CircleDollarSign
              className={cn(
                "h-8 w-8 opacity-80",
                isDark ? "text-blue-400" : "text-blue-500"
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn(
              "rounded-lg p-3 flex items-center justify-between",
              isDark ? "bg-slate-800/60" : "bg-emerald-50/60"
            )}
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Ganancia
              </p>
              <p className="text-lg font-bold">
                {formatCurrency(summaryData.latest.gananciaNeta)}
              </p>
              <div className="flex items-center text-xs mt-1">
                <span
                  className={
                    summaryData.gananciaNetaPct >= 0
                      ? "text-emerald-500 flex items-center"
                      : "text-red-500 flex items-center"
                  }
                >
                  {summaryData.gananciaNetaPct >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(summaryData.gananciaNetaPct).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs anterior</span>
              </div>
            </div>
            <TrendingUp
              className={cn(
                "h-8 w-8 opacity-80",
                isDark ? "text-emerald-400" : "text-emerald-500"
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={cn(
              "rounded-lg p-3 flex items-center justify-between",
              isDark ? "bg-slate-800/60" : "bg-indigo-50/60"
            )}
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Margen Neto
              </p>
              <p className="text-lg font-bold">
                {summaryData.latest.margenNeto.toFixed(1)}%
              </p>
              <div className="flex items-center text-xs mt-1">
                <span
                  className={
                    summaryData.margenNetoDiff >= 0
                      ? "text-emerald-500 flex items-center"
                      : "text-red-500 flex items-center"
                  }
                >
                  {summaryData.margenNetoDiff >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(summaryData.margenNetoDiff).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs anterior</span>
              </div>
            </div>
            <div
              className={cn(
                "text-2xl font-bold opacity-80",
                isDark ? "text-indigo-400" : "text-indigo-500"
              )}
            >
              %
            </div>
          </motion.div>
        </div>
      )}

      {/* Gráfico principal */}
      <Card className="w-full bg-white dark:bg-slate-800/70 border-0 overflow-hidden shadow-md rounded-xl">
        <CardHeader className="pb-2 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-br-full" />
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {title}
              </CardTitle>
              {subtitle && (
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  {subtitle}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ExportButtons
                data={getExportData()}
                filename="analisis-rentabilidad"
                numberFields={[
                  "Ingresos",
                  "Costos",
                  "Gastos",
                  "GananciaNeta",
                  "MargenBruto",
                  "MargenNeto",
                ]}
                title="Análisis de Rentabilidad"
              />
              <Select
                value={displayMetric}
                onValueChange={(value) =>
                  setDisplayMetric(value as "amounts" | "margins")
                }
              >
                <SelectTrigger className="w-[180px] bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 shadow-sm">
                  <SelectValue placeholder="Seleccionar vista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amounts">Montos</SelectItem>
                  <SelectItem value="margins">Márgenes (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={displayMetric}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-[400px] pt-3"
            >
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No hay datos disponibles para el período seleccionado
                </div>
              ) : (
                <ResponsiveBar
                  data={chartData}
                  keys={displayMetric === "amounts" ? amountKeys : marginKeys}
                  colors={
                    displayMetric === "amounts"
                      ? isDark
                        ? darkThemeColors
                        : lightThemeColors
                      : marginColors
                  }
                  {...commonConfig}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend:
                      displayMetric === "amounts"
                        ? `Monto (${CURRENCY.symbol})`
                        : "Porcentaje (%)",
                    legendPosition: "middle",
                    legendOffset: -50,
                    format: (value) => {
                      if (displayMetric === "amounts") {
                        // Usar enteros para los montos
                        return formatCurrency(Number(value)).replace(
                          CURRENCY.symbol,
                          ""
                        );
                      } else {
                        // Usar enteros para los porcentajes
                        return `${Math.round(Number(value))}%`;
                      }
                    },
                    truncateTickAt: 0,
                  }}
                  theme={chartTheme}
                  tooltip={({ id, value, color }) => {
                    const formattedValue =
                      displayMetric === "amounts"
                        ? formatCurrency(Number(value))
                        : `${Number(value).toFixed(1)}%`;

                    return (
                      <div
                        style={{
                          padding: 12,
                          background: isDark ? "#1e293b" : "white",
                          border: `1px solid ${color}`,
                          borderRadius: 8,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        <strong style={{ color }}>{id.toString()}</strong>
                        <div>{formattedValue}</div>
                      </div>
                    );
                  }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 4,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 16,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                            itemTextColor: isDark ? "#ffffff" : "#000000",
                          },
                        },
                      ],
                    },
                  ]}
                  valueFormat={(value) =>
                    displayMetric === "amounts"
                      ? Math.round(Number(value)).toString()
                      : Number(value).toFixed(1)
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
