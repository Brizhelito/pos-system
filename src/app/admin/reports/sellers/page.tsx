"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Users,
  LineChart,
  Package,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  SellerSummary,
  SellerTrendItem,
  TopProductBySeller,
} from "@/features/reports/services/sellers/sellersService";
import { SellerReportsApi } from "@/features/reports/utils/reportServices";
import { SellerTrendChart } from "@/features/reports/components/SellerTrendChart";
import { TopSellerProductsTable } from "@/features/reports/components/TopSellerProductsTable";
import {
  SELLER_SUMMARY_CONFIG,
  SELLER_PRODUCTS_CONFIG,
} from "@/features/reports/reportConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";
import { ReportDataTable } from "@/features/reports/components/data-table/ReportDataTable";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CURRENCY } from "@/features/reports/config/constants";
import { Skeleton } from "@/components/ui/skeleton";

// Componente de resumen para el rendimiento de vendedores
const SellerSummaryStats = ({
  data,
  isLoading,
}: {
  data: SellerSummary[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  // Ordenar por ventas descendente
  const sortedSellers = [...data].sort((a, b) => b.totalVentas - a.totalVentas);
  const topSellers = sortedSellers.slice(0, 5);

  // Calcular estadísticas generales
  const totalVentas = data.reduce((sum, seller) => sum + seller.numVentas, 0);
  const totalMonto = data.reduce((sum, seller) => sum + seller.totalVentas, 0);
  const ticketPromedio = totalVentas > 0 ? totalMonto / totalVentas : 0;
  const maxTicket = Math.max(...data.map((s) => s.ticketPromedio));
  const minTicket = Math.min(...data.map((s) => s.ticketPromedio));

  // Determinar el mejor vendedor
  const bestSeller = sortedSellers[0];

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Total vendedores</p>
            </div>
            <p className="text-2xl font-bold">{data.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Total ventas</p>
            </div>
            <p className="text-2xl font-bold">{totalVentas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Ticket promedio</p>
            </div>
            <p className="text-2xl font-bold">
              {CURRENCY.format(ticketPromedio)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Rango de ticket</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">
                {CURRENCY.format(minTicket)}
              </p>
              <p className="text-sm font-semibold">
                {CURRENCY.format(maxTicket)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top vendedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-4">
              Top vendedores por monto
            </h3>
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div key={seller.userId} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Badge className="mr-2 h-6 w-6 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{seller.nombre}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {CURRENCY.format(seller.totalVentas)}
                    </span>
                  </div>
                  <Progress
                    value={(seller.totalVentas / bestSeller.totalVentas) * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-4">
              Top vendedores por cantidad
            </h3>
            <div className="space-y-3">
              {[...data]
                .sort((a, b) => b.numVentas - a.numVentas)
                .slice(0, 5)
                .map((seller, index) => (
                  <div key={seller.userId} className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Badge
                          className="mr-2 h-6 w-6 rounded-full flex items-center justify-center font-bold"
                          variant="outline"
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{seller.nombre}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {seller.numVentas} ventas
                      </span>
                    </div>
                    <Progress
                      value={
                        (seller.numVentas /
                          Math.max(...data.map((s) => s.numVentas))) *
                        100
                      }
                      className="h-1.5"
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function AdminSellerReportPage() {
  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  // Estados para los diferentes tipos de datos
  const [summaryData, setSummaryData] = useState<SellerSummary[]>([]);
  const [trendData, setTrendData] = useState<SellerTrendItem[]>([]);
  const [topProductsData, setTopProductsData] = useState<TopProductBySeller[]>(
    []
  );

  // Definición de columnas para la tabla de resumen
  const sellerSummaryColumns: ColumnDef<SellerSummary>[] = [
    { accessorKey: "nombre", header: "Vendedor" },
    { accessorKey: "numVentas", header: "Ventas" },
    {
      accessorKey: "totalVentas",
      header: `Total (${CURRENCY.symbol})`,
      cell: ({ row }) => (
        <div>{CURRENCY.format(row.getValue("totalVentas"))}</div>
      ),
    },
    {
      accessorKey: "ticketPromedio",
      header: `Ticket Promedio (${CURRENCY.symbol})`,
      cell: ({ row }) => (
        <div>{CURRENCY.format(row.getValue("ticketPromedio"))}</div>
      ),
    },
  ];

  // Función para manejar el cambio de fechas
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  // Cargar datos cuando cambia el rango de fechas o la pestaña activa
  useEffect(() => {
    async function loadData() {
      if (!dateRange.from || !dateRange.to) return;
      setIsLoading(true);

      try {
        // Cargar datos según la pestaña activa
        if (activeTab === "summary" || activeTab === "all") {
          const summary = await SellerReportsApi.fetchReport(
            "getSellerSummary",
            { startDate: dateRange.from, endDate: dateRange.to }
          );
          setSummaryData(summary);
        }

        if (activeTab === "trend" || activeTab === "all") {
          const trend = await SellerReportsApi.fetchReport("getSellerTrend", {
            startDate: dateRange.from,
            endDate: dateRange.to,
          });
          setTrendData(trend);
        }

        if (activeTab === "top-products" || activeTab === "all") {
          const products = await SellerReportsApi.fetchReport(
            "getTopProductsBySeller",
            { startDate: dateRange.from, endDate: dateRange.to, limit: 100 }
          );
          setTopProductsData(products);
        }
      } catch (error) {
        console.error("Error cargando datos de vendedores:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [dateRange, activeTab]);

  // Función para manejar cambio de tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Vendedores</h1>
          <p className="text-muted-foreground">
            Visualiza y analiza el rendimiento de vendedores
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

      <Tabs
        defaultValue="summary"
        className="space-y-4"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Resumen por Vendedor</span>
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Tendencia de Ventas</span>
          </TabsTrigger>
          <TabsTrigger value="top-products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Productos Top</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <ReportDataTable
            columns={sellerSummaryColumns}
            data={summaryData}
            title={SELLER_SUMMARY_CONFIG.title}
            subtitle={SELLER_SUMMARY_CONFIG.subtitle}
            icon={<Users className="h-5 w-5" />}
            searchColumn="nombre"
            searchPlaceholder="Buscar vendedor..."
            isLoading={isLoading}
            exportFilename={SELLER_SUMMARY_CONFIG.exportFilename}
            exportOptions={SELLER_SUMMARY_CONFIG.exportOptions}
            summary={
              <SellerSummaryStats data={summaryData} isLoading={isLoading} />
            }
          />
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <SellerTrendChart data={trendData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="top-products" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">
                {SELLER_PRODUCTS_CONFIG.title}
              </h2>
              <p className="text-muted-foreground">
                {SELLER_PRODUCTS_CONFIG.subtitle}
              </p>
            </div>
            <TopSellerProductsTable
              data={topProductsData}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
