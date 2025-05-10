"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Users,
  Package,
  Keyboard,
  ChevronRight,
  Info,
  ArrowLeft,
  LogOut,
  LucideIcon,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Interfaces para los componentes
interface ModuleCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  colorFrom: string;
  colorTo: string;
  textColor?: string;
  badge?: React.ReactNode;
}

interface ShortcutKeyProps {
  keyName: string;
  description: string;
}

const SellerPage = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
  };

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      try {
        // Intentar la llamada POST a /logout
        await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (fetchError) {
        // Si falla la solicitud, solo registrarlo y continuar con el logout local
        console.log("No se pudo contactar el endpoint de logout:", fetchError);
      }

      // Borrar datos de sesión del localStorage de todas formas
      localStorage.clear();

      // Redireccionar a la página de login
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
    }
  };

  const ModuleCard: React.FC<ModuleCardProps> = ({
    href,
    title,
    description,
    icon: Icon,
    colorFrom,
    colorTo,
    textColor = "text-white",
    badge,
  }) => (
    <motion.div
      variants={item}
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden"
    >
      <Link
        href={href}
        className={`block p-6 bg-gradient-to-br ${colorFrom} ${colorTo} ${textColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col h-full`}
      >
        <div className="absolute top-0 right-0 p-1 opacity-10">
          <Icon size={120} />
        </div>

        <div className="flex items-center mb-3">
          <div className="bg-white/20 p-2 rounded-lg mr-3">
            <Icon size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <p className="mb-4 z-10">{description}</p>

        {badge && (
          <div className="mt-auto">
            <div className="flex items-center text-sm bg-white/20 rounded-lg p-2 backdrop-blur-sm">
              <Info size={16} className="mr-2" />
              {badge}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-white/20 rounded-full p-1 backdrop-blur-sm">
          <ChevronRight size={20} />
        </div>
      </Link>
    </motion.div>
  );

  const ShortcutKey: React.FC<ShortcutKeyProps> = ({
    keyName,
    description,
  }) => (
    <motion.li className="flex items-center group" whileHover={{ x: 5 }}>
      <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono mr-2 shadow-sm group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900 dark:group-hover:text-blue-200 transition-colors">
        {keyName}
      </span>
      <span className="group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">
        {description}
      </span>
    </motion.li>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-6 shadow-sm mb-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <ShoppingCart className="mr-2 text-blue-600 dark:text-blue-400" />
            Panel de Vendedor
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors ${
              isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <LogOut size={16} className="mr-2" />
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ModuleCard
            href="/seller/sales"
            title="Ventas"
            description="Gestiona el proceso de ventas, desde la selección de clientes hasta el procesamiento de pagos"
            icon={ShoppingCart}
            colorFrom="from-blue-500"
            colorTo="to-blue-700"
            badge="Acceso rápido: Módulo con atajos de teclado"
          />

          <ModuleCard
            href="/seller/customers"
            title="Clientes"
            description="Administra la información de los clientes, busca y gestiona sus datos de contacto y ventas asociadas"
            icon={Users}
            colorFrom="from-green-500"
            colorTo="to-emerald-700"
          />

          <ModuleCard
            href="/seller/products"
            title="Productos"
            description="Consulta el catálogo de productos disponibles, existencias y precios actualizados"
            icon={Package}
            colorFrom="from-purple-500"
            colorTo="to-indigo-700"
          />

          <ModuleCard
            href="/admin/reports"
            title="Reportes"
            description="Visualiza e imprime reportes detallados de ventas, inventario y clientes"
            icon={BarChart}
            colorFrom="from-amber-500"
            colorTo="to-orange-700"
            badge="Nuevo: Visualizaciones gráficas de datos"
          />
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="mt-12 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center mb-5 text-gray-900 dark:text-gray-100">
            <Keyboard
              size={20}
              className="mr-2 text-blue-600 dark:text-blue-400"
            />
            <h2 className="text-xl font-bold">
              Guía de Atajos de Teclado - Módulo de Ventas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Navegación
              </h3>
              <ul className="space-y-3">
                <ShortcutKey
                  keyName="ESC"
                  description="Volver al panel principal"
                />
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
                <Keyboard size={16} className="mr-2" />
                Atajos de Funciones
              </h3>
              <ul className="space-y-3">
                <ShortcutKey keyName="F1" description="Buscar Cliente" />
                <ShortcutKey keyName="F2" description="Buscar Producto" />
                <ShortcutKey
                  keyName="F3"
                  description="Cambiar Método de Pago"
                />
                <ShortcutKey keyName="F4" description="Procesar Venta" />
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerPage;
