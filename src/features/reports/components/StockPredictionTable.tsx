"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StockPredictionItem } from "../services/inventory/inventoryService";
import { AlertTriangle, Calendar, ArrowUpDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ReportDataTable } from "./data-table/ReportDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface StockPredictionTableProps {
  data: StockPredictionItem[];
}

export function StockPredictionTable({ data }: StockPredictionTableProps) {
  // Formatear fecha
  const formatDateToSpanish = (date: Date) => {
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
  };

  // Determina el color del indicador según los días restantes
  const getUrgencyColor = (days: number) => {
    if (days <= 7) return "bg-red-600";
    if (days <= 15) return "bg-amber-500";
    if (days <= 30) return "bg-amber-300";
    return "bg-green-500";
  };

  // Determina el color del texto según los días restantes
  const getTextColor = (days: number) => {
    if (days <= 7) return "text-red-600";
    if (days <= 15) return "text-amber-600";
    return "text-green-600";
  };

  // Determina el texto de urgencia
  const getUrgencyText = (days: number) => {
    if (days <= 7) return "Crítico";
    if (days <= 15) return "Urgente";
    if (days <= 30) return "Próximamente";
    return "Normal";
  };

  // Definir las columnas para la tabla
  const columns = useMemo<ColumnDef<StockPredictionItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Producto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categoría
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("category")}</div>,
      },
      {
        accessorKey: "currentStock",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              {item.currentStock}
              {item.currentStock <= item.minStock && (
                <Badge variant="destructive" className="ml-2 text-[10px] py-0">
                  Bajo mínimo
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "dailyConsumption",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Consumo diario
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {(row.getValue("dailyConsumption") as number).toFixed(2)} uds.
          </div>
        ),
      },
      {
        accessorKey: "daysUntilEmpty",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Días restantes
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const days = row.getValue("daysUntilEmpty") as number;
          return (
            <div className={`text-center font-bold ${getTextColor(days)}`}>
              {days} días
            </div>
          );
        },
      },
      {
        accessorKey: "estimatedEmptyDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Fecha agotamiento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue("estimatedEmptyDate") as Date;
          return (
            <div className="text-center flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDateToSpanish(date)}
            </div>
          );
        },
      },
      {
        id: "urgency",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Urgencia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const days = row.original.daysUntilEmpty;
          return (
            <div className="flex flex-col items-center gap-1">
              <Progress
                value={Math.min(100, ((30 - Math.min(30, days)) / 30) * 100)}
                className="w-20 h-2"
                indicatorColor={getUrgencyColor(days)}
              />
              <span className="text-xs">{getUrgencyText(days)}</span>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <ReportDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Buscar producto..."
      filterColumn="category"
      filterOptions={Array.from(new Set(data.map((item) => item.category))).map(
        (category) => ({
          label: category,
          value: category,
        })
      )}
      title="Predicción de Agotamiento de Stock"
      subtitle="Productos que se quedarán sin stock basado en el consumo histórico"
      icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
      exportFilename="prediccion-agotamiento"
      exportOptions={{
        dateFields: ["estimatedEmptyDate"],
        numberFields: [
          "currentStock",
          "minStock",
          "dailyConsumption",
          "daysUntilEmpty",
        ],
        title: "Predicción de Agotamiento de Stock",
      }}
      emptyStateMessage="No hay productos con riesgo de agotamiento basado en el historial de ventas."
      summary={
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">Información</p>
          <p className="text-muted-foreground mt-1">
            Este análisis está basado en el consumo histórico del período
            seleccionado. Se recomienda realizar pedidos con anticipación para
            los productos marcados como &quot;Crítico&quot; o
            &quot;Urgente&quot;.
          </p>
        </div>
      }
    />
  );
}
