import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RetentionData } from "../services/customers/rfmService";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ExportButtons } from "./ExportButtons";

interface RetentionRateTableProps {
  data: RetentionData[];
}

export const RetentionRateTable = ({ data }: RetentionRateTableProps) => {
  // Convertir a formato para Recharts
  const chartData = data.map((item) => ({
    periodo: item.periodo,
    "Tasa de Retención": item.tasaRetencion,
    "Nuevos Clientes": item.nuevos,
    "Clientes Recurrentes": item.recurrentes,
    "Clientes Perdidos": item.perdidos,
  }));

  // Función para obtener color según tasa de retención
  const getRetentionRateColor = (rate: number) => {
    if (rate >= 75) return "bg-green-500";
    if (rate >= 50) return "bg-blue-500";
    if (rate >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  const calculateTrend = (
    currentMonth: RetentionData,
    prevMonth: RetentionData | undefined
  ) => {
    if (!prevMonth) return "neutral";
    return currentMonth.tasaRetencion > prevMonth.tasaRetencion
      ? "positive"
      : "negative";
  };

  // Preparar datos para exportación
  const getExportData = () => {
    return data.map((item) => ({
      Periodo: item.periodo,
      NuevosClientes: item.nuevos,
      ClientesRecurrentes: item.recurrentes,
      ClientesPerdidos: item.perdidos,
      TasaRetencion: item.tasaRetencion,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tasa de Retención de Clientes</CardTitle>
              <CardDescription>
                Análisis de los clientes que regresan cada mes
              </CardDescription>
            </div>
            <ExportButtons
              data={getExportData()}
              filename="tasa-retencion-clientes"
              numberFields={[
                "NuevosClientes",
                "ClientesRecurrentes",
                "ClientesPerdidos",
                "TasaRetencion",
              ]}
              title="Reporte de Tasa de Retención de Clientes"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="Tasa de Retención"
                  fill="#0ea5e9"
                  name="Tasa de Retención (%)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="Nuevos Clientes"
                  fill="#22c55e"
                  name="Nuevos Clientes"
                />
                <Bar
                  yAxisId="right"
                  dataKey="Clientes Recurrentes"
                  fill="#8b5cf6"
                  name="Clientes Recurrentes"
                />
                <Bar
                  yAxisId="right"
                  dataKey="Clientes Perdidos"
                  fill="#ef4444"
                  name="Clientes Perdidos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-center">Nuevos Clientes</TableHead>
                  <TableHead className="text-center">
                    Clientes Recurrentes
                  </TableHead>
                  <TableHead className="text-center">
                    Clientes Perdidos
                  </TableHead>
                  <TableHead className="text-center">
                    Tasa de Retención
                  </TableHead>
                  <TableHead className="text-center">Tendencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item, index) => {
                    const trend = calculateTrend(
                      item,
                      index > 0 ? data[index - 1] : undefined
                    );

                    return (
                      <TableRow key={item.periodo}>
                        <TableCell className="font-medium">
                          {item.periodo}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.nuevos}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.recurrentes}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.perdidos}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${getRetentionRateColor(
                              item.tasaRetencion
                            )} text-white`}
                          >
                            {item.tasaRetencion}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {trend === "positive" ? (
                            <Badge className="bg-green-500 text-white">
                              ▲ Mejora
                            </Badge>
                          ) : trend === "negative" ? (
                            <Badge className="bg-red-500 text-white">
                              ▼ Declive
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500 text-white">
                              ◆ Estable
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No se encontraron datos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
