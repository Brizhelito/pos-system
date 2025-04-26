// components/design-system/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";

const components = [
  { name: "Button", path: "/design-system/button" },
  { name: "Input", path: "/design-system/input" },
  { name: "Card", path: "/design-system/card" },
  { name: "Table", path: "/design-system/table" },
  // Agrega todos tus componentes aquí
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Componentes</h2>
      <div className="space-y-1">
        {components.map((component) => (
          <Link
            key={component.path}
            href={component.path}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium",
              pathname === component.path
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            )}
          >
            {component.name}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}
