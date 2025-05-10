"use client";

import React, { useState } from "react";
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
  const [sorting, setSorting] = useState<SortingState>([]);

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
              <TableRow>
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
