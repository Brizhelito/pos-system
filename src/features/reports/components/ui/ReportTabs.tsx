"use client";

import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";

export interface ReportTabItem {
  value: string;
  label: string;
  icon?: ComponentType<LucideProps>;
  content: ReactNode;
}

interface ReportTabsProps {
  tabs: ReportTabItem[];
  defaultTab?: string;
  onTabChange?: (value: string) => void;
}

export function ReportTabs({ tabs, defaultTab, onTabChange }: ReportTabsProps) {
  // Validar que hay pestañas disponibles
  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Asegurar que el valor por defecto exista en las pestañas
  const validDefaultTab =
    tabs.find((t) => t.value === defaultTab)?.value || tabs[0]?.value;

  return (
    <Tabs
      defaultValue={validDefaultTab}
      className="space-y-4"
      onValueChange={onTabChange}
    >
      <div className="relative">
        <TabsList className="flex w-full justify-start overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex min-w-[120px] items-center gap-2 flex-shrink-0"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
