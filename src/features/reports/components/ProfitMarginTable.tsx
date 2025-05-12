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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProfitMarginData } from "../services/sales/salesService";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { CURRENCY } from "../config/constants";
import { ExportButtons } from "./ExportButtons";

interface ProfitMarginTableProps {
  data: ProfitMarginData[];
}

export function ProfitMarginTable({ data }: ProfitMarginTableProps) {
  // Calcular estadísticas
  const totalIngresos = data.reduce((sum, item) => sum + item.ingresos, 0);
  const totalCostos = data.reduce((sum, item) => sum + item.costos, 0);
  const totalMargen = totalIngresos - totalCostos;
  const porcentajeMargenPromedio =
    totalIngresos > 0 ? (totalMargen / totalIngresos) * 100 : 0;

  // Agrupar por categoría para mostrar resumen
  const categorySummary = data.reduce<
    Record<
      string,
      {
        ingresos: number;
        costos: number;
        margen: number;
        porcentajeMargen: number;
      }
    >
  >((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = {
        ingresos: 0,
        costos: 0,
        margen: 0,
        porcentajeMargen: 0,
      };
    }

    acc[item.categoria].ingresos += item.ingresos;
    acc[item.categoria].costos += item.costos;
    acc[item.categoria].margen += item.margen;

    return acc;
  }, {});

  // Calcular porcentajes para cada categoría
  Object.keys(categorySummary).forEach((categoria) => {
    const { ingresos, margen } = categorySummary[categoria];
    categorySummary[categoria].porcentajeMargen =
      ingresos > 0 ? (margen / ingresos) * 100 : 0;
  });

  // Convertir a array y ordenar por margen
  const categoriesArray = Object.entries(categorySummary)
    .map(([categoria, data]) => ({
      categoria,
      ...data,
    }))
    .sort((a, b) => b.margen - a.margen);

  // Función para determinar el color según el porcentaje de margen
  const getMarginColor = (percentage: number): string => {
    if (percentage >= 40) return "bg-green-600";
    if (percentage >= 30) return "bg-green-500";
    if (percentage >= 20) return "bg-amber-500";
    if (percentage >= 10) return "bg-amber-400";
    return "bg-red-400";
  };

  // Preparar datos para exportación
  const getReportData = () => {
    // Datos de productos para exportar
    const productData = data.map((item) => ({
      Producto: item.nombre,
      Categoría: item.categoria,
      Unidades: item.unidades,
      Ingresos: item.ingresos,
      Costos: item.costos,
      Margen: item.margen,
      PorcentajeMargen: item.porcentajeMargen,
    }));

    // Datos de categorías para exportar
    const categoryData = categoriesArray.map((item) => ({
      Categoría: item.categoria,
      Ingresos: item.ingresos,
      Costos: item.costos,
      Margen: item.margen,
      PorcentajeMargen: item.porcentajeMargen,
    }));

    // Combinar ambos conjuntos
    return { productos: productData, categorias: categoryData };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Análisis de Márgenes de Ganancia</CardTitle>
            </div>
            <ExportButtons
              data={getReportData().productos}
              filename="margenes-ganancia"
              numberFields={[
                "Unidades",
                "Ingresos",
                "Costos",
                "Margen",
                "PorcentajeMargen",
              ]}
              title="Reporte de Márgenes de Ganancia"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Productos y categorías más rentables
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {CURRENCY.formatWithCode(totalIngresos)}
                </div>
                <p className="text-xs text-muted-foreground">Total Ingresos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {CURRENCY.formatWithCode(totalMargen)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Margen de Ganancia
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {porcentajeMargenPromedio.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  % Margen Promedio
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Resumen por Categoría</h3>
                <ExportButtons
                  data={getReportData().categorias}
                  filename="margenes-por-categoria"
                  numberFields={[
                    "Ingresos",
                    "Costos",
                    "Margen",
                    "PorcentajeMargen",
                  ]}
                  title="Resumen de Márgenes por Categoría"
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                      <TableHead className="text-right">Margen</TableHead>
                      <TableHead className="text-right">% Margen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoriesArray.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {category.categoria}
                        </TableCell>
                        <TableCell className="text-right">
                          {CURRENCY.format(category.ingresos)}
                        </TableCell>
                        <TableCell className="text-right">
                          {CURRENCY.format(category.margen)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Progress
                              value={category.porcentajeMargen}
                              className="w-20"
                              indicatorColor={getMarginColor(
                                category.porcentajeMargen
                              )}
                            />
                            <span className="text-sm">
                              {category.porcentajeMargen.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">
                Productos Más Rentables
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Unidades</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                      <TableHead className="text-right">Margen</TableHead>
                      <TableHead className="text-right">% Margen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 10).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.nombre}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.categoria}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.unidades}
                        </TableCell>
                        <TableCell className="text-right">
                          {CURRENCY.format(item.ingresos)}
                        </TableCell>
                        <TableCell className="text-right">
                          {CURRENCY.format(item.margen)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Progress
                              value={item.porcentajeMargen}
                              className="w-20"
                              indicatorColor={getMarginColor(
                                item.porcentajeMargen
                              )}
                            />
                            <span className="text-sm">
                              {item.porcentajeMargen.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
