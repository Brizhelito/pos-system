"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  LineChart,
  BarChart2,
  Download,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

// Importación de componentes reutilizables
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";
import {
  ReportTabs,
  ReportTabItem,
} from "@/features/reports/components/ui/ReportTabs";
import { ReportLoadingSkeleton } from "@/features/reports/components/ui/ReportLoadingSkeleton";
import { ProfitMarginChart } from "@/features/reports/components/finances/ProfitMarginChart";
import { FinancialSummaryCards } from "@/features/reports/components/finances/FinancialSummaryCards";

// Importación de servicios y tipos
import { FinancesReportsApi } from "@/features/reports/utils/reportServices";
import {
  ProfitAnalysisData,
  FinancialSummaryData,
} from "@/features/reports/types/finances";

export default function FinancesReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("summary");

  // Estados para diferentes reportes
  const [profitData, setProfitData] = useState<ProfitAnalysisData[]>([]);
  const [summaryData, setSummaryData] = useState<FinancialSummaryData | null>(
    null
  );
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );

  // Cargar datos cuando cambia el rango de fechas
  useEffect(() => {
    async function loadData() {
      if (!dateRange.from || !dateRange.to) return;

      setIsLoading(true);
      try {
        // Cargar datos financieros
        const profitAnalysisData = await FinancesReportsApi.fetchReport(
          "getProfitAnalysis",
          {
            startDate: dateRange.from,
            endDate: dateRange.to,
            period: period,
          }
        );
        setProfitData(profitAnalysisData);

        // Cargar resumen financiero
        const financialSummary = await FinancesReportsApi.fetchReport(
          "getFinancialSummary",
          {
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        );
        setSummaryData(financialSummary);
      } catch (error) {
        console.error("Error cargando datos financieros:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [dateRange, period]);

  // Definir pestañas para el reporte
  const reportTabs: ReportTabItem[] = [
    {
      value: "summary",
      label: "Resumen",
      icon: BarChart2,
      content: (
        <>
          {isLoading || !summaryData ? (
            <ReportLoadingSkeleton withCards={4} withChart={false} />
          ) : (
            <>
              <FinancialSummaryCards data={summaryData} />
              <div className="mt-8">
                <ProfitMarginChart
                  data={profitData}
                  title="Análisis de Rentabilidad"
                  subtitle={`Del ${
                    dateRange.from
                      ? format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      : ""
                  } al ${
                    dateRange.to
                      ? format(dateRange.to, "dd/MM/yyyy", { locale: es })
                      : ""
                  }`}
                />
              </div>
            </>
          )}
        </>
      ),
    },
    {
      value: "profit-analysis",
      label: "Rentabilidad",
      icon: LineChart,
      content: (
        <>
          {isLoading ? (
            <ReportLoadingSkeleton withChart={true} withTable={false} />
          ) : (
            <div className="space-y-4">
              <motion.div
                className="flex justify-between items-center mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <InfoIcon className="h-4 w-4" />
                  <span>
                    Selecciona la vista temporal para analizar la evolución de
                    la rentabilidad
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={period === "daily" ? "default" : "outline"}
                    onClick={() => setPeriod("daily")}
                    className="rounded-full h-8"
                  >
                    Diario
                  </Button>
                  <Button
                    size="sm"
                    variant={period === "weekly" ? "default" : "outline"}
                    onClick={() => setPeriod("weekly")}
                    className="rounded-full h-8"
                  >
                    Semanal
                  </Button>
                  <Button
                    size="sm"
                    variant={period === "monthly" ? "default" : "outline"}
                    onClick={() => setPeriod("monthly")}
                    className="rounded-full h-8"
                  >
                    Mensual
                  </Button>
                </div>
              </motion.div>
              <ProfitMarginChart
                data={profitData}
                title="Evolución de Rentabilidad"
                subtitle={`Análisis por ${
                  period === "daily"
                    ? "Día"
                    : period === "weekly"
                    ? "Semana"
                    : "Mes"
                } del ${
                  dateRange.from
                    ? format(dateRange.from, "dd/MM/yyyy", { locale: es })
                    : ""
                } al ${
                  dateRange.to
                    ? format(dateRange.to, "dd/MM/yyyy", { locale: es })
                    : ""
                }`}
              />
            </div>
          )}
        </>
      ),
    },
    // Aquí se pueden agregar más pestañas para otros tipos de reportes financieros
  ];

  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Encabezado con título y botón de volver */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Reportes Financieros
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Análisis Detallado de Ingresos, Márgenes y Rentabilidad
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-200 dark:border-slate-700"
          >
            <Download size={16} />
            Exportar
          </Button>
          <Link href="/admin/reports">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft size={16} />
              Volver a Reportes
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Filtro de fechas */}
      <motion.div
        className="bg-white dark:bg-slate-800/70 rounded-xl shadow-sm p-5 mb-6 border border-slate-100 dark:border-slate-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AdvancedDateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="Seleccionar Período"
          showIcon={true}
        />
      </motion.div>

      {/* Contenido principal del reporte */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ReportTabs
          tabs={reportTabs}
          defaultTab={currentTab}
          onTabChange={handleTabChange}
        />
      </motion.div>
    </div>
  );
}
