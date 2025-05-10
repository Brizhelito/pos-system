"use client";

import { useState } from "react";
import { DownloadIcon, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
} from "../../utils/exportUtils";
import { ReportData } from "../../utils/exportUtils";

export interface ExportButtonsProps {
  data: ReportData[];
  filename: string;
  dateFields?: string[];
  numberFields?: string[];
  booleanFields?: string[];
  title?: string;
  showPDF?: boolean;
  showExcel?: boolean;
  showCSV?: boolean;
}

export function ExportButtons({
  data,
  filename,
  dateFields = [],
  numberFields = [],
  title = "",
  showPDF = true,
  showExcel = true,
  showCSV = true,
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    if (data.length === 0) return;
    setIsExporting(format);

    try {
      switch (format) {
        case "pdf":
          await exportToPDF(data, {
            filename: filename,
            title: title,
            dateFormat: dateFields ? "dd/MM/yyyy" : undefined,
            numberFormat: numberFields ? "#,##0.00" : undefined,
          });
          break;
        case "excel":
          await exportToExcel(data, {
            filename: filename,
            dateFormat: dateFields ? "dd/MM/yyyy" : undefined,
            numberFormat: numberFields ? "#,##0.00" : undefined,
          });
          break;
        case "csv":
          await exportToCSV(data, {
            filename: filename,
            dateFormat: dateFields ? "dd/MM/yyyy" : undefined,
            numberFormat: numberFields ? "#,##0.00" : undefined,
          });
          break;
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {title && (
          <div className="px-2 py-1.5 text-sm font-semibold">{title}</div>
        )}
        {title && <DropdownMenuSeparator />}

        {showPDF && (
          <DropdownMenuItem
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
          >
            {isExporting === "pdf" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            <span>PDF</span>
          </DropdownMenuItem>
        )}

        {showExcel && (
          <DropdownMenuItem
            onClick={() => handleExport("excel")}
            disabled={isExporting !== null}
          >
            {isExporting === "excel" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            <span>Excel</span>
          </DropdownMenuItem>
        )}

        {showCSV && (
          <DropdownMenuItem
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
          >
            {isExporting === "csv" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            <span>CSV</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
