"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  LineChart,
  BarChart2,
  PieChart,
  ListFilter,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { SalesReportsApi } from "@/features/reports/utils/reportServices";
import { format } from "date-fns";

// Importación de componentes reutilizables
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";
import {
  ReportTabs,
  ReportTabItem,
} from "@/features/reports/components/ui/ReportTabs";
import {
  ReportMetricCards,
  MetricCardProps,
} from "@/features/reports/components/ui/ReportMetricCards";
import { ReportLoadingSkeleton } from "@/features/reports/components/ui/ReportLoadingSkeleton";

// Componentes específicos de reportes de ventas
import {
  SalesDataTable,
  SaleItem,
} from "@/features/reports/components/SalesDataTable";
import {
  SalesBarChart,
  BarChartItem,
} from "@/features/reports/components/SalesBarChart";
import { SalesLineChart } from "@/features/reports/components/SalesLineChart";
import { SalesPieChart } from "@/features/reports/components/SalesPieChart";
import { TimeAnalysisCharts } from "@/features/reports/components/TimeAnalysisCharts";
import { ComparativeAnalysisTable } from "@/features/reports/components/ComparativeAnalysisTable";
import { TicketAnalysisChart } from "@/features/reports/components/TicketAnalysisChart";
import { AssociatedProductsTable } from "@/features/reports/components/AssociatedProductsTable";
import { ProfitMarginTable } from "@/features/reports/components/ProfitMarginTable";

// Importación de tipos
import {
  HourlyAnalysisData,
  WeekdayAnalysisData,
  ComparativeAnalysisData,
  TicketAnalysisData,
  AssociatedProductData,
  ProfitMarginData,
} from "@/features/reports/services/sales/salesService";

// Interfaces para los datos de la API
interface ProductCategory {
  name: string;
}

interface Product {
  name: string;
  category: ProductCategory;
}

interface SaleItemData {
  id: number;
  unitPrice: string | number;
  quantity: number;
  subtotal: string | number;
  product: Product;
}

interface User {
  name: string;
}

interface SaleData {
  id: number;
  saleDate: string | Date;
  totalAmount: string | number;
  saleitem: SaleItemData[];
  user: User;
}

// Tipos para los gráficos
interface LineChartItem {
  fecha: string;
  ventas: number;
}

interface PieChartItem {
  name: string;
  value: number;
}

// Datos recibidos de la API para el gráfico de barras
interface MonthlySummaryItem {
  month?: string;
  name?: string;
  sales?: number;
  ventas?: number;
  revenue?: number;
  ingresos?: number;
}

export default function AdminSalesReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los diferentes tipos de datos
  const [salesData, setSalesData] = useState<SaleItem[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartItem[]>([]);
  const [lineChartData, setLineChartData] = useState<LineChartItem[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartItem[]>([]);

  // Estados para estadísticas avanzadas
  const [hourlyData, setHourlyData] = useState<HourlyAnalysisData[]>([]);
  const [weekdayData, setWeekdayData] = useState<WeekdayAnalysisData[]>([]);
  const [comparativeData, setComparativeData] = useState<
    ComparativeAnalysisData[]
  >([]);
  const [ticketData, setTicketData] = useState<TicketAnalysisData[]>([]);
  const [associatedProductsData, setAssociatedProductsData] = useState<
    AssociatedProductData[]
  >([]);
  const [profitMarginData, setProfitMarginData] = useState<ProfitMarginData[]>(
    []
  );
  const [isAdvancedStatsLoaded, setIsAdvancedStatsLoaded] = useState(false);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    // Resetear el estado de carga de estadísticas avanzadas
    setIsAdvancedStatsLoaded(false);
  };

  // Función para generar nombres de archivos con fecha
  const getExportFilename = (baseName: string) => {
    if (!dateRange.from || !dateRange.to) return baseName;

    const fromDate = format(dateRange.from, "yyyyMMdd");
    const toDate = format(dateRange.to, "yyyyMMdd");

    return `${baseName}-${fromDate}-${toDate}`;
  };

  // Cargar datos cuando cambia el rango de fechas
  useEffect(() => {
    async function loadData() {
      if (!dateRange.from || !dateRange.to) return;

      setIsLoading(true);
      try {
        // Cargar los diferentes tipos de datos para los gráficos
        const currentYear = new Date().getFullYear();

        // Datos para el gráfico de barras
        const monthlySummary = await SalesReportsApi.fetchReport(
          "getMonthlySalesSummary",
          { year: currentYear }
        );

        // Adaptar datos para el formato esperado por SalesBarChart
        const adaptedBarChartData = monthlySummary.map(
          (item: MonthlySummaryItem) => ({
            name: item.month || item.name || "",
            ventas: item.sales || item.ventas || 0,
            ingresos: item.revenue || item.ingresos || 0,
          })
        );

        setBarChartData(adaptedBarChartData);

        // Datos para el gráfico de líneas (tendencia)
        const trendData = await SalesReportsApi.fetchReport("getSalesTrend", {
          startDate: dateRange.from,
          endDate: dateRange.to,
        });
        setLineChartData(trendData);

        // Datos para el gráfico circular (categorías)
        const categoryData = await SalesReportsApi.fetchReport(
          "getSalesByCategory",
          {
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        );
        setPieChartData(categoryData);

        // Datos para la tabla
        const sales = await SalesReportsApi.fetchReport("getSalesByDateRange", {
          startDate: dateRange.from,
          endDate: dateRange.to,
        });

        // Transformar datos para la tabla
        const tableData = sales.flatMap((sale: SaleData) =>
          sale.saleitem.map((item: SaleItemData) => ({
            id: `${sale.id}-${item.id}`,
            fecha: new Date(sale.saleDate).toISOString().split("T")[0],
            producto: item.product.name,
            categoria: item.product.category.name,
            precio: Number(item.unitPrice),
            cantidad: item.quantity,
            total: Number(item.subtotal),
            vendedor: sale.user.name,
          }))
        );

        setSalesData(tableData);
      } catch (error) {
        console.error("Error cargando datos de ventas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [dateRange]);

  // Cargar estadísticas avanzadas solo cuando se selecciona la pestaña correspondiente
  const loadAdvancedStats = async () => {
    if (isAdvancedStatsLoaded || !dateRange.from || !dateRange.to) return;

    setIsLoading(true);
    try {
      // Cargar datos de análisis por hora
      const hourlyAnalysis = await SalesReportsApi.fetchReport(
        "getHourlyAnalysis",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setHourlyData(hourlyAnalysis);

      // Cargar datos de análisis por día de la semana
      const weekdayAnalysis = await SalesReportsApi.fetchReport(
        "getWeekdayAnalysis",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setWeekdayData(weekdayAnalysis);

      // Cargar datos de análisis comparativo
      const comparativeAnalysis = await SalesReportsApi.fetchReport(
        "getComparativeAnalysis",
        {
          endDate: dateRange.to,
        }
      );
      setComparativeData(comparativeAnalysis);

      // Cargar datos de análisis de tickets
      const ticketAnalysis = await SalesReportsApi.fetchReport(
        "getTicketAnalysis",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
      );
      setTicketData(ticketAnalysis);

      // Cargar datos de productos asociados
      const associatedProducts = await SalesReportsApi.fetchReport(
        "getAssociatedProducts",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
          limit: 10,
        }
      );
      setAssociatedProductsData(associatedProducts);

      // Cargar datos de margen de ganancia
      const profitMargin = await SalesReportsApi.fetchReport(
        "getProfitMarginAnalysis",
        {
          startDate: dateRange.from,
          endDate: dateRange.to,
          limit: 20,
        }
      );
      setProfitMarginData(profitMargin);

      // Marcar las estadísticas avanzadas como cargadas
      setIsAdvancedStatsLoaded(true);
    } catch (error) {
      console.error("Error cargando estadísticas avanzadas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular métricas para tarjetas
  const getMetricCards = (): MetricCardProps[] => {
    const totalVentas = salesData.length;
    const totalIngresos = salesData.reduce((sum, item) => sum + item.total, 0);
    const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;
    const totalProductos = salesData.reduce(
      (sum, item) => sum + item.cantidad,
      0
    );

    return [
      {
        title: "Total Ventas",
        value: totalVentas.toString(),
        icon: LineChart,
      },
      {
        title: "Total Ingresos",
        value: `€${totalIngresos.toFixed(2)}`,
        icon: BarChart2,
      },
      {
        title: "Promedio por Venta",
        value: `€${promedioVenta.toFixed(2)}`,
        icon: ListFilter,
      },
      {
        title: "Total Productos",
        value: totalProductos.toString(),
        icon: PieChart,
      },
    ];
  };

  // Definir pestañas para el reporte
  const reportTabs: ReportTabItem[] = [
    {
      value: "sales-table",
      label: "Tabla",
      icon: ListFilter,
      content: (
        <>
          {isLoading ? (
            <ReportLoadingSkeleton withTable={true} withCards={0} />
          ) : (
            <SalesDataTable
              data={salesData}
              exportFilename={getExportFilename("ventas-detalle")}
            />
          )}
        </>
      ),
    },
    {
      value: "sales-trend",
      label: "Tendencia",
      icon: LineChart,
      content: (
        <>
          {isLoading ? (
            <ReportLoadingSkeleton withChart={true} withTable={false} />
          ) : (
            <SalesLineChart
              data={lineChartData}
              title="Tendencia de Ventas"
              subtitle={`Del ${
                dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : ""
              } al ${dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : ""}`}
            />
          )}
        </>
      ),
    },
    {
      value: "sales-categories",
      label: "Categorías",
      icon: PieChart,
      content: (
        <>
          {isLoading ? (
            <ReportLoadingSkeleton withChart={true} withTable={false} />
          ) : (
            <SalesPieChart
              data={pieChartData}
              title="Ventas por Categoría"
              subtitle={`Del ${
                dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : ""
              } al ${dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : ""}`}
            />
          )}
        </>
      ),
    },
    {
      value: "sales-monthly",
      label: "Mensual",
      icon: BarChart2,
      content: (
        <>
          {isLoading ? (
            <ReportLoadingSkeleton withChart={true} withTable={false} />
          ) : (
            <SalesBarChart
              data={barChartData}
              title="Ventas por Mes"
              subtitle={`Año ${new Date().getFullYear()}`}
            />
          )}
        </>
      ),
    },
    {
      value: "sales-advanced",
      label: "Análisis Temporal",
      icon: Clock,
      content: (
        <>
          {isLoading ? (
            <div className="space-y-6">
              <ReportLoadingSkeleton withChart={true} withTable={false} />
              <ReportLoadingSkeleton withChart={true} withTable={false} />
            </div>
          ) : (
            <div className="space-y-6">
              <TimeAnalysisCharts
                hourlyData={hourlyData}
                weekdayData={weekdayData}
              />
              <ComparativeAnalysisTable data={comparativeData} />
              <TicketAnalysisChart data={ticketData} />
              <div className="grid md:grid-cols-2 gap-6">
                <AssociatedProductsTable data={associatedProductsData} />
                <ProfitMarginTable data={profitMarginData} />
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Ventas</h1>
          <p className="text-muted-foreground">
            Visualiza y analiza el rendimiento de ventas
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

      {/* Métricas globales */}
      {isLoading ? (
        <ReportLoadingSkeleton withCards={4} withTable={false} />
      ) : (
        <ReportMetricCards metrics={getMetricCards()} />
      )}

      <ReportTabs
        tabs={reportTabs}
        defaultTab="sales-table"
        onTabChange={(value) => {
          if (value === "sales-advanced" && !isAdvancedStatsLoaded) {
            loadAdvancedStats();
          }
        }}
      />
    </div>
  );
}
