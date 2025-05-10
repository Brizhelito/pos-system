import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerLifecycle } from "../services/customers/rfmService";
import {
  Users,
  ArrowUpDown,
  Calendar,
  CalendarDays,
  History,
} from "lucide-react";
import { ReportDataTable } from "./data-table/ReportDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerLifecycleTableProps {
  data: CustomerLifecycle[];
}

export const CustomerLifecycleTable = ({
  data,
}: CustomerLifecycleTableProps) => {
  // Formatear fecha
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Función para obtener color según estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-500";
      case "En Riesgo":
        return "bg-amber-500";
      case "Perdido":
        return "bg-red-500";
      case "Inactivo":
        return "bg-gray-500";
      case "Sin Compras":
        return "bg-red-900";
      default:
        return "bg-gray-500";
    }
  };

  // Estadísticas de ciclo de vida
  const lifecycleStats = useMemo(() => {
    const stats = {
      activos: data.filter((c) => c.estado === "Activo").length,
      enRiesgo: data.filter((c) => c.estado === "En Riesgo").length,
      perdidos: data.filter((c) => c.estado === "Perdido").length,
      inactivos: data.filter((c) => c.estado === "Inactivo").length,
      sinCompras: data.filter((c) => c.estado === "Sin Compras").length,
    };

    const total = data.length || 1;

    return {
      stats,
      porcentajeActivos: (stats.activos / total) * 100,
      porcentajeRiesgo: (stats.enRiesgo / total) * 100,
      porcentajePerdidos: (stats.perdidos / total) * 100,
    };
  }, [data]);

  // Definir columnas para la tabla
  const columns = useMemo<ColumnDef<CustomerLifecycle>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("nombre")}</div>
        ),
      },
      {
        accessorKey: "primerCompra",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-start w-full"
          >
            Primera compra
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>{formatDate(row.getValue("primerCompra"))}</div>
        ),
      },
      {
        accessorKey: "ultimaCompra",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-start w-full"
          >
            Última compra
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>{formatDate(row.getValue("ultimaCompra"))}</div>
        ),
      },
      {
        accessorKey: "comprasPorMes",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Compras/mes
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {(row.getValue("comprasPorMes") as number).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "valorTotal",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Valor total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            ${(row.getValue("valorTotal") as number).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "estado",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-right w-full justify-end"
          >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <Badge
              className={`${getStatusColor(row.getValue("estado"))} text-white`}
            >
              {row.getValue("estado") as string}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  // Renderizar resumen de estadísticas
  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <Users className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold">
            {lifecycleStats.stats.activos}
          </div>
          <div className="text-sm text-muted-foreground">
            Clientes activos ({lifecycleStats.porcentajeActivos.toFixed(1)}%)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <History className="h-8 w-8 text-amber-500 mb-2" />
          <div className="text-2xl font-bold">
            {lifecycleStats.stats.enRiesgo}
          </div>
          <div className="text-sm text-muted-foreground">
            Clientes en riesgo ({lifecycleStats.porcentajeRiesgo.toFixed(1)}%)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <Calendar className="h-8 w-8 text-red-500 mb-2" />
          <div className="text-2xl font-bold">
            {lifecycleStats.stats.perdidos}
          </div>
          <div className="text-sm text-muted-foreground">
            Clientes perdidos ({lifecycleStats.porcentajePerdidos.toFixed(1)}%)
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar detalle de cliente
  const renderClientDetail = (item: CustomerLifecycle) => (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Detalles del ciclo de vida</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Primera compra:</span>
            <span className="font-medium">{formatDate(item.primerCompra)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Última compra:</span>
            <span className="font-medium">{formatDate(item.ultimaCompra)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Días como cliente:</span>
            <span className="font-medium">{item.diasComoCliente}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Compras por mes:</span>
            <span className="font-medium">{item.comprasPorMes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor promedio:</span>
            <span className="font-medium">
              ${item.valorPromedio.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor total:</span>
            <span className="font-medium">${item.valorTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ReportDataTable
      columns={columns}
      data={data}
      searchColumn="nombre"
      searchPlaceholder="Buscar cliente..."
      filterColumn="estado"
      filterOptions={[
        { label: "Todos", value: "todos" },
        { label: "Activos", value: "Activo" },
        { label: "En Riesgo", value: "En Riesgo" },
        { label: "Perdidos", value: "Perdido" },
        { label: "Inactivos", value: "Inactivo" },
        { label: "Sin Compras", value: "Sin Compras" },
      ]}
      title="Ciclo de Vida del Cliente"
      subtitle="Análisis del valor del cliente a lo largo del tiempo"
      icon={<CalendarDays className="h-5 w-5 text-blue-500" />}
      exportFilename="ciclo-vida-clientes"
      exportOptions={{
        dateFields: ["primerCompra", "ultimaCompra"],
        numberFields: [
          "diasComoCliente",
          "comprasPorMes",
          "valorPromedio",
          "valorTotal",
        ],
        title: "Análisis del Ciclo de Vida de Clientes",
      }}
      renderRowSubComponent={renderClientDetail}
      summary={renderSummary()}
      emptyStateMessage="No hay datos de ciclo de vida de clientes disponibles."
    />
  );
};
