"use client";

import { useState, useMemo, useEffect } from "react";
import { SellerTrendItem } from "@/features/reports/services/sellers/sellersService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  LineChart as LineChartIcon,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { CURRENCY, CHART_COLORS } from "@/features/reports/config/constants";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";
import { DateRange } from "react-day-picker";

interface SellerTrendChartProps {
  data: SellerTrendItem[];
  isLoading?: boolean;
}

type ChartType = "line" | "bar" | "area";
type MetricType = "ventas" | "monto";

export function SellerTrendChart({
  data,
  isLoading = false,
}: SellerTrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("ventas");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedSellers, setSelectedSellers] = useState<Set<number>>(
    new Set()
  );
  const [showAllSellers, setShowAllSellers] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [stackedView, setStackedView] = useState(false);

  // Función para actualizar el rango de fechas
  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  // Obtener lista de vendedores únicos
  const vendedores = useMemo(() => {
    const uniqueSellers = [...new Set(data.map((item) => item.userId))];
    return uniqueSellers.map((userId) => {
      const sellerData = data.find((item) => item.userId === userId);
      return {
        id: userId,
        nombre: sellerData?.nombre || "Desconocido",
      };
    });
  }, [data]);

  // Inicializar los vendedores seleccionados cuando la lista no esté vacía
  useEffect(() => {
    if (showAllSellers && vendedores.length > 0 && selectedSellers.size === 0) {
      const allSellers = new Set(vendedores.map((v) => v.id));
      setSelectedSellers(allSellers);
    }
  }, [vendedores, showAllSellers, selectedSellers.size]);

  // Aplicar filtros a los datos
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filtrar por fecha si es necesario
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((item) => {
        const itemDate = parseISO(item.fecha);

        if (dateRange.from && dateRange.to) {
          return (
            isAfter(itemDate, startOfDay(dateRange.from)) &&
            isBefore(itemDate, startOfDay(dateRange.to))
          );
        }
        if (dateRange.from) {
          return isAfter(itemDate, startOfDay(dateRange.from));
        }
        if (dateRange.to) {
          return isBefore(itemDate, startOfDay(dateRange.to));
        }
        return true;
      });
    }

    return filtered;
  }, [data, dateRange]);

  // Consolidar datos para el gráfico
  const chartData = useMemo(() => {
    // Obtener fechas únicas
    const uniqueDates = [
      ...new Set(filteredData.map((item) => item.fecha)),
    ].sort();

    // Crear puntos para el gráfico
    return uniqueDates.map((fecha) => {
      const point: Record<string, string | number> = {
        fecha,
        fechaFormateada: format(parseISO(fecha), "dd MMM", { locale: es }),
      };

      // Si hay vendedores seleccionados, incluir solo esos
      const sellersToInclude = showAllSellers
        ? vendedores
        : vendedores.filter((v) => selectedSellers.has(v.id));

      sellersToInclude.forEach((vendedor) => {
        const sellerData = filteredData.find(
          (item) => item.fecha === fecha && item.userId === vendedor.id
        );

        point[`${vendedor.nombre}`] = sellerData
          ? selectedMetric === "ventas"
            ? sellerData.ventas
            : sellerData.monto
          : 0;
      });

      // Añadir total si es necesario
      if (stackedView) {
        let total = 0;
        sellersToInclude.forEach((seller) => {
          total += Number(point[seller.nombre] || 0);
        });
        point.total = total;
      }

      return point;
    });
  }, [
    filteredData,
    vendedores,
    selectedMetric,
    showAllSellers,
    selectedSellers,
    stackedView,
  ]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalVentas: 0,
        totalMonto: 0,
        promedioDiario: 0,
        tendencia: "neutral",
        mejorVendedor: { nombre: "N/A", valor: 0 },
      };
    }

    // Totales por métrica
    let totalVentas = 0;
    let totalMonto = 0;

    // Para calcular tendencia
    const halfIndex = Math.floor(chartData.length / 2);
    let firstHalfTotal = 0;
    let secondHalfTotal = 0;

    // Calcular ventas por vendedor
    const vendedorTotals: Record<string, { ventas: number; monto: number }> =
      {};

    filteredData.forEach((item) => {
      if (showAllSellers || selectedSellers.has(item.userId)) {
        // Acumular totales
        totalVentas += item.ventas;
        totalMonto += item.monto;

        // Para tendencia
        const itemDate = parseISO(item.fecha);
        const midDate = parseISO(
          (chartData[halfIndex]?.fecha as string) || item.fecha
        );

        if (isBefore(itemDate, midDate)) {
          firstHalfTotal +=
            selectedMetric === "ventas" ? item.ventas : item.monto;
        } else {
          secondHalfTotal +=
            selectedMetric === "ventas" ? item.ventas : item.monto;
        }

        // Acumular por vendedor
        if (!vendedorTotals[item.nombre]) {
          vendedorTotals[item.nombre] = { ventas: 0, monto: 0 };
        }
        vendedorTotals[item.nombre].ventas += item.ventas;
        vendedorTotals[item.nombre].monto += item.monto;
      }
    });

    // Determinar tendencia
    let tendencia: "positiva" | "negativa" | "neutral" = "neutral";
    if (secondHalfTotal > firstHalfTotal * 1.05) {
      // 5% de mejora
      tendencia = "positiva";
    } else if (secondHalfTotal < firstHalfTotal * 0.95) {
      // 5% de deterioro
      tendencia = "negativa";
    }

    // Encontrar mejor vendedor
    let mejorVendedor = { nombre: "N/A", valor: 0 };
    Object.entries(vendedorTotals).forEach(([nombre, valores]) => {
      const valorMetrica =
        selectedMetric === "ventas" ? valores.ventas : valores.monto;
      if (valorMetrica > mejorVendedor.valor) {
        mejorVendedor = { nombre, valor: valorMetrica };
      }
    });

    return {
      totalVentas,
      totalMonto,
      promedioDiario:
        chartData.length > 0
          ? (selectedMetric === "ventas" ? totalVentas : totalMonto) /
            chartData.length
          : 0,
      tendencia,
      mejorVendedor,
    };
  }, [
    chartData,
    filteredData,
    selectedMetric,
    showAllSellers,
    selectedSellers,
  ]);

  const toggleSellerSelection = (id: number) => {
    const newSelection = new Set(selectedSellers);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSellers(newSelection);
    setShowAllSellers(newSelection.size === vendedores.length);
  };

  const selectAllSellers = () => {
    setSelectedSellers(new Set(vendedores.map((v) => v.id)));
    setShowAllSellers(true);
  };

  const clearSellerSelection = () => {
    setSelectedSellers(new Set());
    setShowAllSellers(false);
  };

  // Inicializar con últimos 30 días si no hay rango seleccionado
  useEffect(() => {
    if (!dateRange.from && !dateRange.to) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      setDateRange({
        from: thirtyDaysAgo,
        to: today,
      });
    }
  }, [dateRange.from, dateRange.to]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar el gráfico adecuado según el tipo seleccionado
  const renderChart = () => {
    const sellersToShow = vendedores
      .filter((v) => showAllSellers || selectedSellers.has(v.id))
      .map((v) => v.nombre);

    // No mostrar nada si no hay datos o vendedores seleccionados
    if (chartData.length === 0 || sellersToShow.length === 0) {
      return (
        <div className="h-[400px] flex items-center justify-center border rounded-md">
          <p className="text-muted-foreground">
            No hay datos disponibles para mostrar
          </p>
        </div>
      );
    }

    // Gráfico de líneas
    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fechaFormateada" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "total")
                  return [CURRENCY.format(Number(value)), "Total"];
                return selectedMetric === "ventas"
                  ? [value, name]
                  : [CURRENCY.format(Number(value)), name];
              }}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Legend />
            {sellersToShow.map((seller, index) => (
              <Line
                key={seller}
                type="monotone"
                dataKey={seller}
                name={seller}
                stroke={
                  CHART_COLORS.primary[index % CHART_COLORS.primary.length]
                }
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            ))}
            {stackedView && (
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#000"
                strokeWidth={3}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Gráfico de barras
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fechaFormateada" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "total")
                  return [CURRENCY.format(Number(value)), "Total"];
                return selectedMetric === "ventas"
                  ? [value, name]
                  : [CURRENCY.format(Number(value)), name];
              }}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Legend />
            {sellersToShow.map((seller, index) => (
              <Bar
                key={seller}
                dataKey={seller}
                name={seller}
                fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]}
                stackId={stackedView ? "a" : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Gráfico de área (default)
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fechaFormateada" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "total")
                return [CURRENCY.format(Number(value)), "Total"];
              return selectedMetric === "ventas"
                ? [value, name]
                : [CURRENCY.format(Number(value)), name];
            }}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          {sellersToShow.map((seller, index) => (
            <Area
              key={seller}
              type="monotone"
              dataKey={seller}
              name={seller}
              fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]}
              stroke={CHART_COLORS.primary[index % CHART_COLORS.primary.length]}
              stackId={stackedView ? "a" : undefined}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Controles superiores */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Select
            value={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value as MetricType)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Seleccionar métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ventas">Cantidad de ventas</SelectItem>
              <SelectItem value="monto">{`Monto (${CURRENCY.symbol})`}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className={chartType === "line" ? "bg-primary/10" : ""}
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="h-4 w-4 mr-1" />
              Líneas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={chartType === "bar" ? "bg-primary/10" : ""}
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Barras
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={chartType === "area" ? "bg-primary/10" : ""}
              onClick={() => setChartType("area")}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Área
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="stacked"
              checked={stackedView}
              onCheckedChange={setStackedView}
            />
            <Label htmlFor="stacked">Vista apilada</Label>
          </div>
        </div>

        {/* Control de fechas */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Filtrar por fecha</h3>
          <AdvancedDateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            compact={true}
          />
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                {selectedMetric === "ventas" ? (
                  <Calendar className="h-5 w-5 text-primary" />
                ) : (
                  <Calendar className="h-5 w-5 text-primary" />
                )}
                <p className="text-sm text-muted-foreground">
                  {selectedMetric === "ventas" ? "Total ventas" : "Total monto"}
                </p>
              </div>
              <p className="text-2xl font-bold">
                {selectedMetric === "ventas"
                  ? stats.totalVentas
                  : CURRENCY.format(stats.totalMonto)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Promedio diario</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {selectedMetric === "ventas"
                    ? stats.promedioDiario.toFixed(1)
                    : CURRENCY.format(stats.promedioDiario)}
                </p>
                {stats.tendencia === "positiva" && (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                )}
                {stats.tendencia === "negativa" && (
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Mejor vendedor</p>
              </div>
              <div className="flex flex-col">
                <p className="text-2xl font-bold">
                  {stats.mejorVendedor.nombre}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedMetric === "ventas"
                    ? `${stats.mejorVendedor.valor} ventas`
                    : CURRENCY.format(stats.mejorVendedor.valor)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtro de vendedores */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Filtrar por vendedor</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllSellers}>
                Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSellerSelection}
              >
                Ninguno
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {vendedores.map((vendedor) => (
              <Badge
                key={vendedor.id}
                variant={
                  selectedSellers.has(vendedor.id) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleSellerSelection(vendedor.id)}
              >
                {vendedor.nombre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Visualización del gráfico */}
        {renderChart()}
      </CardContent>
    </Card>
  );
}
