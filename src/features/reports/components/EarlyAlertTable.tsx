"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { EarlyAlertItem } from "../services/inventory/inventoryService";
import { Bell, ArrowUpDown, ShoppingCart } from "lucide-react";
import { ReportDataTable } from "./data-table/ReportDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface EarlyAlertTableProps {
  data: EarlyAlertItem[];
}

export function EarlyAlertTable({ data }: EarlyAlertTableProps) {
  // Determinar color para el nivel de alerta
  const getAlertColor = (level: string) => {
    switch (level) {
      case "crítico":
        return "bg-red-500";
      case "bajo":
        return "bg-amber-500";
      default:
        return "bg-green-500";
    }
  };

  // Determinar mensaje para los días restantes
  const getDaysMessage = (days: number | null) => {
    if (days === null) return "Sin consumo reciente";
    if (days <= 0) return "Agotado o en nivel mínimo";
    return `${days} días restantes`;
  };

  // Definición de columnas para la tabla
  const columns = useMemo<ColumnDef<EarlyAlertItem>[]>(
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
            Stock actual
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("currentStock")}</div>
        ),
      },
      {
        accessorKey: "minStock",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Stock mínimo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("minStock")}</div>
        ),
      },
      {
        accessorKey: "alertLevel",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Nivel de alerta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge className={getAlertColor(row.getValue("alertLevel"))}>
              {(row.getValue("alertLevel") as string).toUpperCase()}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "daysLeft",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Tiempo restante
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {getDaysMessage(row.getValue("daysLeft"))}
          </div>
        ),
      },
      {
        accessorKey: "reorderQuantity",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-right w-full justify-end"
          >
            Cantidad a pedir
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-right font-bold">
            {row.getValue("reorderQuantity")}
          </div>
        ),
      },
    ],
    []
  );

  // Renderizar información detallada de alertas
  const renderAlertInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
        <h4 className="text-sm font-medium text-red-700 dark:text-red-400">
          Nivel crítico
        </h4>
        <p className="text-xs text-red-600 dark:text-red-300 mt-1">
          Productos bajo el nivel mínimo que requieren pedido inmediato.
        </p>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400">
          Nivel bajo
        </h4>
        <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
          Productos que llegarán al nivel mínimo en los próximos 7 días.
        </p>
      </div>
    </div>
  );

  // Renderizar detalles expandibles de un producto
  const renderProductDetail = (item: EarlyAlertItem) => {
    const stockDifference = item.currentStock - item.minStock;

    return (
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-red-500" />
              Recomendación de pedido
            </h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Cantidad a pedir:</span>
                <span className="font-medium">
                  {item.reorderQuantity} unidades
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">
                  Diferencia con mínimo:
                </span>
                <span
                  className={`font-medium ${
                    stockDifference < 0 ? "text-red-500" : "text-amber-500"
                  }`}
                >
                  {stockDifference} unidades
                </span>
              </div>
              {item.alertLevel === "crítico" && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                  ¡Atención! Este producto está por debajo del nivel mínimo y
                  requiere reabastecimiento inmediato para evitar pérdidas de
                  ventas.
                </div>
              )}
            </div>
          </div>
          <div>
            {item.daysLeft !== null ? (
              <div>
                <h4 className="text-sm font-semibold mb-2">
                  Análisis de tiempo
                </h4>
                <p className="text-xs text-muted-foreground">
                  {item.daysLeft <= 0
                    ? "El producto ya se encuentra en nivel crítico y debe ser reabastecido inmediatamente."
                    : `Basado en el consumo histórico, este producto alcanzará su nivel mínimo en ${item.daysLeft} días. Se recomienda hacer el pedido con anticipación considerando el tiempo de entrega del proveedor.`}
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-semibold mb-2">
                  Sin datos de consumo
                </h4>
                <p className="text-xs text-muted-foreground">
                  No hay datos suficientes de consumo reciente para este
                  producto. Se recomienda revisar su relevancia en el
                  inventario.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ReportDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Buscar producto..."
      filterColumn="alertLevel"
      filterOptions={[
        { label: "Todos", value: "todos" },
        { label: "Crítico", value: "crítico" },
        { label: "Bajo", value: "bajo" },
      ]}
      title="Alertas de Inventario"
      subtitle="Productos que necesitan atención inmediata para reabastecimiento"
      icon={<Bell className="h-5 w-5 text-red-500" />}
      exportFilename="alertas-inventario"
      exportOptions={{
        numberFields: [
          "currentStock",
          "minStock",
          "daysLeft",
          "reorderQuantity",
        ],
        title: "Reporte de Alertas de Inventario",
      }}
      renderRowSubComponent={renderProductDetail}
      summary={renderAlertInfo()}
      emptyStateMessage="No hay productos que requieran atención inmediata."
    />
  );
}
