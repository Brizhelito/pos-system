"use client";

import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px] text-muted-foreground">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, "Ventas"]} />
              <Legend />
              <Bar dataKey="ventas" fill="#8884d8" name="Ventas" />
              <Bar dataKey="ingresos" fill="#82ca9d" name="Ingresos (€)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
