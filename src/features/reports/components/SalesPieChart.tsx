"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { PieChart as PieChartIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface PieChartItem {
  name: string;
  value: number;
}

interface SalesPieChartProps {
  data: PieChartItem[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showPercentage?: boolean;
}

// Colores para las secciones del gráfico - Paleta más moderna
const LIGHT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
];

const DARK_COLORS = [
  "#60a5fa", // blue
  "#34d399", // emerald
  "#fbbf24", // amber
  "#f87171", // red
  "#a78bfa", // violet
  "#f472b6", // pink
  "#22d3ee", // cyan
];

export function SalesPieChart({
  data,
  title,
  subtitle,
  showLegend = true,
  showPercentage = true,
}: SalesPieChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

  // Efecto para manejar el montaje y evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cálculo del total y valores derivados
  const totalValue = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Formatear valor porcentual
  const formatPercentage = useCallback(
    (value: number) => {
      return `${((value / totalValue) * 100).toFixed(1)}%`;
    },
    [totalValue]
  );

  // Calcular la distribución para determinar cuál es la mayor categoría
  const distribution = useMemo(() => {
    return data
      .map((item) => ({
        name: item.name,
        value: item.value,
        percentage: (item.value / totalValue) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [data, totalValue]);

  // Transformar los datos al formato que espera Nivo
  const pieData = useMemo(
    () =>
      data.map((item) => ({
        id: item.name,
        label: item.name,
        value: item.value,
        formattedValue: showPercentage
          ? formatPercentage(item.value)
          : `${item.value} ${item.value === 1 ? "venta" : "ventas"}`,
      })),
    [data, showPercentage, formatPercentage]
  );

  // Subtítulo automático con el total
  const autoSubtitle = `Total: ${totalValue} ${
    totalValue === 1 ? "venta" : "ventas"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {distribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={cn(
            "rounded-lg p-3 flex items-center justify-between",
            isDark ? "bg-slate-800/60" : "bg-primary-50/60"
          )}
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Categoría Principal
            </p>
            <p className="text-lg font-bold">{distribution[0].name}</p>
            <div className="flex items-center text-xs mt-1">
              <span className="text-primary">
                {formatPercentage(distribution[0].value)}
              </span>
              <span className="text-muted-foreground ml-1">del total</span>
            </div>
          </div>
          <PieChartIcon className="h-8 w-8 text-primary opacity-80" />
        </motion.div>
      )}

      <Card
        className={cn(
          "relative overflow-hidden border-0 shadow-md",
          isDark ? "bg-slate-800/70" : "bg-white"
        )}
      >
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

        <CardHeader className="relative z-10">
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          <CardDescription>{subtitle || autoSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[350px]"
            >
              {data.length === 0 ? (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  No hay datos disponibles
                </div>
              ) : (
                <ResponsivePie
                  data={pieData}
                  margin={{
                    top: 40,
                    right: 80,
                    bottom: showLegend ? 80 : 40,
                    left: 80,
                  }}
                  innerRadius={0.6}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={COLORS}
                  borderWidth={1}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={isDark ? "#e2e8f0" : "#334155"}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                  defs={[
                    {
                      id: "dots",
                      type: "patternDots",
                      background: "inherit",
                      color: isDark
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.1)",
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: "lines",
                      type: "patternLines",
                      background: "inherit",
                      color: isDark
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.1)",
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10,
                    },
                  ]}
                  legends={
                    showLegend
                      ? [
                          {
                            anchor: "bottom",
                            direction: "row",
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: isDark ? "#e2e8f0" : "#334155",
                            itemDirection: "left-to-right",
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: "circle",
                            effects: [
                              {
                                on: "hover",
                                style: {
                                  itemTextColor: isDark ? "#ffffff" : "#000000",
                                },
                              },
                            ],
                          },
                        ]
                      : []
                  }
                  animate={true}
                  motionConfig="gentle"
                  theme={{
                    tooltip: {
                      container: {
                        background: isDark ? "#1e293b" : "#ffffff",
                        color: isDark ? "#e2e8f0" : "#334155",
                        fontSize: 12,
                        borderRadius: 8,
                        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                        padding: 12,
                      },
                    },
                    labels: {
                      text: {
                        fontSize: 14,
                        fontWeight: 600,
                      },
                    },
                  }}
                  tooltip={({ datum }) => (
                    <div
                      style={{
                        padding: 12,
                        background: isDark ? "#1e293b" : "white",
                        border: `1px solid ${datum.color}`,
                        borderRadius: 8,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div style={{ marginBottom: 4 }}>
                        <strong>{datum.label}</strong>
                      </div>
                      <div
                        style={{
                          color: datum.color,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: datum.color,
                            borderRadius: "50%",
                            marginRight: 8,
                          }}
                        ></div>
                        <span>
                          {datum.value} {datum.value === 1 ? "venta" : "ventas"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, marginTop: 5, opacity: 0.8 }}>
                        {((datum.value / totalValue) * 100).toFixed(1)}% del
                        total
                      </div>
                    </div>
                  )}
                  valueFormat={(value) =>
                    showPercentage
                      ? `${((value / totalValue) * 100).toFixed(1)}%`
                      : `${value} ${value === 1 ? "venta" : "ventas"}`
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
