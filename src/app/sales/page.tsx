"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SalesFlow } from "@/components/features/sales/SalesFlow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BarChart, Users, Package } from "lucide-react";

export default function SalesPage() {
  const [showSalesFlow, setShowSalesFlow] = useState(false);
  
  // Hardcoded userId for demo purposes - in a real app, this would come from authentication
  const userId = 1;
  
  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gestión de Ventas</h1>
      
      {showSalesFlow ? (
        <SalesFlow 
          userId={userId} 
          onComplete={() => setShowSalesFlow(false)}
          onCancel={() => setShowSalesFlow(false)}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Nueva Venta
                  </CardTitle>
                  <CardDescription>
                    Crear una nueva venta para un cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Inicie un nuevo proceso de venta seleccionando un cliente, agregando productos y eligiendo un método de pago.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => setShowSalesFlow(true)}
                  >
                    Iniciar Venta
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Historial de Ventas
                  </CardTitle>
                  <CardDescription>
                    Ver todas las ventas realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Acceda al historial completo de ventas, filtre por fecha, cliente o estado, y genere reportes.
                  </p>
                  <Button variant="outline" className="w-full">
                    Ver Historial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Clientes
                  </CardTitle>
                  <CardDescription>
                    Gestionar información de clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Administre la información de sus clientes, vea su historial de compras y gestione sus datos.
                  </p>
                  <Button variant="outline" className="w-full">
                    Gestionar Clientes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Productos Populares
                </CardTitle>
                <CardDescription>
                  Los productos más vendidos en el último mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="font-medium">Producto #{i}</div>
                        <div className="text-sm text-gray-500">Vendidos: {Math.floor(Math.random() * 100) + 20}</div>
                        <div className="text-sm font-medium text-primary mt-1">${(Math.random() * 1000 + 100).toFixed(2)}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
