"use client"; // Necesario porque usa hooks de React (useState, useEffect)

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * Proveedor de temas para la aplicación.
 * Utiliza next-themes para gestionar el cambio entre modo claro y oscuro.
 * @param children - Componentes hijos que tendrán acceso al contexto del tema.
 * @param props - Propiedades adicionales para NextThemesProvider.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    // Pasa todas las props al NextThemesProvider original.
    // attribute="class" indica que el tema se aplicará añadiendo una clase ('dark') al elemento <html>.
    // defaultTheme="system" usará el tema preferido del sistema operativo del usuario por defecto.
    // enableSystem permite que el tema cambie automáticamente si cambia la preferencia del sistema.
    // disableTransitionOnChange evita transiciones visuales bruscas al cambiar de tema.
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
