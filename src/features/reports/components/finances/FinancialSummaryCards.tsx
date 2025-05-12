"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialSummaryData } from "@/features/reports/types/finances";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CURRENCY } from "../../config/constants";

interface FinancialSummaryCardsProps {
  data: FinancialSummaryData;
}

export const FinancialSummaryCards = ({ data }: FinancialSummaryCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(CURRENCY.code === "USD" ? "en-US" : "es-ES", {
      style: "currency",
      currency: CURRENCY.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Ingresos vs Costos */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white dark:bg-slate-800/70 border-0 overflow-hidden shadow-md hover:shadow-lg rounded-xl">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100/40 to-blue-100/0 dark:from-green-900/20 dark:to-transparent rounded-bl-full" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Ingresos vs Costos
                </p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:from-green-400 dark:to-blue-400">
                  {formatCurrency(data.totalIngresos)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-400 rounded-full"></span>
                  Costos: {formatCurrency(data.totalCostos)}
                </p>
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-full shadow-inner",
                  data.gananciaBruta > 0
                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900/60 dark:to-green-800/60 dark:text-green-300"
                    : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/60 dark:to-red-800/60 dark:text-red-300"
                )}
              >
                {data.gananciaBruta > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ganancia Bruta</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-0.5 rounded-md",
                      data.gananciaBruta > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {formatCurrency(data.gananciaBruta)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Márgenes */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800/70 border-0 overflow-hidden shadow-md hover:shadow-lg rounded-xl">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/40 to-blue-100/0 dark:from-blue-900/20 dark:to-transparent rounded-bl-full" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Márgenes
                </p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  {formatPercent(data.margenBruto)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                  Margen Bruto
                </p>
              </div>
              <div className="p-2.5 rounded-full shadow-inner bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/60 dark:to-blue-800/60 dark:text-blue-300">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Margen Neto</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-0.5 rounded-md",
                      data.margenNeto > 0
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {formatPercent(data.margenNeto)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ganancia Neta */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-white dark:bg-slate-800/70 border-0 overflow-hidden shadow-md hover:shadow-lg rounded-xl">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/40 to-purple-100/0 dark:from-purple-900/20 dark:to-transparent rounded-bl-full" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Ganancia Neta
                </p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  {formatCurrency(data.gananciaNeta)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                  Gastos: {formatCurrency(data.totalGastos)}
                </p>
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-full shadow-inner",
                  data.gananciaNeta > 0
                    ? "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/60 dark:to-purple-800/60 dark:text-purple-300"
                    : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/60 dark:to-red-800/60 dark:text-red-300"
                )}
              >
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ratio de Liquidez</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-0.5 rounded-md",
                      data.liquidez >= 1.5
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : data.liquidez >= 1
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {data.liquidez.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ROI */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-slate-800/70 border-0 overflow-hidden shadow-md hover:shadow-lg rounded-xl">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/40 to-amber-100/0 dark:from-amber-900/20 dark:to-transparent rounded-bl-full" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  ROI
                </p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                  {formatPercent(data.roi)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full"></span>
                  Retorno sobre inversión
                </p>
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-full shadow-inner",
                  data.roi > 0
                    ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/60 dark:to-amber-800/60 dark:text-amber-300"
                    : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/60 dark:to-red-800/60 dark:text-red-300"
                )}
              >
                {data.roi > 0 ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" />
                )}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Eficiencia</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-0.5 rounded-md",
                      data.margenNeto > 15
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : data.margenNeto > 5
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}
                  >
                    {data.margenNeto > 15
                      ? "Alta"
                      : data.margenNeto > 5
                      ? "Media"
                      : "Baja"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
