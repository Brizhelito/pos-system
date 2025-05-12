"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HourlyAnalysisData,
  WeekdayAnalysisData,
} from "../services/sales/salesService";
import { ExportButtons } from "./ExportButtons";

interface TimeAnalysisChartsProps {
  hourlyData: HourlyAnalysisData[];
  weekdayData: WeekdayAnalysisData[];
}

export function TimeAnalysisCharts({
  hourlyData,
  weekdayData,
}: TimeAnalysisChartsProps) {
  // Colores para los gráficos
  const colors = {
    primary: "#2563eb",
    secondary: "#8b5cf6",
    accent: "#ec4899",
    light: "#dbeafe",
    dark: "#1e40af",
  };

  // Función para determinar color basado en el valor
  const getBarColor = (value: number) => {
    if (value > 15) return colors.dark;
    if (value > 10) return colors.primary;
    if (value > 5) return colors.secondary;
    return colors.accent;
  };

  // Preparar datos horarios para exportación
  const getHourlyExportData = () => {
    return hourlyData.map((item) => ({
      Hora: item.hora,
      Ventas: item.ventas,
      Porcentaje: item.porcentaje,
    }));
  };

  // Preparar datos por día para exportación
  const getWeekdayExportData = () => {
    return weekdayData.map((item) => ({
      Dia: item.dia,
      Ventas: item.ventas,
      Porcentaje: item.porcentaje,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gráfico de ventas por hora */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Ventas por Hora del Día</CardTitle>
              <p className="text-sm text-muted-foreground">
                Distribución horaria de las ventas
              </p>
            </div>
            <ExportButtons
              data={getHourlyExportData()}
              filename="ventas-por-hora"
              numberFields={["Ventas", "Porcentaje"]}
              title="Ventas por Hora del Día"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} ventas`, "Cantidad"]}
                  labelFormatter={(label) => `Hora: ${label}`}
                />
                <Legend />
                <Bar dataKey="ventas" name="Ventas">
                  {hourlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.porcentaje)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-sm">Horas pico:</h4>
            <div className="text-sm text-muted-foreground">
              {hourlyData
                .sort((a, b) => b.ventas - a.ventas)
                .slice(0, 3)
                .map((item, i) => (
                  <span key={i} className="mr-2">
                    {item.hora} ({item.ventas} ventas,{" "}
                    {item.porcentaje.toFixed(1)}%)
                  </span>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de ventas por día de la semana */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">
                Ventas por Día de la Semana
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Distribución semanal de las ventas
              </p>
            </div>
            <ExportButtons
              data={getWeekdayExportData()}
              filename="ventas-por-dia"
              numberFields={["Ventas", "Porcentaje"]}
              title="Ventas por Día de la Semana"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekdayData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} ventas`, "Cantidad"]}
                  labelFormatter={(label) => `Día: ${label}`}
                />
                <Legend />
                <Bar dataKey="ventas" fill={colors.secondary} name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-sm">Días más activos:</h4>
            <div className="text-sm text-muted-foreground">
              {weekdayData
                .sort((a, b) => b.ventas - a.ventas)
                .slice(0, 3)
                .map((item, i) => (
                  <span key={i} className="mr-2">
                    {item.dia} ({item.ventas} ventas,{" "}
                    {item.porcentaje.toFixed(1)}%)
                  </span>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
