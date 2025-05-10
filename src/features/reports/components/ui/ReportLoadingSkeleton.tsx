"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportLoadingSkeletonProps {
  withTable?: boolean;
  withChart?: boolean;
  withHeader?: boolean;
  withCards?: number;
}

export function ReportLoadingSkeleton({
  withTable = true,
  withChart = false,
  withHeader = true,
  withCards = 0,
}: ReportLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      {withCards > 0 && (
        <div
          className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(
            Math.max(withCards, 1),
            4
          )}`}
        >
          {Array.from({ length: withCards }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Gráfico */}
      {withChart && (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      )}

      {/* Tabla */}
      {withTable && (
        <Card>
          {withHeader && (
            <CardHeader className="space-y-2 pb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
          )}
          <CardContent>
            <div className="flex justify-between mb-4">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-9 w-[260px]" />
              <Skeleton className="h-9 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
