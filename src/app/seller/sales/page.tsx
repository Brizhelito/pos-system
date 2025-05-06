"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart, BarChart, Package, CheckCircle, ArrowRight, ClipboardList, Repeat } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSalesContext } from "@/contexts/SalesContext";
import { SalesStep } from "@/types/SalesFlow";
import confetti from "canvas-confetti";

// Datos estáticos para el dashboard
const popularProducts = [
  { id: 1, name: "Producto #1", sales: 15, price: 199.99 },
  { id: 2, name: "Producto #2", sales: 12, price: 299.99 },
  { id: 3, name: "Producto #3", sales: 10, price: 149.99 },
];

export default function SellerSalesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCompleted = searchParams.get('completed') === 'true';
  
  const { 
    state,
    setCurrentStep,
    resetSale
  } = useSalesContext();
  
  // Cuando accedemos a esta página, establecemos el paso como DASHBOARD
  useEffect(() => {
    // Solo actualizar si no estamos ya en el DASHBOARD
    if (state.currentStep !== SalesStep.DASHBOARD) {
      setCurrentStep(SalesStep.DASHBOARD);
    }
  }, [state.currentStep, setCurrentStep]);
  
  // Efecto para mostrar confetti cuando se completa una venta
  useEffect(() => {
    if (isCompleted) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { y: 0.6 }
        });
      }, 200);
      
      return () => clearInterval(confettiInterval);
    }
  }, [isCompleted]);
  
  // Iniciar nuevo flujo de venta
  const startNewSale = () => {
    resetSale();
    router.push(`/seller/sales/customer?compact=true`);
  };
  
  // Continuar venta en progreso
  const continueSale = () => {
    // Determinar el paso al que debemos ir
    if (!state.selectedCustomer) {
      router.push(`/seller/sales/customer?compact=true`);
    } else if (state.selectedCustomer && state.cartItems.length === 0) {
      router.push(`/seller/sales/products?compact=true`);
    } else if (state.selectedCustomer && state.cartItems.length > 0 && !state.paymentMethod) {
      router.push(`/seller/sales/payment?compact=true`);
    } else {
      router.push(`/seller/sales/confirmation?compact=true`);
    }
  };
  
  // Verificar si existe una venta en progreso
  const hasSaleInProgress = state.selectedCustomer || state.cartItems.length > 0;
  
  // Calcular el total si hay productos en el carrito
  const totalAmount = state.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Contenido para venta completada
  if (isCompleted) {
    return (
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">¡Venta Completada!</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            La venta se ha procesado correctamente. Puede iniciar una nueva venta o volver al panel de control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={startNewSale}
              className="gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Iniciar Nueva Venta
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/seller/dashboard")}
              className="gap-2"
            >
              <BarChart className="h-5 w-5" />
              Ir al Panel
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Vista del dashboard de ventas
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Punto de Venta</h1>
      
      {/* Tarjeta superior con acciones principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Gestión de Ventas</CardTitle>
            <CardDescription>
              Inicie una nueva venta o continúe con una venta en curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gap-2 flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={startNewSale}
              >
                <ShoppingCart className="h-5 w-5" />
                Nueva Venta
                <span className="text-xs opacity-70 ml-1">(Alt+N)</span>
              </Button>
              
              {hasSaleInProgress && (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 flex-1 border-blue-300 hover:bg-blue-50"
                  onClick={continueSale}
                >
                  <Repeat className="h-5 w-5" />
                  Continuar Venta
                  <span className="text-xs opacity-70 ml-1">(Alt+C)</span>
                </Button>
              )}
            </div>
          </CardContent>
          
          {/* Mostrar detalle de venta en progreso si existe */}
          {hasSaleInProgress && (
            <CardFooter className="border-t bg-white/50 px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Venta en Progreso</h3>
                  <div className="text-sm">
                    {state.selectedCustomer ? (
                      <p className="font-medium">Cliente: {state.selectedCustomer.name}</p>
                    ) : (
                      <p className="text-muted-foreground italic">Sin cliente seleccionado</p>
                    )}
                    
                    {state.cartItems.length > 0 ? (
                      <div className="flex justify-between items-center">
                        <p>Productos: {state.cartItems.length}</p>
                        <p className="font-semibold">${totalAmount.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">Sin productos en carrito</p>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="gap-1"
                  onClick={continueSale}
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
      
      {/* Panel con estadísticas y accesos rápidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2 h-6 w-6" />
                Ventas Recientes
              </CardTitle>
              <CardDescription className="text-green-100">
                Las últimas transacciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Hoy</span>
                  <span className="font-semibold">10 ventas</span>
                </li>
                <li className="flex justify-between">
                  <span>Esta semana</span>
                  <span className="font-semibold">45 ventas</span>
                </li>
                <li className="flex justify-between">
                  <span>Este mes</span>
                  <span className="font-semibold">186 ventas</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4">
                Ver Más
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-6 w-6" />
                Productos Populares
              </CardTitle>
              <CardDescription className="text-amber-100">
                Los productos más vendidos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {popularProducts.map((product) => (
                  <li key={product.id} className="flex justify-between">
                    <span>{product.name}</span>
                    <span className="font-semibold">{product.sales} ventas</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-4">
                Inventario
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-6 w-6" />
                Resumen
              </CardTitle>
              <CardDescription className="text-purple-100">
                Estadísticas de ventas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Ventas del mes</span>
                  <span className="font-semibold">$24,320.45</span>
                </li>
                <li className="flex justify-between">
                  <span>Ticket promedio</span>
                  <span className="font-semibold">$130.75</span>
                </li>
                <li className="flex justify-between">
                  <span>Clientes nuevos</span>
                  <span className="font-semibold">18</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4">
                Ver Reportes
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
