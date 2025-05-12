"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  BarChart,
  Package,
  Users,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminReportsPage() {
  const reportCategories = [
    {
      id: "sales",
      title: "Reportes de Ventas",
      description: "Análisis detallado de ventas, ingresos y tendencias",
      icon: <BarChart className="h-8 w-8" />,
      color: "bg-blue-500",
    },
    {
      id: "inventory",
      title: "Reportes de Inventario",
      description: "Estado del inventario, productos populares y rotación",
      icon: <Package className="h-8 w-8" />,
      color: "bg-green-500",
    },
    {
      id: "customers",
      title: "Reportes de Clientes",
      description: "Análisis de clientes frecuentes y patrones de compra",
      icon: <Users className="h-8 w-8" />,
      color: "bg-purple-500",
    },
    {
      id: "sellers",
      title: "Reportes de Vendedores",
      description:
        "Analiza el desempeño de tus vendedores, tendencias y productos más vendidos",
      icon: <Users className="h-8 w-8" />,
      color: "bg-yellow-500",
    },
    {
      id: "finances",
      title: "Reportes Financieros",
      description:
        "Análisis de rentabilidad, flujo de caja y estado financiero",
      icon: <DollarSign className="h-8 w-8" />,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Sistema de Reportes</h1>
        <Link href="/admin/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Volver al Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reportCategories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href={`/admin/reports/${category.id}`}>
              <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all">
                <CardHeader>
                  <div
                    className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4`}
                  >
                    {category.icon}
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Ver Reportes</Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>¿Qué ofrecen nuestros reportes?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                Visualizaciones gráficas interactivas para facilitar el análisis
              </li>
              <li>
                Exportación de datos a diferentes formatos (PDF, Excel, CSV)
              </li>
              <li>Filtros personalizables por fechas y otros parámetros</li>
              <li>Información actualizada en tiempo real</li>
              <li>Comparativas con periodos anteriores</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
