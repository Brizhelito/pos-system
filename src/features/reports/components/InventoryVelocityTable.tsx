"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { InventoryVelocityItem } from "../services/inventory/inventoryService";
import {
  Gauge,
  ArrowUpDown,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ReportDataTable } from "./data-table/ReportDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryVelocityTableProps {
  data: InventoryVelocityItem[];
}

export function InventoryVelocityTable({ data }: InventoryVelocityTableProps) {
  // Determinar color para la velocidad de rotación
  const getVelocityColor = (category: string) => {
    switch (category) {
      case "muy rápida":
        return "bg-green-600";
      case "rápida":
        return "bg-green-500";
      case "media":
        return "bg-blue-500";
      case "lenta":
        return "bg-amber-500";
      case "muy lenta":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calcular estadísticas de velocidad
  const velocityStats = data.reduce(
    (acc, item) => {
      switch (item.velocityCategory) {
        case "muy rápida":
        case "rápida":
          acc.fast += 1;
          break;
        case "media":
          acc.medium += 1;
          break;
        case "lenta":
        case "muy lenta":
          acc.slow += 1;
          break;
      }
      return acc;
    },
    { fast: 0, medium: 0, slow: 0 }
  );

  const totalItems = data.length;

  // Formatear mensaje de tiempo para vender stock
  const getTimeToSellMessage = (days: number | null) => {
    if (days === null) return "No hay ventas suficientes";
    if (days > 365) return "Más de 1 año";
    if (days > 180) return "Más de 6 meses";
    if (days > 90) return "Más de 3 meses";
    if (days > 60) return "2-3 meses";
    if (days > 30) return "1-2 meses";
    if (days > 14) return "2-4 semanas";
    if (days > 7) return "1-2 semanas";
    return `${days} días`;
  };

  // Definir columnas para la tabla
  const columns = useMemo<ColumnDef<InventoryVelocityItem>[]>(
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
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("currentStock")}</div>
        ),
      },
      {
        accessorKey: "soldQuantity",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Vendido
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("soldQuantity")}</div>
        ),
      },
      {
        accessorKey: "turnoverRate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Índice rotación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {(row.getValue("turnoverRate") as number).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "daysToSellStock",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Tiempo para agotar
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {getTimeToSellMessage(row.getValue("daysToSellStock"))}
          </div>
        ),
      },
      {
        accessorKey: "velocityCategory",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Velocidad
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              className={getVelocityColor(row.getValue("velocityCategory"))}
            >
              {(row.getValue("velocityCategory") as string).toUpperCase()}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  // Renderizar resumen de estadísticas
  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-1">
            <div className="text-2xl font-bold">
              {totalItems > 0
                ? ((velocityStats.fast / totalItems) * 100).toFixed(1)
                : "0"}
              %
            </div>
            <span className="text-xs text-green-600 mb-1">Alta rotación</span>
          </div>
          <Progress
            value={totalItems > 0 ? (velocityStats.fast / totalItems) * 100 : 0}
            className="h-2 mt-2"
            indicatorColor="bg-green-500"
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-1">
            <div className="text-2xl font-bold">
              {totalItems > 0
                ? ((velocityStats.medium / totalItems) * 100).toFixed(1)
                : "0"}
              %
            </div>
            <span className="text-xs text-blue-600 mb-1">Rotación media</span>
          </div>
          <Progress
            value={
              totalItems > 0 ? (velocityStats.medium / totalItems) * 100 : 0
            }
            className="h-2 mt-2"
            indicatorColor="bg-blue-500"
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-1">
            <div className="text-2xl font-bold">
              {totalItems > 0
                ? ((velocityStats.slow / totalItems) * 100).toFixed(1)
                : "0"}
              %
            </div>
            <span className="text-xs text-amber-600 mb-1">Baja rotación</span>
          </div>
          <Progress
            value={totalItems > 0 ? (velocityStats.slow / totalItems) * 100 : 0}
            className="h-2 mt-2"
            indicatorColor="bg-amber-500"
          />
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar información del producto expandido
  const renderProductDetail = (item: InventoryVelocityItem) => {
    const isHighTurnover = item.turnoverRate > 1.5;
    const icon = isHighTurnover ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-amber-500" />
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            {icon}
            Análisis de rotación
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Índice de rotación:</div>
              <div className="font-medium">{item.turnoverRate.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Velocidad:</div>
              <div>
                <Badge className={getVelocityColor(item.velocityCategory)}>
                  {item.velocityCategory.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">
                Consumo mensual estimado:
              </div>
              <div className="font-medium">
                {Math.round((item.soldQuantity / 30) * 30)} unidades
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-500" />
            Recomendación
          </h4>
          <div className="p-3 bg-muted rounded-md text-sm">
            {item.velocityCategory === "muy rápida" ||
            item.velocityCategory === "rápida" ? (
              <p className="text-green-700 dark:text-green-400">
                Producto de alta rotación. Asegúrese de mantener un nivel de
                stock adecuado para evitar agotamientos. Considere aumentar el
                stock mínimo.
              </p>
            ) : item.velocityCategory === "media" ? (
              <p className="text-blue-700 dark:text-blue-400">
                Producto con rotación media. Mantener los niveles de stock
                actuales y revisar periódicamente.
              </p>
            ) : (
              <p className="text-amber-700 dark:text-amber-400">
                Producto de baja rotación. Considere reducir el stock y aplicar
                ofertas para mejorar su rotación.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar información adicional
  const renderInfo = () => (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
        <h4 className="text-sm font-medium text-green-700 dark:text-green-400">
          Alta rotación
        </h4>
        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
          Productos que se venden rápidamente y requieren reposición frecuente.
          Asegúrese de tener suficiente stock para evitar quiebres.
        </p>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400">
          Baja rotación
        </h4>
        <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
          Productos que se mueven lentamente. Considere promociones, reubicación
          o reducción de niveles de inventario.
        </p>
      </div>
    </div>
  );

  return (
    <ReportDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Buscar producto..."
      filterColumn="velocityCategory"
      filterOptions={[
        { label: "Todos", value: "todos" },
        { label: "Muy rápida", value: "muy rápida" },
        { label: "Rápida", value: "rápida" },
        { label: "Media", value: "media" },
        { label: "Lenta", value: "lenta" },
        { label: "Muy lenta", value: "muy lenta" },
      ]}
      title="Velocidad de Rotación de Inventario"
      subtitle="Análisis de qué tan rápido se venden los productos en inventario"
      icon={<Gauge className="h-5 w-5 text-green-500" />}
      exportFilename="velocidad-inventario"
      exportOptions={{
        numberFields: [
          "currentStock",
          "soldQuantity",
          "turnoverRate",
          "daysToSellStock",
        ],
        title: "Reporte de Velocidad de Rotación de Inventario",
      }}
      summary={renderSummary()}
      renderRowSubComponent={renderProductDetail}
      emptyStateMessage="No hay datos suficientes para analizar la velocidad de rotación."
    >
      {renderInfo()}
    </ReportDataTable>
  );
}
