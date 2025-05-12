"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Users, Activity, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { CustomerReportsApi } from "@/features/reports/utils/reportServices";
import {
  RFMAnalysis,
  CustomerLifecycle,
  RetentionData,
  SeasonalPattern,
} from "@/features/reports/services/customers/rfmService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RFM_REPORT_CONFIG,
  LIFECYCLE_REPORT_CONFIG,
  RETENTION_REPORT_CONFIG,
  SEASONAL_REPORT_CONFIG,
} from "@/features/reports/reportConfig";
import { ReportDataTable } from "@/features/reports/components/data-table/ReportDataTable";
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";
import { CURRENCY } from "@/features/reports/config/constants";

// Componente de resumen para análisis RFM
const RFMSummary = ({
  data,
  isLoading,
}: {
  data: RFMAnalysis[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-1.5 w-full" />
          </div>
        ))}
      </div>
    );
  }
  // Calcular estadísticas de segmentos
  const segmentStats = () => {
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
  };

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

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">
        Distribución de clientes por segmento
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {segmentStats().map(([segment, count]) => (
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
};

// Otros componentes de resumen...
const LifecycleSummary = ({
  data,
  isLoading,
}: {
  data: CustomerLifecycle[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  const estadoStats = () => {
    const stats: Record<string, number> = {};
    data.forEach((item) => {
      stats[item.estado] = (stats[item.estado] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  // Calcular promedio de dias como cliente
  const promedioDiasComoCliente =
    data.reduce((acc, item) => acc + item.diasComoCliente, 0) /
    (data.length || 1);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-2">Estado de clientes</h3>
          <div className="space-y-2">
            {estadoStats().map(([estado, count]) => (
              <div key={estado} className="flex justify-between items-center">
                <Badge variant={estado === "Activo" ? "default" : "outline"}>
                  {estado}
                </Badge>
                <span className="text-sm">
                  {count} ({((count / data.length) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Estadísticas generales</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Promedio días como cliente:
                </span>
                <span className="font-medium">
                  {Math.round(promedioDiasComoCliente)} días
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total clientes analizados:
                </span>
                <span className="font-medium">{data.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componentes RetentionSummary y SeasonalSummary omitidos para brevedad

export default function AdminCustomerReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rfm");

  // Estados para los datos
  const [rfmData, setRfmData] = useState<RFMAnalysis[]>([]);
  const [lifecycleData, setLifecycleData] = useState<CustomerLifecycle[]>([]);
  const [retentionData, setRetentionData] = useState<RetentionData[]>([]);
  const [seasonalData, setSeasonalData] = useState<SeasonalPattern[]>([]);

  // Columnas para RFM (omitidas para brevedad)
  const rfmColumns: ColumnDef<RFMAnalysis>[] = [
    // ... columnas para RFM
  ];

  // Columnas para lifecycle (omitidas para brevedad)
  const lifecycleColumns: ColumnDef<CustomerLifecycle>[] = [
    // ... columnas para lifecycle
  ];

  // Columnas para retención
  const retentionColumns: ColumnDef<RetentionData>[] = [
    {
      accessorKey: "periodo",
      header: "Período",
    },
    {
      accessorKey: "tasaRetencion",
      header: "Tasa de Retención",
      cell: ({ row }) => (
        <div className="font-medium">
          {(row.getValue("tasaRetencion") as number).toFixed(2)}%
        </div>
      ),
    },
    {
      accessorKey: "clientesActivos",
      header: "Clientes Activos",
    },
    {
      accessorKey: "clientesRetenidos",
      header: "Clientes Retenidos",
    },
  ];

  // Columnas para patrones estacionales
  const seasonalColumns: ColumnDef<SeasonalPattern>[] = [
    {
      accessorKey: "periodo",
      header: "Período",
    },
    {
      accessorKey: "numeroCompras",
      header: "Número de Compras",
    },
    {
      accessorKey: "valorTotal",
      header: "Valor Total",
      cell: ({ row }) => (
        <div className="font-medium">
          {CURRENCY.symbol}
          {(row.getValue("valorTotal") as number).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "clientesUnicos",
      header: "Clientes Únicos",
    },
  ];

  // Otras definiciones de columnas omitidas para brevedad

  // Función para manejar el cambio de fechas
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    // Resetear los datos cuando cambia el rango de fechas
    setIsLoading(true);
  };

  // Cargar datos según el tab activo
  useEffect(() => {
    async function loadData() {
      if (!dateRange.from || !dateRange.to) return;

      setIsLoading(true);
      try {
        // Obtener análisis según la pestaña activa
        if (activeTab === "rfm" || activeTab === "all") {
          const rfmAnalysis = await CustomerReportsApi.fetchReport(
            "getRFMAnalysis",
            {
              startDate: dateRange.from,
              endDate: dateRange.to,
            }
          );
          setRfmData(rfmAnalysis);
        }

        if (activeTab === "lifecycle" || activeTab === "all") {
          const lifecycle = await CustomerReportsApi.fetchReport(
            "getCustomerLifecycle",
            {
              startDate: dateRange.from,
              endDate: dateRange.to,
            }
          );
          setLifecycleData(lifecycle);
        }

        if (activeTab === "retention" || activeTab === "all") {
          const retention = await CustomerReportsApi.fetchReport(
            "getRetentionRate",
            {
              startDate: dateRange.from,
              endDate: dateRange.to,
            }
          );
          setRetentionData(retention);
        }

        if (activeTab === "seasonal" || activeTab === "all") {
          const seasonal = await CustomerReportsApi.fetchReport(
            "getSeasonalPatterns",
            {
              startDate: dateRange.from,
              endDate: dateRange.to,
            }
          );
          setSeasonalData(seasonal);
        }
      } catch (error) {
        console.error("Error cargando datos de clientes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [dateRange, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Clientes</h1>
          <p className="text-muted-foreground">
            Visualiza y analiza el comportamiento de clientes
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
        defaultValue="rfm"
        className="space-y-4"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="rfm" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Segmentación RFM</span>
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Ciclo de Vida</span>
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Retención</span>
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Patrones Estacionales</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rfm" className="space-y-4">
          <ReportDataTable
            columns={rfmColumns}
            data={rfmData}
            title={RFM_REPORT_CONFIG.title}
            subtitle={RFM_REPORT_CONFIG.subtitle}
            icon={<Users className="h-5 w-5" />}
            searchColumn="nombre"
            searchPlaceholder="Buscar cliente..."
            filterColumn="segmento"
            filterOptions={RFM_REPORT_CONFIG.filterOptions}
            isLoading={isLoading}
            exportFilename={RFM_REPORT_CONFIG.exportFilename}
            exportOptions={RFM_REPORT_CONFIG.exportOptions}
            summary={<RFMSummary data={rfmData} isLoading={isLoading} />}
          />
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-4">
          <ReportDataTable
            columns={lifecycleColumns}
            data={lifecycleData}
            title={LIFECYCLE_REPORT_CONFIG.title}
            subtitle={LIFECYCLE_REPORT_CONFIG.subtitle}
            icon={<Activity className="h-5 w-5" />}
            searchColumn="nombre"
            searchPlaceholder="Buscar cliente..."
            filterColumn="estado"
            filterOptions={LIFECYCLE_REPORT_CONFIG.filterOptions}
            isLoading={isLoading}
            exportFilename={LIFECYCLE_REPORT_CONFIG.exportFilename}
            exportOptions={LIFECYCLE_REPORT_CONFIG.exportOptions}
            summary={
              <LifecycleSummary data={lifecycleData} isLoading={isLoading} />
            }
          />
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <ReportDataTable
            columns={retentionColumns}
            data={retentionData}
            title={RETENTION_REPORT_CONFIG.title}
            subtitle={RETENTION_REPORT_CONFIG.subtitle}
            icon={<User className="h-5 w-5" />}
            isLoading={isLoading}
            exportFilename={RETENTION_REPORT_CONFIG.exportFilename}
            exportOptions={RETENTION_REPORT_CONFIG.exportOptions}
          />
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <ReportDataTable
            columns={seasonalColumns}
            data={seasonalData}
            title={SEASONAL_REPORT_CONFIG.title}
            subtitle={SEASONAL_REPORT_CONFIG.subtitle}
            icon={<Calendar className="h-5 w-5" />}
            isLoading={isLoading}
            exportFilename={SEASONAL_REPORT_CONFIG.exportFilename}
            exportOptions={SEASONAL_REPORT_CONFIG.exportOptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
