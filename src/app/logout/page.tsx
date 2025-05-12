"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearStorageExcept } from "@/utils/storage";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function logout() {
      try {
        // 1. Hacer la petición a la API para cerrar la sesión
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al cerrar sesión en el servidor");
        }

        // 2. Limpiar localStorage excepto las preferencias de tema
        clearStorageExcept(["theme"]);
      } catch (err) {
        console.error("Error durante el proceso de logout:", err);
        setError(
          "Hubo un error al cerrar sesión, pero se han eliminado los datos locales"
        );

        // Limpiar localStorage incluso si hay error en la API, preservando el tema
        clearStorageExcept(["theme"]);
      } finally {
        // 3. Redireccionar a la página principal después de un breve retraso
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    }

    logout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Redirigiendo a la página principal...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Cerrando sesión
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Por favor espere mientras cerramos su sesión...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
