"use client";

import { useEffect, useState } from "react";
import config from "@/lib/config/env";
import { debugEnv } from "@/lib/config/debug-env";

// Componente para mostrar los valores de configuración
const ConfigValues = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) {
    return <div className="p-4 text-center">Cargando configuración...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-semibold mb-3 border-b pb-2">
          Información de la Empresa
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Nombre:</strong> {config.company.name}
          </li>
          <li>
            <strong>Dirección:</strong> {config.company.address}
          </li>
          <li>
            <strong>Ciudad:</strong> {config.company.city}
          </li>
          <li>
            <strong>Teléfono:</strong> {config.company.phone}
          </li>
          <li>
            <strong>Email:</strong> {config.company.email}
          </li>
          <li>
            <strong>RIF:</strong> {config.company.rif}
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 border-b pb-2">
          Configuración de Moneda
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Código:</strong> {config.currency.code}
          </li>
          <li>
            <strong>Símbolo:</strong> {config.currency.symbol}
          </li>
          <li>
            <strong>Locale:</strong> {config.currency.locale}
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6 border-b pb-2">
          Aplicación
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Nombre:</strong> {config.app.name}
          </li>
          <li>
            <strong>Método de pago:</strong> {config.app.defaultPaymentMethod}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default function DebugPage() {
  const [isServer, setIsServer] = useState(true);

  useEffect(() => {
    setIsServer(false);
  }, []);

  // Ejecutar la función de depuración en el servidor
  if (typeof window === "undefined") {
    debugEnv();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">
        Depuración de Variables de Entorno
      </h1>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Estado: {isServer ? "Servidor" : "Cliente"}
        </h2>

        <ConfigValues />
      </div>

      <div className="bg-amber-50 dark:bg-slate-700 p-4 rounded-lg w-full max-w-3xl">
        <h3 className="text-amber-800 dark:text-amber-300 font-medium mb-2">
          Nota
        </h3>
        <p className="text-amber-700 dark:text-amber-200">
          Si ves valores diferentes a los de tu archivo .env, significa que las
          variables de entorno no se están cargando correctamente. Revisa la
          consola del servidor para ver los logs de depuración.
        </p>
      </div>
    </main>
  );
}
