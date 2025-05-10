"use client";

import { useState, useMemo } from "react";
import { TopProductBySeller } from "@/features/reports/services/sellers/sellersService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, Search, BarChart3, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopSellerProductsTableProps {
  data: TopProductBySeller[];
  isLoading?: boolean;
}

export function TopSellerProductsTable({
  data,
  isLoading = false,
}: TopSellerProductsTableProps) {
  const [selectedSeller, setSelectedSeller] = useState<number | "todos">(
    "todos"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"table" | "chart">("table");

  // Obtener lista de vendedores únicos
  const vendedores = useMemo(() => {
    return [...new Set(data.map((item) => item.userId))].map((userId) => {
      const item = data.find((d) => d.userId === userId);
      return {
        id: userId,
        nombre: item?.vendedor || "Desconocido",
      };
    });
  }, [data]);

  // Filtrar datos según el vendedor seleccionado y término de búsqueda
  const filteredData = useMemo(() => {
    let filtered =
      selectedSeller === "todos"
        ? data
        : data.filter((item) => item.userId === selectedSeller);

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.producto.toLowerCase().includes(term) ||
          item.categoria.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [data, selectedSeller, searchTerm]);

  // Datos para el gráfico de barras
  const chartData = useMemo(() => {
    // Limitamos a los 10 productos con mayor cantidad
    return [...filteredData]
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10)
      .map((item) => ({
        nombre:
          item.producto.length > 20
            ? item.producto.substring(0, 20) + "..."
            : item.producto,
        cantidad: item.cantidad,
        total: item.total,
        categoria: item.categoria,
        vendedor: item.vendedor,
      }));
  }, [filteredData]);

  // Calcular estadísticas del resumen
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalProductos: 0,
        totalVentas: 0,
        promedioUnidades: 0,
        categoriasMasVendidas: [],
      };
    }

    const totalProductos = filteredData.length;
    const totalVentas = filteredData.reduce((sum, item) => sum + item.total, 0);
    const totalUnidades = filteredData.reduce(
      (sum, item) => sum + item.cantidad,
      0
    );
    const promedioUnidades =
      totalProductos > 0 ? totalUnidades / totalProductos : 0;

    // Calcular categorías más vendidas
    const categorias: Record<string, number> = {};
    filteredData.forEach((item) => {
      categorias[item.categoria] =
        (categorias[item.categoria] || 0) + item.cantidad;
    });

    const categoriasMasVendidas = Object.entries(categorias)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));

    return {
      totalProductos,
      totalVentas,
      promedioUnidades,
      categoriasMasVendidas,
    };
  }, [filteredData]);

  // Colores para el gráfico
  const colors = [
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#bfdbfe",
    "#dbeafe",
  ];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px] mb-4" />
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

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por producto o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={selectedSeller.toString()}
            onValueChange={(value) =>
              setSelectedSeller(
                value === "todos" ? "todos" : parseInt(value, 10)
              )
            }
          >
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Filtrar por vendedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los vendedores</SelectItem>
              {vendedores.map((vendedor) => (
                <SelectItem key={vendedor.id} value={vendedor.id.toString()}>
                  {vendedor.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Total de productos
                </p>
              </div>
              <p className="text-2xl font-bold">{stats.totalProductos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Vendedor</p>
              </div>
              <p className="text-2xl font-bold">
                {selectedSeller === "todos"
                  ? "Todos"
                  : vendedores.find((v) => v.id === selectedSeller)?.nombre}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total ventas</p>
              </div>
              <p className="text-2xl font-bold">
                €{stats.totalVentas.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pestañas para cambiar entre tabla y gráfico */}
        <Tabs
          defaultValue="table"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "table" | "chart")}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="chart">Gráfico</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="pt-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Total (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No hay datos disponibles para los filtros seleccionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, i) => (
                      <TableRow
                        key={`${item.userId}-${item.productoId}-${i}`}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>{item.vendedor}</TableCell>
                        <TableCell className="font-medium">
                          {item.producto}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.categoria}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.cantidad}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          €{item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="pt-4">
            {chartData.length === 0 ? (
              <div className="text-center py-10 border rounded-md">
                No hay datos disponibles para mostrar en el gráfico
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="nombre"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "total")
                          return [`€${Number(value).toFixed(2)}`, "Total"];
                        return [value, "Cantidad"];
                      }}
                      labelFormatter={(label) => `Producto: ${label}`}
                    />
                    <Bar dataKey="cantidad" name="Cantidad" fill="#3b82f6">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Categorías más vendidas */}
        {stats.categoriasMasVendidas.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">
              Categorías más vendidas
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.categoriasMasVendidas.map((cat, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs py-1">
                  {cat.nombre} ({cat.cantidad})
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center">
          {selectedSeller === "todos"
            ? "Mostrando todos los vendedores"
            : `Mostrando productos de ${
                vendedores.find((v) => v.id === selectedSeller)?.nombre
              }`}
          {searchTerm && ` • Filtrado por "${searchTerm}"`}
        </p>
      </CardContent>
    </Card>
  );
}
