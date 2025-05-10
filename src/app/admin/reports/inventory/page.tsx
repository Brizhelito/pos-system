"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Search, SortAsc, SortDesc } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { InventoryReportsApi } from "@/features/reports/utils/reportServices";
import { Pagination } from "@/features/reports/components/Pagination";
import { ExportButtons } from "@/features/reports/components/ExportButtons";
import { ReportData } from "@/features/reports/utils/exportUtils";
import { Skeleton } from "@/components/ui/skeleton";

// Nuevas importaciones para reportes avanzados
import { StockPredictionTable } from "@/features/reports/components/StockPredictionTable";
import { EarlyAlertTable } from "@/features/reports/components/EarlyAlertTable";
import { ExcessInventoryTable } from "@/features/reports/components/ExcessInventoryTable";
import { InventoryVelocityTable } from "@/features/reports/components/InventoryVelocityTable";
import {
  StockPredictionItem,
  EarlyAlertItem,
  ExcessInventoryItem,
  InventoryVelocityItem,
} from "@/features/reports/services/inventory/inventoryService";

// Interfaces para los datos
interface InventoryItem {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  valorTotal: number;
  ultimaVenta: Date | null;
  rotacion: string;
}

interface CategorySummary {
  categoria: string;
  productos: number;
  valorTotal: number;
  porcentaje: number;
}

// Añadir la función convertToReportData
function convertToReportData<T extends object>(data: T[]): ReportData[] {
  return data.map((item) => ({ ...item } as unknown as ReportData));
}

export default function AdminInventoryReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);

  // Ordenamiento
  const [sortField, setSortField] = useState<keyof InventoryItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Nuevos estados para reportes avanzados
  const [stockPredictionData, setStockPredictionData] = useState<
    StockPredictionItem[]
  >([]);
  const [earlyAlertData, setEarlyAlertData] = useState<EarlyAlertItem[]>([]);
  const [excessInventoryData, setExcessInventoryData] = useState<
    ExcessInventoryItem[]
  >([]);
  const [inventoryVelocityData, setInventoryVelocityData] = useState<
    InventoryVelocityItem[]
  >([]);
  const [totalInventoryCost, setTotalInventoryCost] = useState(0);
  const [isAdvancedStatsLoaded, setIsAdvancedStatsLoaded] = useState(false);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setIsAdvancedStatsLoaded(false);
  };

  // Cargar datos cuando cambia el rango de fechas
  useEffect(() => {
    async function loadData() {
      if (!dateRange.from || !dateRange.to) return;

      setIsLoading(true);
      try {
        // Obtener datos de inventario
        const inventory = await InventoryReportsApi.fetchReport(
          "getInventoryItems",
          {
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        );
        setInventoryData(inventory);
        setFilteredData(inventory);
        setCurrentPage(1);

        // Obtener resumen por categoría
        const categories = await InventoryReportsApi.fetchReport(
          "getInventoryByCategory",
          {
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        );
        setCategorySummary(categories);
      } catch (error) {
        console.error("Error cargando datos de inventario:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [dateRange]);

  // Función para manejar el ordenamiento
  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }

    // Ordenar datos según el campo y dirección
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      // Manejar valores nulos para fechas
      if (field === "ultimaVenta") {
        if (valueA === null) return sortOrder === "asc" ? 1 : -1;
        if (valueB === null) return sortOrder === "asc" ? -1 : 1;
      }

      // Ordenar strings
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.toLowerCase().localeCompare(valueB.toLowerCase())
          : valueB.toLowerCase().localeCompare(valueA.toLowerCase());
      }

      // Ordenar números
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });

    setFilteredData(sorted);
    setCurrentPage(1);
  };

  // Obtener el icono de ordenamiento
  const getSortIcon = (field: keyof InventoryItem) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  // Estilo para las celdas ordenables
  const getSortableHeaderStyle = (field: keyof InventoryItem) => {
    return `cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 ${
      sortField === field ? "text-primary" : ""
    }`;
  };

  // Función para obtener un color según la rotación
  const getRotationColor = (rotacion: string) => {
    switch (rotacion) {
      case "Alta":
        return "bg-green-500";
      case "Media":
        return "bg-blue-500";
      case "Baja":
        return "bg-amber-500";
      case "Muy baja":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Filtrar por búsqueda
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(inventoryData);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const filtered = inventoryData.filter(
        (item) =>
          item.nombre.toLowerCase().includes(lowercaseSearchTerm) ||
          item.categoria.toLowerCase().includes(lowercaseSearchTerm)
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  // Formatear fecha
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Calcular datos paginados
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Cargar reportes avanzados cuando se selecciona la pestaña
  const loadAdvancedReports = async () => {
    if (isAdvancedStatsLoaded || !dateRange.from || !dateRange.to) return;

    setIsLoading(true);
    try {
      // Obtener predicción de agotamiento de stock
      const stockPrediction = await InventoryReportsApi.fetchReport(
        "getStockPrediction",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setStockPredictionData(stockPrediction);

      // Obtener alertas tempranas de stock
      const earlyAlerts = await InventoryReportsApi.fetchReport(
        "getEarlyAlerts",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setEarlyAlertData(earlyAlerts);

      // Obtener datos de exceso de inventario
      const excessInventory = await InventoryReportsApi.fetchReport(
        "getExcessInventory",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setExcessInventoryData(excessInventory);

      // Obtener datos de velocidad de rotación
      const inventoryVelocity = await InventoryReportsApi.fetchReport(
        "getInventoryVelocity",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setInventoryVelocityData(inventoryVelocity);

      // Obtener valor total del inventario para cálculos de porcentajes
      const inventoryValue = await InventoryReportsApi.fetchReport(
        "getInventoryValue",
        {}
      );
      setTotalInventoryCost(inventoryValue.totalValue || 0);

      setIsAdvancedStatsLoaded(true);
    } catch (error) {
      console.error("Error cargando reportes avanzados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Inventario</h1>
          <p className="text-muted-foreground">
            Visualiza y analiza el estado del inventario
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/reports">
              <ChevronLeft className="h-4 w-4 mr-1" /> Volver
            </Link>
          </Button>
          <AdvancedDateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Skeleton de tarjetas de métricas */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    <Skeleton className="h-4 w-24" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Skeleton de tabla */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      ) : (
        <>
          {/* Mostrar información resumida en tarjetas de métricas */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryData.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{totalInventoryCost.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Categorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categorySummary.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {earlyAlertData.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs
            defaultValue="inventory"
            className="w-full"
            onValueChange={(value) => {
              if (value === "advanced" && !isAdvancedStatsLoaded) {
                loadAdvancedReports();
              }
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="inventory">Inventario</TabsTrigger>
                <TabsTrigger value="categories">Categorías</TabsTrigger>
                <TabsTrigger value="advanced">Análisis Avanzado</TabsTrigger>
              </TabsList>

              {/* Botones de exportación - Solo se muestran cuando hay datos */}
              {inventoryData.length > 0 && (
                <ExportButtons
                  data={convertToReportData(inventoryData)}
                  filename="inventario-reporte"
                  dateFields={["ultimaVenta"]}
                  numberFields={["stock", "precio", "valorTotal"]}
                />
              )}
            </div>

            <TabsContent value="inventory" className="space-y-6">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-xl font-semibold">
                  Productos en Inventario
                </h2>
                <div className="relative max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableCaption>Estado actual del inventario</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>
                        <div
                          className={getSortableHeaderStyle("nombre")}
                          onClick={() => handleSort("nombre")}
                        >
                          Producto {getSortIcon("nombre")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className={getSortableHeaderStyle("categoria")}
                          onClick={() => handleSort("categoria")}
                        >
                          Categoría {getSortIcon("categoria")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className={getSortableHeaderStyle("stock")}
                          onClick={() => handleSort("stock")}
                        >
                          Stock {getSortIcon("stock")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className={getSortableHeaderStyle("precio")}
                          onClick={() => handleSort("precio")}
                        >
                          Precio {getSortIcon("precio")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className={getSortableHeaderStyle("valorTotal")}
                          onClick={() => handleSort("valorTotal")}
                        >
                          Valor Total {getSortIcon("valorTotal")}
                        </div>
                      </TableHead>
                      <TableHead>Última Venta</TableHead>
                      <TableHead>
                        <div
                          className={getSortableHeaderStyle("rotacion")}
                          onClick={() => handleSort("rotacion")}
                        >
                          Rotación {getSortIcon("rotacion")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          No se encontraron registros
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-medium">
                            {item.nombre}
                          </TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>{item.precio.toFixed(2)} €</TableCell>
                          <TableCell>{item.valorTotal.toFixed(2)} €</TableCell>
                          <TableCell>{formatDate(item.ultimaVenta)}</TableCell>
                          <TableCell>
                            <Badge className={getRotationColor(item.rotacion)}>
                              {item.rotacion}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Mostrando{" "}
                  {filteredData.length === 0
                    ? 0
                    : (currentPage - 1) * pageSize + 1}{" "}
                  - {Math.min(currentPage * pageSize, filteredData.length)} de{" "}
                  {filteredData.length} registros
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredData.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            </TabsContent>

            <TabsContent value="categories" className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resumen por Categoría</h2>
                {categorySummary.length > 0 && (
                  <ExportButtons
                    data={convertToReportData(categorySummary)}
                    filename="inventario-categorias"
                    numberFields={["productos", "valorTotal", "porcentaje"]}
                  />
                )}
              </div>
              <Table>
                <TableCaption>
                  Distribución del inventario por categoría
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Productos</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Porcentaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySummary.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {category.categoria}
                      </TableCell>
                      <TableCell className="text-right">
                        {category.productos}
                      </TableCell>
                      <TableCell className="text-right">
                        {category.valorTotal.toFixed(2)} €
                      </TableCell>
                      <TableCell className="text-right">
                        {category.porcentaje.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Recomendaciones</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    Revisar productos con rotación muy baja para posibles
                    promociones
                  </li>
                  <li>
                    Considerar reponer stock de productos con alta rotación
                  </li>
                  <li>
                    Evaluar la posibilidad de descontinuar productos sin
                    movimiento
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-8">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Cargando análisis avanzados...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      Predicción y Alertas
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <StockPredictionTable data={stockPredictionData} />
                      </div>
                      <div>
                        <EarlyAlertTable data={earlyAlertData} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      Análisis de Rotación
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      <ExcessInventoryTable
                        data={excessInventoryData}
                        totalInventoryCost={totalInventoryCost}
                      />
                      <InventoryVelocityTable data={inventoryVelocityData} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Datos basados en el período seleccionado:{" "}
                      {dateRange.from?.toLocaleDateString()} -{" "}
                      {dateRange.to?.toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      {stockPredictionData.length > 0 && (
                        <ExportButtons
                          data={convertToReportData(stockPredictionData)}
                          filename="prediccion-agotamiento"
                          dateFields={["estimatedEmptyDate"]}
                          numberFields={[
                            "currentStock",
                            "minStock",
                            "dailyConsumption",
                            "daysUntilEmpty",
                          ]}
                          title="Predicción de Agotamiento de Stock"
                          showPDF={true}
                          showExcel={true}
                          showCSV={false}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
