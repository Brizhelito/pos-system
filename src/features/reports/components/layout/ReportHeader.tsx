"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { AdvancedDateRangePicker } from "../../components/ui/AdvancedDateRangePicker";

interface ReportHeaderProps {
  title: string;
  backLink: string;
  dateRange?: DateRange;
  setDateRange?: (range: DateRange) => void;
  showDatePicker?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

export function ReportHeader({
  title,
  backLink,
  dateRange,
  setDateRange,
  showDatePicker = true,
  className = "",
  actions,
}: ReportHeaderProps) {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Volver"
          >
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {showDatePicker && dateRange && setDateRange && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AdvancedDateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      )}
    </div>
  );
}
