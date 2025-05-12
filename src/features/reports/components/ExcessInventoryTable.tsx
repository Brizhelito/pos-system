"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ExcessInventoryItem } from "../services/inventory/inventoryService";
import {
  AlertCircle,
  Package,
  ArrowUpDown,
  Info,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReportDataTable } from "./data-table/ReportDataTable";
import { Card, CardContent } from "@/components/ui/card";
import { CURRENCY } from "../config/constants";

interface ExcessInventoryTableProps {
  data: ExcessInventoryItem[];
  totalInventoryCost: number;
}

export function ExcessInventoryTable({
  data,
  totalInventoryCost,
}: ExcessInventoryTableProps) {
  // Formatear fecha
  const formatDateToSpanish = (date: Date | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
  };

  // Calcular costo total del exceso
  const totalExcessCost = data.reduce((sum, item) => sum + item.excessCost, 0);

  // Calcular porcentaje del exceso sobre el valor total del inventario
  const excessPercentage =
    totalInventoryCost > 0 ? (totalExcessCost / totalInventoryCost) * 100 : 0;

  // Determinar color según los días sin venta
  const getInactivityColor = (days: number | null) => {
    if (!days) return "text-gray-500";
    if (days > 90) return "text-red-600";
    if (days > 60) return "text-amber-600";
    if (days > 30) return "text-amber-500";
    return "text-green-600";
  };

  // Obtener color para indicador de nivel de exceso
  const getExcessLevelColor = (excessRatio: number) => {
    if (excessRatio > 1) return "bg-red-600"; // Más del 100% de exceso
    if (excessRatio > 0.5) return "bg-amber-500"; // Más del 50% de exceso
    if (excessRatio > 0.25) return "bg-amber-300"; // Más del 25% de exceso
    return "bg-blue-500"; // Menos de 25% de exceso
  };

  // Renderizar el componente expandible para detalles de producto
  const renderDetailExpansion = (item: ExcessInventoryItem) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-amber-500" />
            Análisis de costos
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Costo unitario:</div>
              <div className="font-medium">
                {new Intl.NumberFormat(
                  CURRENCY.code === "USD" ? "en-US" : "es-ES",
                  {
                    style: "currency",
                    currency: CURRENCY.code,
                  }
                ).format(item.excessCost / item.excessStock)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Valor de exceso:</div>
              <div className="font-medium text-amber-600">
                {new Intl.NumberFormat(
                  CURRENCY.code === "USD" ? "en-US" : "es-ES",
                  {
                    style: "currency",
                    currency: CURRENCY.code,
                  }
                ).format(item.excessCost)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">% del exceso total:</div>
              <div className="font-medium">
                {((item.excessCost / totalExcessCost) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-500" />
            Recomendación de acción
          </h4>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
            {item.daysSinceLastSale && item.daysSinceLastSale > 60 ? (
              <p className="text-destructive">
                Considere descatalogar este producto o aplicar una oferta
                especial, ya que lleva más de {item.daysSinceLastSale} días sin
                ventas.
              </p>
            ) : (
              <p>
                Reduzca el nivel de stock en{" "}
                {Math.max(5, Math.round(item.excessStock * 0.5))} unidades para
                optimizar el inventario.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Definir las columnas para DataTableAdvanced
  const columns = useMemo<ColumnDef<ExcessInventoryItem>[]>(
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
          <div className="font-medium hover:text-blue-600 transition-colors">
            {row.getValue("name")}
          </div>
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
        cell: ({ row }) => (
          <Badge variant="outline" className="font-normal">
            {row.getValue("category")}
          </Badge>
        ),
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
          <div className="text-center font-medium">
            {row.getValue("currentStock")}
          </div>
        ),
      },
      {
        accessorKey: "optimalStock",
        header: ({ column }) => (
          <div className="flex justify-center items-center gap-1">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              Stock óptimo
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">
                    Nivel ideal de inventario basado en el consumo histórico y
                    stock mínimo
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("optimalStock")}</div>
        ),
      },
      {
        accessorKey: "excessStock",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Exceso
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const excessStock = row.getValue("excessStock") as number;
          const optimalStock = row.original.optimalStock;

          // Cálculo del ratio de exceso (qué porcentaje del stock óptimo representa el exceso)
          const excessRatio = optimalStock > 0 ? excessStock / optimalStock : 1;

          return (
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-amber-600">+{excessStock}</span>
              <Progress
                value={Math.min(100, excessRatio * 100)}
                className="h-2 w-16"
                indicatorColor={getExcessLevelColor(excessRatio)}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "excessCost",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-right w-full justify-end"
          >
            Costo de exceso
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = row.getValue("excessCost") as number;
          return (
            <div className="text-right font-medium text-red-500 dark:text-red-400">
              {new Intl.NumberFormat(
                CURRENCY.code === "USD" ? "en-US" : "es-ES",
                {
                  style: "currency",
                  currency: CURRENCY.code,
                }
              ).format(amount)}
            </div>
          );
        },
      },
      {
        accessorKey: "daysSinceLastSale",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Última venta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const item = row.original;
          const days = item.daysSinceLastSale;

          return (
            <div
              className={`text-sm flex items-center gap-1 ${getInactivityColor(
                days
              )}`}
            >
              <span>{formatDateToSpanish(item.lastSaleDate)}</span>
              {days && days > 30 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-sm">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span className="text-xs">{days} días</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Este producto no ha tenido ventas en más de un mes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
      },
      {
        id: "expandable",
        cell: ({ row }) => {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => row.toggleExpanded()}
                  >
                    {row.getIsExpanded() ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Ver más detalles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
    ],
    []
  );

  // Renderizar tarjetas de resumen
  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat(
              CURRENCY.code === "USD" ? "en-US" : "es-ES",
              {
                style: "currency",
                currency: CURRENCY.code,
              }
            ).format(totalExcessCost)}
          </div>
          <p className="text-xs text-muted-foreground">Costo de exceso</p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {excessPercentage.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Del valor total de inventario
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{data.length}</div>
          <p className="text-xs text-muted-foreground">Productos con exceso</p>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar recomendaciones
  const renderRecommendations = () => (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="h-4 w-4 text-blue-600" />
        <p className="font-medium text-blue-700 dark:text-blue-400">
          Recomendaciones de acción
        </p>
      </div>
      <ul className="mt-1 text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
        <li className="hover:text-blue-600 transition-colors">
          Considere promociones o descuentos para productos con exceso de stock.
        </li>
        <li className="hover:text-blue-600 transition-colors">
          Revise los productos sin ventas recientes para posible
          descatalogación.
        </li>
        <li className="hover:text-blue-600 transition-colors">
          Ajuste los niveles óptimos de stock según la demanda actual.
        </li>
        <li className="hover:text-blue-600 transition-colors">
          Negocie con proveedores para reducir cantidades mínimas de pedido.
        </li>
      </ul>
    </div>
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
      title="Exceso de Inventario"
      subtitle="Productos con stock por encima del nivel óptimo que generan costos adicionales"
      icon={<Package className="h-5 w-5 text-blue-500" />}
      exportFilename="exceso-inventario"
      exportOptions={{
        dateFields: ["lastSaleDate"],
        numberFields: [
          "currentStock",
          "optimalStock",
          "excessStock",
          "excessCost",
          "daysSinceLastSale",
        ],
        title: "Reporte de Exceso de Inventario",
      }}
      renderRowSubComponent={renderDetailExpansion}
      summary={renderSummaryCards()}
      emptyStateMessage="No hay productos con exceso de inventario."
    >
      {renderRecommendations()}
    </ReportDataTable>
  );
}
