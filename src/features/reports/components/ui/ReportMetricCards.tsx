"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon?: ComponentType<LucideProps>;
  changeType?: "positive" | "negative" | "neutral";
}

export function ReportMetricCards({ metrics }: { metrics: MetricCardProps[] }) {
  const getChangeColor = (type?: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change !== undefined && (
                <p className={`text-xs ${getChangeColor(metric.changeType)}`}>
                  {Number(metric.change) >= 0 ? "+" : ""}
                  {metric.change}%
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
