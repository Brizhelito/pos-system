"use client";

import React, { useState, useEffect } from "react";
import {
  CircleDollarSign,
  TrendingUp,
  Package,
  Users,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importación de componentes del proyecto
import { SalesLineChart } from "@/features/reports/components/SalesLineChart";
import { SalesPieChart } from "@/features/reports/components/SalesPieChart";
// Importar los nuevos componentes mejorados
import { ProfitMarginAreaChart } from "@/features/reports/components/finances/ProfitMarginAreaChart";
import { PaymentMethodsPieChart } from "@/features/reports/components/PaymentMethodsPieChart";
import { motion } from "framer-motion";
import { ProfitAnalysisData } from "@/features/reports/types/finances";
import { CURRENCY } from "@/features/reports/config/constants";

// Interfaces para los tipos de datos
interface SalesDataItem {
  fecha: string;
  ventas: number;
}

interface ProductItem {
  name: string;
  ventas: number;
  ingresos: number;
}

interface CustomerItem {
  name: string;
  value: number;
}

interface InventoryStatus {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  highestTurnover: string;
  totalValue: number;
}

interface FinancialMetrics {
  summaryData: {
    ingresos: number;
    costos: number;
    gastos: number;
    gananciaNeta: number;
    margenBruto: number;
    margenNeto: number;
    crecimiento: number;
  };
  trendData: ProfitAnalysisData[];
}

interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  growth: number;
}

const AdminDashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [topProducts, setTopProducts] = useState<ProductItem[]>([]);
  const [topCustomers, setTopCustomers] = useState<CustomerItem[]>([]);
  const [financialMetrics, setFinancialMetrics] =
    useState<FinancialMetrics | null>(null);
  const [inventoryStatus, setInventoryStatus] =
    useState<InventoryStatus | null>(null);
  const [salesDistribution, setSalesDistribution] = useState<
    { name: string; value: number }[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { name: string; ventas: number; ingresos: number }[]
  >([]);
  const [recentActivity, setRecentActivity] = useState<
    {
      tipo: string;
      tiempo: number;
      monto: number;
      id: number;
      nombre?: string;
    }[]
  >([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(
    null
  );
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Verificar individualmente cada endpoint para identificar cuál falla
        try {
          const salesRes = await fetch(
            `/api/admin/dashboard/sales-summary?period=${timeframe}`
          );
          if (!salesRes.ok)
            throw new Error(`Error en sales-summary: ${salesRes.status}`);
          const salesData = await salesRes.json();
          setSalesData(salesData.data || []);
        } catch (error) {
          console.error("Error al cargar datos de ventas:", error);
        }

        try {
          const productsRes = await fetch(
            `/api/admin/dashboard/top-products?limit=5&period=${timeframe}`
          );
          if (!productsRes.ok)
            throw new Error(`Error en top-products: ${productsRes.status}`);
          const productsData = await productsRes.json();
          setTopProducts(productsData.data || []);
        } catch (error) {
          console.error("Error al cargar top productos:", error);
        }

        try {
          const customersRes = await fetch(
            `/api/admin/dashboard/top-customers?limit=5&period=${timeframe}`
          );
          if (!customersRes.ok)
            throw new Error(`Error en top-customers: ${customersRes.status}`);
          const customersData = await customersRes.json();
          setTopCustomers(customersData.data || []);
        } catch (error) {
          console.error("Error al cargar top clientes:", error);
        }

        try {
          const inventoryRes = await fetch(
            `/api/admin/dashboard/inventory-status`
          );
          if (!inventoryRes.ok)
            throw new Error(
              `Error en inventory-status: ${inventoryRes.status}`
            );
          const inventoryData = await inventoryRes.json();
          setInventoryStatus(inventoryData || null);
        } catch (error) {
          console.error("Error al cargar datos de inventario:", error);
        }

        try {
          const financialsRes = await fetch(
            `/api/admin/dashboard/profit-analysis?period=${timeframe}`
          );
          if (!financialsRes.ok)
            throw new Error(
              `Error en profit-analysis: ${financialsRes.status}`
            );
          const financialsData = await financialsRes.json();
          setFinancialMetrics(financialsData || null);
        } catch (error) {
          console.error("Error al cargar datos financieros:", error);
        }

        // Nuevos endpoints
        try {
          const distributionRes = await fetch(
            `/api/admin/dashboard/sales-distribution?period=${timeframe}`
          );
          if (!distributionRes.ok)
            throw new Error(
              `Error en sales-distribution: ${distributionRes.status}`
            );
          const distributionData = await distributionRes.json();
          setSalesDistribution(distributionData.data || []);
        } catch (error) {
          console.error("Error al cargar distribución de ventas:", error);
        }

        try {
          const paymentMethodsRes = await fetch(
            `/api/admin/dashboard/payment-methods?period=${timeframe}`
          );
          if (!paymentMethodsRes.ok)
            throw new Error(
              `Error en payment-methods: ${paymentMethodsRes.status}`
            );
          const paymentMethodsData = await paymentMethodsRes.json();
          setPaymentMethods(paymentMethodsData.data || []);
        } catch (error) {
          console.error("Error al cargar métodos de pago:", error);
        }

        try {
          const activityRes = await fetch(
            `/api/admin/dashboard/recent-activity`
          );
          if (!activityRes.ok)
            throw new Error(`Error en recent-activity: ${activityRes.status}`);
          const activityData = await activityRes.json();
          setRecentActivity(activityData.data || []);
        } catch (error) {
          console.error("Error al cargar actividad reciente:", error);
        }

        try {
          const customerStatsRes = await fetch(
            `/api/admin/dashboard/customer-stats?period=${timeframe}`
          );
          if (!customerStatsRes.ok)
            throw new Error(
              `Error en customer-stats: ${customerStatsRes.status}`
            );
          const customerStatsData = await customerStatsRes.json();
          setCustomerStats(customerStatsData || null);
        } catch (error) {
          console.error("Error al cargar estadísticas de clientes:", error);
        }
      } catch (error) {
        console.error("Error general en la carga de datos:", error);
        // Si hay un error general, cargar todos los datos de ejemplo
        setMockData();
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  // Datos de ejemplo para demostración
  const setMockData = () => {
    setSalesData([
      { fecha: "Lunes", ventas: 1200 },
      { fecha: "Martes", ventas: 1900 },
      { fecha: "Miércoles", ventas: 1500 },
      { fecha: "Jueves", ventas: 1800 },
      { fecha: "Viernes", ventas: 2200 },
      { fecha: "Sábado", ventas: 2500 },
      { fecha: "Domingo", ventas: 1700 },
    ]);

    setTopProducts([
      { name: "Laptop Pro", ventas: 42, ingresos: 52500 },
      { name: "Smartphone X", ventas: 38, ingresos: 19000 },
      { name: "Audífonos Wireless", ventas: 35, ingresos: 5250 },
      { name: 'Tablet 10"', ventas: 30, ingresos: 15000 },
      { name: "Smartwatch", ventas: 28, ingresos: 7000 },
    ]);

    setTopCustomers([
      { name: "María García", value: 42 },
      { name: "Juan Pérez", value: 28 },
      { name: "Ana Rodríguez", value: 23 },
      { name: "Carlos López", value: 19 },
      { name: "Laura Martínez", value: 17 },
    ]);

    setInventoryStatus({
      totalProducts: 1250,
      lowStockItems: 52,
      outOfStockItems: 8,
      highestTurnover: "Smartphone X",
      totalValue: 245000,
    });

    setFinancialMetrics({
      summaryData: {
        ingresos: 125000,
        costos: 72000,
        gastos: 15000,
        gananciaNeta: 38000,
        margenBruto: 42.4,
        margenNeto: 30.4,
        crecimiento: 8.5,
      },
      trendData: [
        {
          periodo: "2023-01",
          ingresos: 95000,
          costos: 62000,
          gastos: 12000,
          gananciaNeta: 21000,
          margenBruto: 34.7,
          margenNeto: 22.1,
          gananciaBruta: 33000,
        },
        {
          periodo: "2023-02",
          ingresos: 105000,
          costos: 65000,
          gastos: 13000,
          gananciaNeta: 27000,
          margenBruto: 38.1,
          margenNeto: 25.7,
          gananciaBruta: 40000,
        },
        {
          periodo: "2023-03",
          ingresos: 115000,
          costos: 68000,
          gastos: 14000,
          gananciaNeta: 33000,
          margenBruto: 40.9,
          margenNeto: 28.7,
          gananciaBruta: 47000,
        },
        {
          periodo: "2023-04",
          ingresos: 125000,
          costos: 72000,
          gastos: 15000,
          gananciaNeta: 38000,
          margenBruto: 42.4,
          margenNeto: 30.4,
          gananciaBruta: 53000,
        },
      ],
    });

    // Nuevos datos de ejemplo
    setSalesDistribution([
      { name: "Electrónicos", value: 35 },
      { name: "Ropa", value: 25 },
      { name: "Hogar", value: 20 },
      { name: "Deportes", value: 15 },
      { name: "Otros", value: 5 },
    ]);

    setPaymentMethods([
      { name: "Tarjeta", ventas: 65, ingresos: 78500 },
      { name: "Efectivo", ventas: 20, ingresos: 24000 },
      { name: "Transferencia", ventas: 10, ingresos: 12000 },
      { name: "Otros", ventas: 5, ingresos: 6000 },
    ]);

    setRecentActivity([
      { tipo: "venta", tiempo: 5, monto: 834.25, id: 1001 },
      {
        tipo: "cliente",
        tiempo: 12,
        monto: 0,
        id: 0,
        nombre: "Carmen Rodríguez",
      },
      { tipo: "venta", tiempo: 18, monto: 429.5, id: 1002 },
      {
        tipo: "cliente",
        tiempo: 27,
        monto: 0,
        id: 0,
        nombre: "Roberto Sánchez",
      },
      { tipo: "venta", tiempo: 35, monto: 1245.75, id: 1003 },
    ]);

    setCustomerStats({
      totalCustomers: 842,
      newCustomers: 38,
      activeCustomers: 126,
      growth: 12.5,
    });
  };

  // Manejador de cambio de período
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  // Animación para las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Principal</h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de administración. Visión general del negocio.
          </p>
        </div>

        <Tabs
          value={timeframe}
          onValueChange={handleTimeframeChange}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
            <TabsTrigger value="year">Año</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tarjeta de Ventas Totales */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Ventas Totales
                  </p>
                  <h2 className="text-3xl font-bold">
                    {CURRENCY.symbol}
                    {financialMetrics?.summaryData?.ingresos.toLocaleString() ||
                      "0"}
                  </h2>
                  <p className="flex items-center text-sm text-emerald-600 mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {financialMetrics?.summaryData?.crecimiento}% vs. período
                    anterior
                  </p>
                </div>
                <CircleDollarSign className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta de Ganancia Neta */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Ganancia Neta
                  </p>
                  <h2 className="text-3xl font-bold">
                    {CURRENCY.symbol}
                    {financialMetrics?.summaryData?.gananciaNeta.toLocaleString() ||
                      "0"}
                  </h2>
                  <p className="flex items-center text-sm text-emerald-600 mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Margen: {financialMetrics?.summaryData?.margenNeto}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-emerald-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta de Inventario */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Productos en Inventario
                  </p>
                  <h2 className="text-3xl font-bold">
                    {inventoryStatus?.totalProducts || "0"}
                  </h2>
                  <p className="flex items-center text-sm text-amber-600 mt-1">
                    {inventoryStatus?.lowStockItems || "0"} productos con stock
                    bajo
                  </p>
                </div>
                <Package className="h-10 w-10 text-amber-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta de Clientes */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Clientes Activos
                  </p>
                  <h2 className="text-3xl font-bold">
                    {customerStats?.activeCustomers || "0"}
                  </h2>
                  <p className="flex items-center text-sm text-emerald-600 mt-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />+
                    {customerStats?.growth || 0}% este{" "}
                    {timeframe === "week"
                      ? "semana"
                      : timeframe === "month"
                      ? "mes"
                      : "año"}
                  </p>
                </div>
                <Users className="h-10 w-10 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Grid principal con estilo Bento */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
        {/* Gráfico de ventas recientes - Span grande */}
        <div className="col-span-full lg:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
              <CardDescription>
                Vista detallada de las ventas del periodo actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {salesData.length === 0 ? (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  No hay datos disponibles
                </div>
              ) : (
                <SalesLineChart
                  data={salesData}
                  title=""
                  subtitle=""
                  showSummary={true}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Productos más vendidos - Columna derecha */}
        <div className="col-span-full lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Productos</CardTitle>
              <CardDescription>Productos más vendidos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {topProducts.map((product, i) => (
                  <li key={i} className="flex items-start justify-between">
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.ventas} ventas
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {CURRENCY.symbol}
                      {product.ingresos.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Análisis de Rentabilidad - Span grande en 2da fila */}
        <div className="col-span-full lg:col-span-6 md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Análisis de Rentabilidad</CardTitle>
              <CardDescription>
                Comparativa de ingresos, costos y márgenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {financialMetrics && (
                <ProfitMarginAreaChart
                  data={financialMetrics.trendData}
                  title=""
                  subtitle=""
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Distribución de Ventas - Span aumentado en 2da fila */}
        <div className="col-span-full lg:col-span-6 md:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Distribución de Ventas</CardTitle>
              <CardDescription>Por categoría de producto</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesPieChart
                data={salesDistribution}
                title=""
                subtitle=""
                showLegend={true}
                showPercentage={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Clientes - Movido a la 3ra fila */}
        <div className="col-span-full lg:col-span-4 md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Clientes</CardTitle>
              <CardDescription>
                Clientes con mayor número de compras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {topCustomers.map((customer, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                        {i + 1}
                      </span>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.value} compras
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Métodos de Pago - Ajustado en 3ra fila */}
        <div className="col-span-full lg:col-span-4 md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>
                Distribución de ventas por método de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsPieChart
                data={paymentMethods}
                title=""
                subtitle=""
                valueType="ingresos"
              />
            </CardContent>
          </Card>
        </div>

        {/* Actividad Reciente - Redimensionado en 3ra fila */}
        <div className="col-span-full lg:col-span-4 md:col-span-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas transacciones registradas
                </CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((actividad, i) => (
                  <div
                    key={`actividad-${i}`}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${
                          actividad.tipo === "venta"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium">
                          {actividad.tipo === "venta"
                            ? "Venta completada"
                            : `Nuevo cliente: ${actividad.nombre || ""}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Hace {actividad.tiempo} minutos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {actividad.tipo === "venta" && (
                        <p className="font-medium">
                          {CURRENCY.symbol}
                          {actividad.monto.toFixed(2)}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {actividad.tipo === "venta"
                          ? `ID: #${actividad.id}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
