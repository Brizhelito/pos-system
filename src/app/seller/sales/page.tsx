"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SalesFlow } from "@/components/features/sales/SalesFlow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BarChart, Package } from "lucide-react";

// Datos estáticos para evitar errores de hidratación
const popularProducts = [
  { id: 1, name: "Producto #1", sales: 15, price: 199.99 },
  { id: 2, name: "Producto #2", sales: 12, price: 299.99 },
  { id: 3, name: "Producto #3", sales: 10, price: 149.99 },
];

export default function SellerSalesPage() {
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
      <h1 className="text-3xl font-bold mb-8">Punto de Venta</h1>
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Ventas Recientes
                  </CardTitle>
                  <CardDescription>
                    Ver las últimas ventas realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Acceda a sus ventas recientes, verifique el estado y genere recibos.
                  </p>
                  <Button variant="outline" className="w-full">
                    Ver Ventas Recientes
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
                  Los productos más vendidos hoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {popularProducts.map((product) => (
                    <Card key={product.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">Vendidos: {product.sales}</div>
                        <div className="text-sm font-medium text-primary mt-1">${product.price.toFixed(2)}</div>
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
