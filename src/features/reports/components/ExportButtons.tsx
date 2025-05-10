"use client";

import React from "react";
import { Download, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ExportOptions,
  ReportData,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  prepareDataForExport,
} from "../utils/exportUtils";

interface ExportButtonsProps {
  data: ReportData[];
  filename?: string;
  dateFields?: string[];
  numberFields?: string[];
  showExcel?: boolean;
  showCSV?: boolean;
  showPDF?: boolean;
  title?: string;
  className?: string;
}

/**
 * Componente que muestra botones para exportar datos a Excel y CSV
 */
export function ExportButtons({
  data,
  filename = "reporte",
  dateFields = [],
  numberFields = [],
  showExcel = true,
  showCSV = true,
  showPDF = true,
  title,
  className = "",
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  if (!data || data.length === 0) {
    return null;
  }

  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      const processedData = prepareDataForExport(
        data,
        dateFields,
        numberFields
      );
      const options: ExportOptions = {
        filename: `${filename}.xlsx`,
        sheetName: "Datos",
      };
      await exportToExcel(processedData, options);
    } catch (error) {
      console.error("Error exportando a Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportToCSV = async () => {
    try {
      setIsExporting(true);
      const processedData = prepareDataForExport(
        data,
        dateFields,
        numberFields
      );
      const options: ExportOptions = {
        filename: `${filename}.csv`,
      };
      await exportToCSV(processedData, options);
    } catch (error) {
      console.error("Error exportando a CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportToPDF = async () => {
    try {
      setIsExporting(true);
      const processedData = prepareDataForExport(
        data,
        dateFields,
        numberFields
      );
      const options: ExportOptions = {
        filename: `${filename}.pdf`,
        title: title || filename,
      };
      await exportToPDF(processedData, options);
    } catch (error) {
      console.error("Error exportando a PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {showExcel && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToExcel}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          <FileSpreadsheet className="h-4 w-4 mr-1" />
          Excel
        </Button>
      )}
      {showCSV && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToCSV}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4 mr-1" />
          CSV
        </Button>
      )}
      {showPDF && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToPDF}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          <FileType2 className="h-4 w-4 mr-1" />
          PDF
        </Button>
      )}
    </div>
  );
}

/**
 * Componente de botón único para descarga genérica
 */
export function DownloadButton({
  onClick,
  children,
  disabled = false,
  variant = "outline",
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4 mr-1" />
      {children}
    </Button>
  );
}
