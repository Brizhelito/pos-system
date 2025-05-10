import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { RFMAnalysis } from "../services/customers/rfmService";
import { User, ArrowUpDown } from "lucide-react";
import { ReportDataTable } from "./data-table/ReportDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RFMAnalysisTableProps {
  data: RFMAnalysis[];
}

export const RFMAnalysisTable = ({ data }: RFMAnalysisTableProps) => {
  // Función para obtener color según segmento
  const getSegmentColor = (segmento: string) => {
    switch (segmento) {
      case "Campeones":
        return "bg-green-500";
      case "Leales":
        return "bg-blue-500";
      case "Potenciales":
        return "bg-purple-500";
      case "En Riesgo":
        return "bg-amber-500";
      case "Necesitan Atención":
        return "bg-orange-500";
      case "Nuevos":
        return "bg-teal-500";
      case "Durmientes":
        return "bg-gray-500";
      case "Ocasionales":
        return "bg-indigo-500";
      case "Sin Actividad":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calcular estadísticas de segmentos
  const segmentStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach((item) => {
      stats[item.segmento] = (stats[item.segmento] || 0) + 1;
    });

    // Ordenar por relevancia
    const sortedSegments = Object.entries(stats)
      .sort((a, b) => {
        const order = [
          "Campeones",
          "Leales",
          "Potenciales",
          "En Riesgo",
          "Necesitan Atención",
          "Nuevos",
          "Ocasionales",
          "Durmientes",
          "Sin Actividad",
        ];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      })
      .slice(0, 5);

    return sortedSegments;
  }, [data]);

  // Definir columnas para la tabla
  const columns = useMemo<ColumnDef<RFMAnalysis>[]>(
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
        accessorKey: "recencia",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Recencia (días)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("recencia")}</div>
        ),
      },
      {
        accessorKey: "frecuencia",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Frecuencia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("frecuencia")}</div>
        ),
      },
      {
        accessorKey: "monetizacion",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Monetización
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            ${(row.getValue("monetizacion") as number).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "puntuacionRFM",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Score RFM
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("puntuacionRFM")}
          </div>
        ),
      },
      {
        accessorKey: "segmento",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-right w-full justify-end"
          >
            Segmento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <Badge
              className={`${getSegmentColor(
                row.getValue("segmento")
              )} text-white`}
            >
              {row.getValue("segmento") as string}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  // Renderizar información de segmentos
  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">
        Distribución de clientes por segmento
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {segmentStats.map(([segment, count]) => (
          <div key={segment} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${getSegmentColor(
                    segment
                  )}`}
                ></span>
                {segment}
              </span>
              <span className="text-muted-foreground">
                {count} ({((count / data.length) * 100).toFixed(1)}%)
              </span>
            </div>
            <Progress value={(count / data.length) * 100} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar detalles de un cliente
  const renderClientDetail = (item: RFMAnalysis) => (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Detalles de puntuación RFM</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{item.puntuacionR}</div>
              <div className="text-xs text-muted-foreground">Recencia</div>
            </div>
            <div className="mt-2 text-xs text-center">
              {item.recencia} días desde la última compra
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{item.puntuacionF}</div>
              <div className="text-xs text-muted-foreground">Frecuencia</div>
            </div>
            <div className="mt-2 text-xs text-center">
              {item.frecuencia} compras totales
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{item.puntuacionM}</div>
              <div className="text-xs text-muted-foreground">Monetización</div>
            </div>
            <div className="mt-2 text-xs text-center">
              ${item.monetizacion.toFixed(2)} gastados
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ReportDataTable
      columns={columns}
      data={data}
      searchColumn="nombre"
      searchPlaceholder="Buscar cliente..."
      filterColumn="segmento"
      filterOptions={[
        { label: "Todos", value: "todos" },
        { label: "Campeones", value: "Campeones" },
        { label: "Leales", value: "Leales" },
        { label: "Potenciales", value: "Potenciales" },
        { label: "En Riesgo", value: "En Riesgo" },
        { label: "Necesitan Atención", value: "Necesitan Atención" },
        { label: "Nuevos", value: "Nuevos" },
        { label: "Ocasionales", value: "Ocasionales" },
        { label: "Durmientes", value: "Durmientes" },
        { label: "Sin Actividad", value: "Sin Actividad" },
      ]}
      title="Análisis RFM"
      subtitle="Recencia, Frecuencia y Monetización de los clientes"
      icon={<User className="h-5 w-5 text-purple-500" />}
      exportFilename="analisis-rfm"
      exportOptions={{
        numberFields: [
          "recencia",
          "frecuencia",
          "monetizacion",
          "puntuacionR",
          "puntuacionF",
          "puntuacionM",
          "puntuacionRFM",
        ],
        title: "Análisis RFM de Clientes",
      }}
      renderRowSubComponent={renderClientDetail}
      summary={renderSummary()}
      emptyStateMessage="No hay datos de clientes para el análisis RFM."
    />
  );
};
