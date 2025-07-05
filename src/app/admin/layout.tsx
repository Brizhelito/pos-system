"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={` flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300  `}
      >
        {children}
      </main>
    </div>
  );
}
