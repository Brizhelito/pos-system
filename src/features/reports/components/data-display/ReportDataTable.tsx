"use client";

import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "../common/Pagination";
import { ExportButtons } from "../common/ExportButtons";
import { ReportData } from "../../utils/exportUtils";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ReportDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  exportOptions?: {
    filename: string;
    dateFields?: string[];
    numberFields?: string[];
    booleanFields?: string[];
    title?: string;
  };
}

export function ReportDataTable<TData>({
  columns,
  data,
  pageSize = 10,
  totalItems,
  currentPage = 1,
  onPageChange,
  className = "",
  exportOptions,
}: ReportDataTableProps<TData>) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Efecto para manejar el montaje y evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar el tema basado en resolvedTheme para manejar correctamente "system"
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualPagination: Boolean(onPageChange),
    pageCount: totalItems ? Math.ceil(totalItems / pageSize) : undefined,
  });

  // Si no se proporciona un controlador de paginación externo, usar la paginación interna
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      table.setPageIndex(page - 1);
    }
  };

  const actualTotalItems = totalItems || data.length;
  const actualCurrentPage = onPageChange
    ? currentPage
    : table.getState().pagination.pageIndex + 1;

  // Si la componente no está montada aún, mostrar un placeholder para evitar hidratación incorrecta
  if (!mounted) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        <div className="rounded-md border">
          <div className="h-[300px] animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </div>
        <div className="animate-pulse h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {exportOptions && (
        <div className="flex justify-end mb-4">
          <ExportButtons
            data={data as ReportData[]}
            filename={exportOptions.filename}
            dateFields={exportOptions.dateFields}
            numberFields={exportOptions.numberFields}
            booleanFields={exportOptions.booleanFields}
            title={exportOptions.title}
          />
        </div>
      )}

      <div
        className={cn(
          "rounded-md border",
          isDark ? "border-gray-700" : "border-gray-200"
        )}
      >
        <Table>
          <TableHeader className={isDark ? "bg-gray-900/50" : "bg-gray-50/80"}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={isDark ? "border-gray-700" : "border-gray-200"}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={isDark ? "text-gray-300" : "text-gray-700"}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    isDark
                      ? "border-gray-700 hover:bg-gray-800/50"
                      : "border-gray-200 hover:bg-gray-100",
                    row.getIsSelected() && isDark
                      ? "bg-gray-800"
                      : row.getIsSelected()
                      ? "bg-gray-100"
                      : ""
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow
                className={
                  isDark
                    ? "border-gray-700 hover:bg-gray-800/50"
                    : "border-gray-200 hover:bg-gray-100"
                }
              >
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {actualTotalItems > 0 && (
        <Pagination
          currentPage={actualCurrentPage}
          totalItems={actualTotalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}
