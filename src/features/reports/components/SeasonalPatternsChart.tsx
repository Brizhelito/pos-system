import { Card, CardContent } from "@/components/ui/card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { SeasonalPattern } from "../services/customers/rfmService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExportButtons } from "./ExportButtons";

interface SeasonalPatternsChartProps {
  data: SeasonalPattern[];
}

export const SeasonalPatternsChart = ({ data }: SeasonalPatternsChartProps) => {
  // Estadísticas básicas
  const totalClientes = data.reduce((sum, item) => sum + item.clientes, 0);
  const totalTransacciones = data.reduce(
    (sum, item) => sum + item.transacciones,
    0
  );
  const totalValor = data.reduce((sum, item) => sum + item.valorTotal, 0);

  // Promedios
  const avgClientesPorMes = totalClientes / data.length || 0;
  const avgTransaccionesPorMes = totalTransacciones / data.length || 0;
  const avgValorPorMes = totalValor / data.length || 0;

  // Meses con máximo valor
  const mesMaxClientes = data.reduce(
    (max, item) => (item.clientes > max.clientes ? item : max),
    data[0] || { periodo: "N/A", clientes: 0 }
  );
  const mesMaxTransacciones = data.reduce(
    (max, item) => (item.transacciones > max.transacciones ? item : max),
    data[0] || { periodo: "N/A", transacciones: 0 }
  );
  const mesMaxValor = data.reduce(
    (max, item) => (item.valorTotal > max.valorTotal ? item : max),
    data[0] || { periodo: "N/A", valorTotal: 0 }
  );

  // Preparar datos para exportación
  const getExportData = () => {
    return data.map((item) => ({
      Periodo: item.periodo,
      ClientesActivos: item.clientes,
      Transacciones: item.transacciones,
      ValorPromedio: item.valorPromedio,
      ValorTotal: item.valorTotal,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Patrones Estacionales de Compra</CardTitle>
              <CardDescription>
                Análisis del comportamiento de clientes a lo largo del tiempo
              </CardDescription>
            </div>
            <ExportButtons
              data={getExportData()}
              filename="patrones-estacionales"
              numberFields={[
                "ClientesActivos",
                "Transacciones",
                "ValorPromedio",
                "ValorTotal",
              ]}
              title="Patrones Estacionales de Compra"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Clientes Activos</CardTitle>
                <CardDescription>Promedio mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {avgClientesPorMes.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Máximo: {mesMaxClientes.clientes} en {mesMaxClientes.periodo}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Transacciones</CardTitle>
                <CardDescription>Promedio mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {avgTransaccionesPorMes.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Máximo: {mesMaxTransacciones.transacciones} en{" "}
                  {mesMaxTransacciones.periodo}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Valor de Ventas</CardTitle>
                <CardDescription>Promedio mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${avgValorPorMes.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Máximo: ${mesMaxValor.valorTotal.toFixed(2)} en{" "}
                  {mesMaxValor.periodo}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-[300px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="clientes"
                  stroke="#8b5cf6"
                  name="Clientes Activos"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="transacciones"
                  stroke="#22c55e"
                  name="Transacciones"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="valorTotal"
                  stroke="#ef4444"
                  name="Valor Total ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="valorPromedio"
                  name="Valor Promedio por Transacción ($)"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
              </AreaChart>
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
                  <TableHead className="text-center">
                    Clientes Activos
                  </TableHead>
                  <TableHead className="text-center">Transacciones</TableHead>
                  <TableHead className="text-center">
                    Valor Promedio ($)
                  </TableHead>
                  <TableHead className="text-center">Valor Total ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.periodo}>
                      <TableCell className="font-medium">
                        {item.periodo}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.clientes}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transacciones}
                      </TableCell>
                      <TableCell className="text-center">
                        ${item.valorPromedio.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        ${item.valorTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
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
