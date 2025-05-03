"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center  ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent dark:from-red-400 dark:to-orange-400">
              Acceso no autorizado
            </CardTitle>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              No tienes permisos para acceder a este recurso
            </p>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold dark:text-gray-200">
                  ¡Acceso restringido!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Por favor inicia sesión con una cuenta autorizada o contacta
                  al equipo de soporte si crees que esto es un error.
                </p>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => window.history.back()}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 flex gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver atrás
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-center gap-2 mt-4">
            <a
              href="/login"
              className="text-sm text-primary hover:underline dark:text-primary-dark"
            >
              Ir al inicio de sesión
            </a>
            <span className="text-gray-400 dark:text-gray-600">|</span>
            <a
              href="/contact"
              className="text-sm text-primary hover:underline dark:text-primary-dark"
            >
              Contactar soporte
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
