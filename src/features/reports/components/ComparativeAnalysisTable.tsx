"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparativeAnalysisData } from "../services/sales/salesService";
import { CURRENCY } from "../config/constants";
import { ExportButtons } from "./ExportButtons";

interface ComparativeAnalysisTableProps {
  data: ComparativeAnalysisData[];
}

export function ComparativeAnalysisTable({
  data,
}: ComparativeAnalysisTableProps) {
  // Función para formatear números como moneda cuando es necesario
  const formatValue = (periodo: string, value: number) => {
    // Si el período contiene "Ingresos", formatear como moneda
    if (periodo.includes("Ingresos")) {
      return new Intl.NumberFormat(
        CURRENCY.code === "USD" ? "en-US" : "es-ES",
        {
          style: "currency",
          currency: CURRENCY.code,
        }
      ).format(value);
    }
    // Para otros casos (conteos), mostrar solo el número
    return new Intl.NumberFormat("es-ES").format(value);
  };

  // Función para determinar el color de la tendencia
  const getTrendColor = (porcentaje: number) => {
    if (porcentaje > 0) return "text-green-600";
    if (porcentaje < 0) return "text-red-600";
    return "text-gray-500";
  };

  // Función para renderizar el icono de tendencia
  const renderTrendIcon = (porcentaje: number) => {
    if (porcentaje > 0) return <ArrowUpIcon className="h-4 w-4" />;
    if (porcentaje < 0) return <ArrowDownIcon className="h-4 w-4" />;
    return <MinusIcon className="h-4 w-4" />;
  };

  // Preparar datos para exportación
  const getExportData = () => {
    return data.map((item) => ({
      Periodo: item.periodo,
      Actual: item.actual,
      Anterior: item.anterior,
      Diferencia: item.diferencia,
      PorcentajeVariacion: item.porcentaje,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Análisis Comparativo</CardTitle>
          <ExportButtons
            data={getExportData()}
            filename="analisis-comparativo"
            numberFields={[
              "Actual",
              "Anterior",
              "Diferencia",
              "PorcentajeVariacion",
            ]}
            title="Reporte de Análisis Comparativo"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Actual</TableHead>
              <TableHead className="text-right">Anterior</TableHead>
              <TableHead className="text-right">Diferencia</TableHead>
              <TableHead className="text-right">Variación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.periodo}</TableCell>
                <TableCell className="text-right">
                  {formatValue(item.periodo, item.actual)}
                </TableCell>
                <TableCell className="text-right">
                  {formatValue(item.periodo, item.anterior)}
                </TableCell>
                <TableCell className="text-right">
                  {formatValue(item.periodo, item.diferencia)}
                </TableCell>
                <TableCell
                  className={`text-right flex items-center justify-end gap-1 ${getTrendColor(
                    item.porcentaje
                  )}`}
                >
                  {renderTrendIcon(item.porcentaje)}
                  {Math.abs(item.porcentaje).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
