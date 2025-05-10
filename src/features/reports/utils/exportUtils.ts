/**
 * Utilidades para la exportación de datos a Excel y CSV
 */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Opciones para la exportación
 */
export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  dateFormat?: string;
  numberFormat?: string;
  includeTotals?: boolean;
  title?: string;
}

/**
 * Tipo genérico para datos de reporte
 */
export type ReportData = Record<string, unknown>;

/**
 * Exporta datos a un archivo Excel
 * @param data Array de objetos con los datos a exportar
 * @param options Opciones de exportación
 */
export async function exportToExcel(
  data: ReportData[],
  options: ExportOptions = {}
): Promise<void> {
  if (!data || data.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  try {
    // Configurar opciones por defecto
    const filename = options.filename || "reporte-export.xlsx";
    const sheetName = options.sheetName || "Datos";

    // Crear un libro de trabajo
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "POS System";
    workbook.lastModifiedBy = "POS System";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Añadir una hoja
    const worksheet = workbook.addWorksheet(sheetName);

    // Obtener nombres de columnas del primer objeto
    const columns = Object.keys(data[0]);

    // Añadir encabezados
    worksheet.columns = columns.map((key) => ({
      header: key,
      key,
      width: 20,
    }));

    // Añadir filas
    data.forEach((item) => {
      const row: Record<string, unknown> = {};

      // Preparar los datos para cada celda
      columns.forEach((key) => {
        row[key] = item[key];
      });

      worksheet.addRow(row);
    });

    // Estilizar encabezados
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Generar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
  }
}

/**
 * Exporta datos a un archivo CSV
 * @param data Array de objetos con los datos a exportar
 * @param options Opciones de exportación
 */
export async function exportToCSV(
  data: ReportData[],
  options: ExportOptions = {}
): Promise<void> {
  if (!data || data.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  try {
    // Configurar opciones por defecto
    const filename = options.filename || "reporte-export.csv";

    // Crear un libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    // Obtener nombres de columnas del primer objeto
    const columns = Object.keys(data[0]);

    // Añadir encabezados
    worksheet.columns = columns.map((key) => ({
      header: key,
      key,
      width: 20,
    }));

    // Añadir filas
    data.forEach((item) => {
      const row: Record<string, unknown> = {};

      // Preparar los datos para cada celda
      columns.forEach((key) => {
        row[key] = item[key];
      });

      worksheet.addRow(row);
    });

    // Generar el archivo CSV
    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob([buffer], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error al exportar a CSV:", error);
  }
}

/**
 * Exporta datos a un archivo PDF
 * @param data Array de objetos con los datos a exportar
 * @param options Opciones de exportación
 */
export async function exportToPDF(
  data: ReportData[],
  options: ExportOptions = {}
): Promise<void> {
  if (!data || data.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  try {
    // Configurar opciones por defecto
    const filename = options.filename || "reporte-export.pdf";
    const title = options.title || "Reporte";

    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Añadir título
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 14, 30);

    // Crear una tabla con los datos
    const columns = Object.keys(data[0]);
    const rows = data.map((item) =>
      columns.map((key) => {
        const value = item[key];

        // Formatear valores y asegurar que son string
        if (value instanceof Date) {
          return formatDate(value);
        } else if (value === null || value === undefined) {
          return "";
        } else {
          return String(value);
        }
      })
    );

    // Generar la tabla
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Guardar el PDF
    doc.save(filename);
  } catch (error) {
    console.error("Error al exportar a PDF:", error);
  }
}

/**
 * Prepara los datos para la exportación, formateando fechas y números
 * @param data Datos originales
 * @param dateFields Campos que contienen fechas
 * @param numberFields Campos que contienen números
 * @returns Datos procesados listos para exportar
 */
export function prepareDataForExport(
  data: ReportData[],
  dateFields: string[] = [],
  numberFields: string[] = []
): ReportData[] {
  if (!data || data.length === 0) return [];

  return data.map((item) => {
    const exportItem: ReportData = { ...item };

    // Formatear fechas
    dateFields.forEach((field) => {
      if (exportItem[field] instanceof Date) {
        exportItem[field] = formatDate(exportItem[field] as Date);
      } else if (exportItem[field]) {
        // Intentar convertir a fecha si es un string
        try {
          exportItem[field] = formatDate(new Date(exportItem[field] as string));
        } catch {
          // Mantener el valor original si no se puede convertir
        }
      }
    });

    // Formatear números
    numberFields.forEach((field) => {
      if (typeof exportItem[field] === "number") {
        exportItem[field] = (exportItem[field] as number).toFixed(2);
      }
    });

    return exportItem;
  });
}

/**
 * Formatea una fecha para exportación
 * @param date Fecha a formatear
 * @returns String con la fecha formateada
 */
function formatDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
