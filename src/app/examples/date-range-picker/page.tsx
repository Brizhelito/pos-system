"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";

export default function DateRangePickerExamplePage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Ejemplo de Selector de Rango de Fechas
      </h1>
      <p className="text-muted-foreground">
        Ejemplos de implementación del nuevo componente AdvancedDateRangePicker
      </p>

      <Tabs defaultValue="default">
        <TabsList>
          <TabsTrigger value="default">Predeterminado</TabsTrigger>
          <TabsTrigger value="compact">Compacto</TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Selector con diseño horizontal</CardTitle>
              <CardDescription>
                Implementación estándar del selector de rango de fechas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedDateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Rango seleccionado:</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(
                {
                  from: dateRange.from?.toISOString() || null,
                  to: dateRange.to?.toISOString() || null,
                },
                null,
                2
              )}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="compact" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Selector con diseño compacto</CardTitle>
              <CardDescription>
                Diseño vertical para espacios reducidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                compact={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Selector personalizado</CardTitle>
              <CardDescription>
                Con opciones y estilos personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                align="end"
                showIcon={false}
                placeholder="Seleccione un rango de fechas"
                additionalOptions={[
                  {
                    label: "Todo el registro",
                    value: "all_time",
                    dateRange: {
                      from: new Date(2020, 0, 1),
                      to: new Date(),
                    },
                  },
                ]}
                className="border p-3 rounded-md"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
