"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketAnalysisData } from "../services/sales/salesService";

interface TicketAnalysisChartProps {
  data: TicketAnalysisData[];
}

export function TicketAnalysisChart({ data }: TicketAnalysisChartProps) {
  // Calcular el promedio general de tickets
  const promedioGeneral =
    data.length > 0
      ? data.reduce((sum, item) => sum + item.promedio, 0) / data.length
      : 0;

  // Ordenar para mostrar los datos más recientes primero en la tabla
  const sortedData = [...data].sort((a, b) => {
    const partsA = a.fecha.split("/").map(Number);
    const partsB = b.fecha.split("/").map(Number);

    // Comparar año, mes y día
    if (partsA[2] !== partsB[2]) return partsB[2] - partsA[2]; // año
    if (partsA[1] !== partsB[1]) return partsB[1] - partsA[1]; // mes
    return partsB[0] - partsA[0]; // día
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Ticket Promedio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(value),
                  "Valor",
                ]}
              />
              <Legend />
              <ReferenceLine
                y={promedioGeneral}
                label="Promedio"
                stroke="#ff7300"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="promedio"
                stroke="#8884d8"
                name="Promedio"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="minimo"
                stroke="#82ca9d"
                name="Mínimo"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="maximo"
                stroke="#ffc658"
                name="Máximo"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Detalles por Fecha</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Promedio</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                  <TableHead className="text-right">Máximo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.slice(0, 7).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      }).format(item.promedio)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      }).format(item.minimo)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      }).format(item.maximo)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm">
              <span className="font-medium">Ticket promedio general:</span>{" "}
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(promedioGeneral)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              El gráfico muestra la evolución del valor de ticket promedio
              diario, junto con los valores mínimos y máximos registrados cada
              día.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
