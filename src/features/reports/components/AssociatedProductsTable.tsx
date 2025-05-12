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
import { AssociatedProductData } from "../services/sales/salesService";
import { Layers } from "lucide-react";
import { ExportButtons } from "./ExportButtons";

interface AssociatedProductsTableProps {
  data: AssociatedProductData[];
}

export function AssociatedProductsTable({
  data,
}: AssociatedProductsTableProps) {
  // Preparar datos para exportación
  const getExportData = () => {
    return data.map((item) => ({
      Producto1: item.producto1,
      Producto2: item.producto2,
      Frecuencia: item.frecuencia,
      Correlacion: item.correlacion,
    }));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Productos que se Venden Juntos</CardTitle>
          </div>
          <ExportButtons
            data={getExportData()}
            filename="productos-asociados"
            numberFields={["Frecuencia", "Correlacion"]}
            title="Productos que se Venden Juntos"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Análisis de productos frecuentemente comprados en la misma transacción
        </p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No hay suficientes datos para identificar productos asociados.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto 1</TableHead>
                <TableHead>Producto 2</TableHead>
                <TableHead className="text-center w-28">Frecuencia</TableHead>
                <TableHead className="text-right w-32">Correlación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.producto1}
                  </TableCell>
                  <TableCell>{item.producto2}</TableCell>
                  <TableCell className="text-center">
                    {item.frecuencia}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Progress
                        value={item.correlacion}
                        className="w-20"
                        indicatorColor={getIndicatorColor(item.correlacion)}
                      />
                      <span className="text-sm">
                        {item.correlacion.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">¿Cómo interpretar estos datos?</p>
          <p className="text-muted-foreground mt-1">
            Los productos con mayor correlación tienden a venderse juntos con
            más frecuencia. Considera ubicarlos cerca o crear ofertas combinadas
            para aumentar las ventas cruzadas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Función para determinar el color del indicador según el valor de correlación
function getIndicatorColor(correlacion: number): string {
  if (correlacion >= 80) return "bg-green-600";
  if (correlacion >= 60) return "bg-green-500";
  if (correlacion >= 40) return "bg-amber-500";
  if (correlacion >= 20) return "bg-amber-400";
  return "bg-gray-400";
}
