"use client";

import React, { useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
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
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, TrendingUp, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCY } from "../../config/constants";

interface ProfitMarginAreaChartProps {
  data: ProfitAnalysisData[];
  title?: string;
  subtitle?: string;
}

interface LineDataItem {
  id: string;
  color: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

export const ProfitMarginAreaChart = ({
  data,
  title = "Análisis de Rentabilidad",
  subtitle = "",
}: ProfitMarginAreaChartProps) => {
  // Usar 'amounts' como valor inicial siempre para consistencia
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

  // Transformar datos según la métrica seleccionada (gráfico de área)
  const chartData = useMemo(() => {
    console.log("Recalculando chartData con displayMetric:", displayMetric);

    // Crear los datos según la métrica seleccionada
    let result;
    if (displayMetric === "amounts") {
      // Para montos, mostramos ingresos, costos y ganancias
      result = [
        {
          id: "Ingresos",
          color: isDark ? "#60a5fa" : "#3b82f6", // azul
          data: data.map((item) => ({
            x: formatPeriod(item.periodo),
            y: Math.round(item.ingresos),
          })),
        },
        {
          id: "Costos",
          color: isDark ? "#f87171" : "#ef4444", // rojo
          data: data.map((item) => ({
            x: formatPeriod(item.periodo),
            y: Math.round(item.costos),
          })),
        },
        {
          id: "Ganancia Neta",
          color: isDark ? "#4ade80" : "#22c55e", // verde
          data: data.map((item) => ({
            x: formatPeriod(item.periodo),
            y: Math.round(item.gananciaNeta),
          })),
        },
      ] as LineDataItem[];
    } else {
      // Para márgenes, mostramos margen bruto y neto
      result = [
        {
          id: "Margen Bruto",
          color: isDark ? "#4ade80" : "#22c55e", // verde
          data: data.map((item) => ({
            x: formatPeriod(item.periodo),
            y: Math.round(item.margenBruto * 10) / 10,
          })),
        },
        {
          id: "Margen Neto",
          color: isDark ? "#60a5fa" : "#3b82f6", // azul
          data: data.map((item) => ({
            x: formatPeriod(item.periodo),
            y: Math.round(item.margenNeto * 10) / 10,
          })),
        },
      ] as LineDataItem[];
    }

    console.log("Datos generados:", result);
    return result;
  }, [data, displayMetric, isDark]);

  // Determinar si necesitamos rotar las etiquetas basado en el número de períodos
  const shouldRotateLabels = data.length > 6;

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

  // Configuración del tema para el gráfico de líneas
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: isDark ? "#94a3b8" : "#64748b",
          fontSize: 10,
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
    crosshair: {
      line: {
        stroke: isDark ? "#94a3b8" : "#64748b",
        strokeWidth: 1,
        strokeOpacity: 0.5,
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
          {/* Gradiente decorativo modificado para no interferir con clics */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-br-full pointer-events-none z-0" />
          <div className="flex justify-between items-center relative z-10">
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

            {/* Selector simplificado con z-index mejorado */}
            <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg relative z-20">
              <div className="flex space-x-1">
                <button
                  type="button"
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative z-20",
                    displayMetric === "amounts"
                      ? "bg-white dark:bg-slate-600 text-primary shadow"
                      : "text-slate-600 dark:text-slate-300"
                  )}
                  onClick={() => {
                    console.log("Click en botón Montos");
                    setDisplayMetric("amounts");
                  }}
                >
                  Montos
                </button>
                <button
                  type="button"
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative z-20",
                    displayMetric === "margins"
                      ? "bg-white dark:bg-slate-600 text-primary shadow"
                      : "text-slate-600 dark:text-slate-300"
                  )}
                  onClick={() => {
                    console.log("Click en botón Márgenes");
                    setDisplayMetric("margins");
                  }}
                >
                  Márgenes (%)
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {/* Contenido del gráfico sin animaciones complejas */}
          <div className="h-[400px] pt-3">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No hay datos disponibles para el período seleccionado
              </div>
            ) : (
              <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: shouldRotateLabels ? -45 : 0,
                  legend: "Período",
                  legendOffset: 36,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend:
                    displayMetric === "amounts"
                      ? `Monto (${CURRENCY.symbol})`
                      : "Porcentaje (%)",
                  legendOffset: -50,
                  legendPosition: "middle",
                  format: (value) => {
                    // Imprimir para debug
                    console.log(
                      "Formateando valor del eje:",
                      value,
                      "con métrica:",
                      displayMetric
                    );
                    if (displayMetric === "amounts") {
                      return formatCurrency(Number(value)).replace(
                        CURRENCY.symbol,
                        ""
                      );
                    } else {
                      return `${Math.round(Number(value))}%`;
                    }
                  },
                  truncateTickAt: 0,
                }}
                enableGridX={false}
                enableGridY={true}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "seriesColor" }}
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
                theme={chartTheme}
                colors={chartData.map((item) => item.color)}
                tooltip={({ point }) => (
                  <div
                    style={{
                      padding: 12,
                      background: isDark ? "#1e293b" : "white",
                      border: `1px solid ${point.seriesColor}`,
                      borderRadius: 8,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div style={{ marginBottom: 4 }}>
                      <strong>{point.data.x}</strong>
                    </div>
                    <div
                      style={{
                        color: point.seriesColor,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <span>{point.seriesId}: </span>
                      <span style={{ marginLeft: 5 }}>
                        {displayMetric === "amounts"
                          ? formatCurrency(point.data.y as number)
                          : `${(point.data.y as number).toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
