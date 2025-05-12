"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowUp, ArrowDown, LineChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENCY } from "../config/constants";

export interface LineChartItem {
  fecha: string;
  ventas: number;
}

interface SalesLineChartProps {
  data: LineChartItem[];
  title?: string;
  subtitle?: string;
  showSummary?: boolean;
}

export function SalesLineChart({
  data,
  title,
  subtitle,
  showSummary = true,
}: SalesLineChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Montar la componente para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar el tema basado en resolvedTheme para manejar correctamente "system"
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  // Formatear currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(CURRENCY.code === "USD" ? "en-US" : "es-ES", {
      style: "currency",
      currency: CURRENCY.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  // Transformar datos para Nivo
  const nivoData = useMemo(
    () => [
      {
        id: "Ventas Diarias",
        color: isDark ? "#60a5fa" : "#3b82f6", // azul
        data: data.map((item) => ({
          x: item.fecha,
          y: item.ventas,
        })),
      },
    ],
    [data, isDark]
  );

  // Calcular datos para el resumen
  const summaryData = useMemo(() => {
    if (!data || data.length < 2) return null;

    const total = data.reduce((sum, item) => sum + item.ventas, 0);
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const trend = latest.ventas - previous.ventas;
    const percentChange = (trend / Math.max(1, previous.ventas)) * 100;
    const average = total / data.length;
    const max = Math.max(...data.map((item) => item.ventas));

    return {
      total,
      latest: latest.ventas,
      trend,
      percentChange,
      average,
      max,
    };
  }, [data]);

  // Configuración del tema para el gráfico
  const chartTheme = {
    axis: {
      domain: {
        line: {
          stroke: isDark ? "#475569" : "#cbd5e1",
        },
      },
      legend: {
        text: {
          fill: isDark ? "#e2e8f0" : "#334155",
          fontSize: 12,
          fontWeight: "bold",
        },
      },
      ticks: {
        line: {
          stroke: isDark ? "#475569" : "#cbd5e1",
          strokeWidth: 1,
        },
        text: {
          fill: isDark ? "#94a3b8" : "#64748b",
          fontSize: 11,
        },
      },
    },
    grid: {
      line: {
        stroke: isDark
          ? "rgba(148, 163, 184, 0.15)"
          : "rgba(203, 213, 225, 0.6)",
        strokeWidth: 1,
        strokeDasharray: "4 4",
      },
    },
    crosshair: {
      line: {
        stroke: isDark ? "#94a3b8" : "#64748b",
        strokeWidth: 1,
        strokeOpacity: 0.5,
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
        padding: 12,
      },
    },
  };

  // Determinar si necesitamos rotar las etiquetas basado en el número de períodos
  const shouldRotateLabels = data.length > 6;

  // Si la componente no está montada aún, mostrar un placeholder para evitar hidratación incorrecta
  if (!mounted) {
    return (
      <Card className={cn("relative overflow-hidden")}>
        <CardHeader className="relative z-10">
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        isDark ? "bg-slate-800/70" : "bg-white"
      )}
    >
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

      <CardHeader className="relative z-10">
        {title && <CardTitle className="text-xl">{title}</CardTitle>}
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[500px]">
        {showSummary && summaryData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Ventas Totales
                  </h3>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.total)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Tendencia
                  </h3>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={summaryData.trend >= 0 ? "positive" : "negative"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {summaryData.trend >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">
                    {Math.abs(summaryData.trend)}
                  </span>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      summaryData.trend >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {summaryData.trend >= 0 ? "+" : "-"}
                    {Math.abs(summaryData.percentChange).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Promedio
                  </h3>
                  <LineChart className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryData.average)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Máximo: {formatCurrency(summaryData.max)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No hay datos disponibles
            </div>
          ) : (
            <ResponsiveLine
              data={nivoData}
              margin={{
                top: 50,
                right: 110,
                bottom: shouldRotateLabels ? 70 : 50,
                left: 60,
              }}
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
                legend: "Fecha",
                legendOffset: 36,
                legendPosition: "middle",
                truncateTickAt: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `Ventas (${CURRENCY.symbol})`,
                legendOffset: -50,
                legendPosition: "middle",
                format: (value) =>
                  formatCurrency(Number(value)).replace(CURRENCY.symbol, ""),
                truncateTickAt: 0,
              }}
              colors={({ id }) => {
                // Usar el color definido en el conjunto de datos
                const serieData = nivoData.find((serie) => serie.id === id);
                return serieData?.color || "#3b82f6";
              }}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "seriesColor" }}
              pointLabelYOffset={-12}
              areaOpacity={0.1}
              useMesh={true}
              enableArea={true}
              enableGridX={false}
              theme={chartTheme}
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
              motionConfig="gentle"
              tooltip={({ point }) => {
                return (
                  <div
                    style={{
                      background: isDark ? "#1e293b" : "white",
                      padding: "12px 16px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        color: isDark ? "#e2e8f0" : "#334155",
                        marginBottom: 4,
                      }}
                    >
                      <strong>{point.data.x}</strong>
                    </div>
                    <div style={{ color: point.seriesColor }}>
                      <strong>{formatCurrency(point.data.y as number)}</strong>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
