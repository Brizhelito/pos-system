"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CURRENCY } from "../config/constants";

export interface BarChartItem {
  name: string;
  ventas: number;
  ingresos: number;
}

interface SalesBarChartProps {
  data: BarChartItem[];
  title?: string;
  subtitle?: string;
}

export function SalesBarChart({ data, title, subtitle }: SalesBarChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Montar componente para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar el tema basado en resolvedTheme para manejar correctamente "system"
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  // Transformar los datos para Nivo
  const nivoData = data.map((item) => ({
    name: item.name,
    ventas: item.ventas,
    ingresos: item.ingresos,
  }));

  // Definir colores para los dos tipos de barras
  const barColors = {
    ventas: isDark ? "#60a5fa" : "#3b82f6", // azul
    ingresos: isDark ? "#4ade80" : "#10b981", // verde
  };

  // Si no hay datos o el componente no está montado, mostrar un estado de carga/placeholder
  if (!mounted || !data || data.length === 0) {
    return (
      <Card className={cn("relative overflow-hidden")}>
        <CardHeader className="relative z-10">
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          {!mounted ? (
            <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          ) : (
            <div className="text-muted-foreground">
              No hay datos disponibles
            </div>
          )}
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

      <CardHeader className="relative z-10">
        {title && <CardTitle className="text-xl">{title}</CardTitle>}
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="h-[300px]">
          <ResponsiveBar
            data={nivoData}
            keys={["ventas", "ingresos"]}
            indexBy="name"
            margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={({ id }) => barColors[id as keyof typeof barColors]}
            borderRadius={4}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Método de Pago",
              legendPosition: "middle",
              legendOffset: 35,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Valor",
              legendPosition: "middle",
              legendOffset: -50,
              truncateTickAt: 0,
              format: (value) => (Number.isInteger(value) ? value : ""),
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", isDark ? 3 : 2]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 16,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
                itemTextColor: isDark ? "#e2e8f0" : "#334155",
              },
            ]}
            role="application"
            ariaLabel="Gráfico de métodos de pago"
            barAriaLabel={(e) =>
              `${e.id}: ${e.formattedValue} en ${e.indexValue}`
            }
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: isDark ? "#94a3b8" : "#64748b",
                    fontSize: 11,
                  },
                },
                legend: {
                  text: {
                    fill: isDark ? "#e2e8f0" : "#334155",
                    fontSize: 12,
                  },
                },
              },
              grid: {
                line: {
                  stroke: isDark
                    ? "rgba(148, 163, 184, 0.2)"
                    : "rgba(203, 213, 225, 0.8)",
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
                  padding: 12,
                },
              },
            }}
            tooltip={({ id, value, color, indexValue }) => (
              <div
                style={{
                  padding: 12,
                  background: isDark ? "#1e293b" : "white",
                  borderRadius: 8,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    color: isDark ? "#e2e8f0" : "#334155",
                    marginBottom: 4,
                  }}
                >
                  <strong>{indexValue}</strong>
                </div>
                <div
                  style={{
                    color,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: color,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  ></div>
                  <span>
                    {id === "ventas"
                      ? `${value} unidades`
                      : `${CURRENCY.symbol}${value.toLocaleString("es-ES")}`}
                  </span>
                </div>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
