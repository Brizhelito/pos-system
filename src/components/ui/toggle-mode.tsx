"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react"; // Iconos para los temas
import { useTheme } from "next-themes"; // Hook para acceder y cambiar el tema

import { Button } from "@/components/ui/button"; // Componente Botón de Shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Componentes Dropdown de Shadcn/ui

/**
 * Componente para cambiar entre los temas claro, oscuro y del sistema.
 * Muestra un icono de sol o luna y abre un menú desplegable al hacer clic.
 */
export function ModeToggle() {
  // Obtiene la función para cambiar el tema (setTheme) del hook useTheme.
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* El disparador del menú es un botón con iconos */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {/* Muestra el icono del sol en tema claro */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Muestra el icono de la luna en tema oscuro */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {/* Texto para lectores de pantalla */}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      {/* Contenido del menú desplegable */}
      <DropdownMenuContent align="end">
        {/* Opción para seleccionar el tema claro */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        {/* Opción para seleccionar el tema oscuro */}
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Oscuro
        </DropdownMenuItem>
        {/* Opción para usar el tema del sistema */}
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
