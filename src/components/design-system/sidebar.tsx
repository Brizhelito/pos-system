"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import { useState } from "react"; // Import only useState

const components = [
  { name: "Button", path: "/design-system/button" },
  { name: "Input", path: "/design-system/input" },
  { name: "Card", path: "/design-system/card" },
  { name: "Table", path: "/design-system/data-table" },
  // Agrega todos tus componentes aquí
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage collapse

  // Function to toggle the collapsed state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = 256; // Define a fixed width when not collapsed

  return (
    // Use dynamic width based on isCollapsed state
    <div className="sticky max-h-screen">
      <nav
        style={{ width: isCollapsed ? "0px" : `${sidebarWidth}px` }} // Set width based on state
        className={cn(
          "border-r flex flex-col transition-all duration-300 ease-in-out overflow-hidden", // Add transition and overflow hidden
          isCollapsed ? "w-0" : "" // Tailwind width class is overridden by style prop when not collapsed
        )}
      >
        {/* Toggle button */}
        <button
          onClick={toggleCollapse}
          className="absolute top-4 z-10 p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          style={{ right: isCollapsed ? "10px" : `${sidebarWidth}px` }} // Position button based on collapse state
        >
          {/* Use simple arrow icons or similar */}
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>

        {!isCollapsed && ( // Only render content when not collapsed
          <div className="p-4 flex flex-col h-full">
            {" "}
            {/* Added padding here and flex column for layout */}
            <h2 className="text-lg font-semibold mb-4">
              <Link href="/design-system"> Componentes</Link>
            </h2>
            <div className="space-y-1 flex-grow">
              {" "}
              {/* flex-grow to push ThemeToggle to bottom */}
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
            <div className="mt-auto">
              {" "}
              {/* Use mt-auto to push to the bottom */}
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
