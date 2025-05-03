"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  BarChart4,
  Receipt,
  LogOut,
  ChevronRight,
  ChevronLeft,
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
        "flex items-center gap-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground",
        collapsed ? "justify-center py-3 px-2" : "py-2 px-4",
        active ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {React.isValidElement(icon) &&
          React.cloneElement(icon as React.ReactElement<any>, {
            className: cn("size-5", collapsed && "size-6"),
          })}
        {!collapsed && <span>{label}</span>}
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
      href: "/admin/sales",
    },
    {
      icon: <Package />,
      label: "Productos",
      href: "/admin/products",
    },
    {
      icon: <Receipt />,
      label: "Inventario",
      href: "/admin/inventory",
    },
    {
      icon: <Users />,
      label: "Clientes",
      href: "/admin/customers",
    },
    {
      icon: <BarChart4 />,
      label: "Reportes",
      href: "/admin/reports",
    },
    {
      icon: <Settings />,
      label: "Configuración",
      href: "/admin/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div className={cn(
        "py-4 flex justify-between items-center border-b",
        collapsed ? "px-3" : "px-4"
      )}>
        {!collapsed && (
          <h2 className="text-lg font-semibold text-foreground">POS Admin</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "rounded-full p-0 size-8 text-muted-foreground hover:bg-accent",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
      
      <nav className={cn(
        "flex-1 py-3 space-y-1",
        collapsed ? "px-2" : "px-3"
      )}>
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
      
      <div className={cn(
        "border-t py-3",
        collapsed ? "px-2" : "px-3"
      )}>
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