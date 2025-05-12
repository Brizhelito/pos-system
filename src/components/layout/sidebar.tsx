"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart4,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Truck,
  UserCircle,
  FileText,
  Store,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

export function SidebarItem({
  icon,
  label,
  href,
  active = false,
  collapsed = false,
  className,
  ...props
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg text-sm transition-all duration-200 hover:scale-[1.02]",
        collapsed ? "justify-center py-3 px-2" : "py-2 px-4",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {React.isValidElement(icon) &&
          React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            {
              className: cn(
                "size-5 transition-transform duration-200",
                collapsed && "size-6",
                active && "text-primary",
                "group-hover:scale-110"
              ),
            }
          )}
        {!collapsed && (
          <span className="transition-opacity duration-200">{label}</span>
        )}
      </div>
    </Link>
  );
}

export function Sidebar({
  collapsed = false,
  onToggle,
  className,
  ...props
}: SidebarProps) {
  const pathname = usePathname();
  const navItems = [
    {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: <ShoppingCart />,
      label: "Ventas",
      href: "/admin/reports/sales",
    },
    {
      icon: <Package />,
      label: "Productos",
      href: "/admin/products",
    },
    {
      icon: <Store />,
      label: "Inventario",
      href: "/admin/reports/inventory",
    },
    {
      icon: <FileText />,
      label: "Categorías",
      href: "/admin/categories",
    },
    {
      icon: <Truck />,
      label: "Proveedores",
      href: "/admin/suppliers",
    },
    {
      icon: <UserCircle />,
      label: "Clientes",
      href: "/admin/reports/customers",
    },
    {
      icon: <BarChart4 />,
      label: "Reportes",
      href: "/admin/reports",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "py-4 flex justify-between items-center border-b",
          collapsed ? "px-3" : "px-4"
        )}
      >
        {!collapsed && (
          <h2 className="text-lg font-semibold text-foreground transition-opacity duration-300">
            POS Admin
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "rounded-full p-0 size-8 text-muted-foreground hover:bg-accent transition-colors duration-200",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <nav className={cn("flex-1 py-3 space-y-1", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className={cn("border-t py-3", collapsed ? "px-2" : "px-3")}>
        <SidebarItem
          icon={<LogOut />}
          label="Cerrar sesión"
          href="/logout"
          collapsed={collapsed}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        />
      </div>
    </div>
  );
}