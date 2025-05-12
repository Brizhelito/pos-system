"use client";

import React, { useState, useEffect } from "react";
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
import { CURRENCY } from "../config/constants";

export interface PaymentMethodItem {
  name: string;
  ventas: number;
  ingresos: number;
}

interface PaymentMethodsPieChartProps {
  data: PaymentMethodItem[];
  title?: string;
  subtitle?: string;
  valueType?: "ventas" | "ingresos";
}

export function PaymentMethodsPieChart({
  data,
  title = "Métodos de Pago",
  subtitle = "",
  valueType: initialValueType = "ingresos",
}: PaymentMethodsPieChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [valueType, setValueType] = useState<"ventas" | "ingresos">(
    initialValueType
  );

  // Efecto para manejar el montaje y evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar el tema basado en resolvedTheme para manejar correctamente "system"
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  // Transformar los datos para Nivo Pie
  const pieData = data.map((item) => ({
    id: item.name,
    label: item.name,
    value: valueType === "ingresos" ? item.ingresos : item.ventas,
    color: getColorByMethod(item.name, isDark),
    formattedValue:
      valueType === "ingresos"
        ? formatCurrency(item.ingresos)
        : `${item.ventas} ${item.ventas === 1 ? "venta" : "ventas"}`,
  }));

  // Definir colores para los métodos de pago
  function getColorByMethod(method: string, isDark: boolean) {
    const colors = {
      EFECTIVO: isDark ? "#4ade80" : "#22c55e", // verde
      PAGO_MOVIL: isDark ? "#60a5fa" : "#3b82f6", // azul
      TRANSFERENCIA: isDark ? "#a78bfa" : "#8b5cf6", // violeta
      PUNTO_DE_VENTA: isDark ? "#f97316" : "#ea580c", // naranja
      // Valores por defecto para otros métodos
      default: isDark ? "#94a3b8" : "#64748b", // gris
    };

    // Normalizar el nombre del método para la comparación
    const normalizedMethod = method.toUpperCase().replace(/ /g, "_");
    return colors[normalizedMethod as keyof typeof colors] || colors.default;
  }

  // Formatear moneda
  function formatCurrency(value: number) {
    return new Intl.NumberFormat(CURRENCY.code === "USD" ? "en-US" : "es-ES", {
      style: "currency",
      currency: CURRENCY.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }

  // Calcular totales para el subtítulo
  const totalValue = data.reduce(
    (sum, item) =>
      sum + (valueType === "ingresos" ? item.ingresos : item.ventas),
    0
  );

  const formattedTotal =
    valueType === "ingresos"
      ? formatCurrency(totalValue)
      : `${totalValue} ${totalValue === 1 ? "venta" : "ventas"}`;

  // Subtítulo automático con el total
  const autoSubtitle = `Total: ${formattedTotal}`;

  // Si la componente no está montada aún, mostrar un placeholder para evitar hidratación incorrecta
  if (!mounted) {
    return (
      <Card className={cn("relative overflow-hidden")}>
        <CardHeader className="relative z-10">
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {subtitle && (
            <CardDescription>{subtitle || autoSubtitle}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px] text-muted-foreground">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-md",
        isDark ? "bg-slate-800/70" : "bg-white"
      )}
    >
      {/* Gradiente decorativo con pointer-events-none */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none z-0" />

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-center mb-2 relative z-10">
          <CardTitle className="text-xl">{title}</CardTitle>

          {/* Selector simplificado con z-index mejorado */}
          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg relative z-20">
            <div className="flex space-x-1">
              <button
                type="button"
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative z-20",
                  valueType === "ingresos"
                    ? "bg-white dark:bg-slate-600 text-primary shadow"
                    : "text-slate-600 dark:text-slate-300"
                )}
                onClick={() => setValueType("ingresos")}
              >
                Ingresos
              </button>
              <button
                type="button"
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative z-20",
                  valueType === "ventas"
                    ? "bg-white dark:bg-slate-600 text-primary shadow"
                    : "text-slate-600 dark:text-slate-300"
                )}
                onClick={() => setValueType("ventas")}
              >
                Ventas
              </button>
            </div>
          </div>
        </div>
        <CardDescription>{subtitle || autoSubtitle}</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Contenido del gráfico sin animaciones complejas */}
        <div className="h-[350px]">
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
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
            colors={{ datum: "data.color" }}
            animate={true}
            motionConfig="gentle"
            theme={{
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
              labels: {
                text: {
                  fontSize: 12,
                  fill: isDark ? "#e2e8f0" : "#334155",
                  fontWeight: "bold",
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
                  <span>{datum.data.formattedValue}</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 5, opacity: 0.8 }}>
                  {Math.round((datum.arc.angle / (2 * Math.PI)) * 100 * 10) /
                    10}
                  % del total
                </div>
              </div>
            )}
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
            legends={[
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
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
