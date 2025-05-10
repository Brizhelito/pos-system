"use client";

import React, { ReactNode } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButtons } from "../ExportButtons";
import { ReportData } from "../../utils/exportUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  filterColumn?: string;
  filterOptions?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  exportFilename?: string;
  exportOptions?: {
    dateFields?: string[];
    numberFields?: string[];
    title?: string;
  };
  isLoading?: boolean;
  renderRowSubComponent?: (row: TData) => React.ReactNode;
  summary?: ReactNode;
  emptyStateMessage?: string;
  children?: ReactNode;
}

export function ReportDataTable<TData extends object, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder,
  filterColumn,
  filterOptions,
  title,
  subtitle,
  icon,
  exportFilename = "reporte",
  exportOptions,
  isLoading = false,
  renderRowSubComponent,
  summary,
  emptyStateMessage = "No hay datos disponibles para mostrar.",
  children,
}: ReportDataTableProps<TData, TValue>) {
  // Estados para la tabla
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Configuración de la tabla
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  // Convertir los datos para exportación
  const getExportData = (): ReportData[] => {
    return data.map((item) => ({ ...item } as unknown as ReportData));
  };

  // Renderizado del skeleton para carga
  const renderSkeleton = () => (
    <>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </>
  );

  // Función de ayuda para verificar si la columna existe
  const columnExists = (columnId?: string) => {
    if (!columnId) return false;

    // Solo verificar si la columna existe en el objeto columns
    return columns.some(
      (col) => "accessorKey" in col && col.accessorKey === columnId
    );
  };

  return (
    <Card className="shadow-sm">
      {(title || subtitle) && (
        <CardHeader className="pb-3">
          {title && (
            <div className="flex items-center space-x-2">
              {icon}
              <CardTitle>{title}</CardTitle>
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
      )}

      <CardContent>
        {!isLoading && summary && <div className="mb-6">{summary}</div>}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <DataTableToolbar
              table={table}
              searchColumn={
                columnExists(searchColumn) ? searchColumn : undefined
              }
              searchPlaceholder={searchPlaceholder}
              filterColumn={
                columnExists(filterColumn) ? filterColumn : undefined
              }
              filterOptions={filterOptions}
            />

            {data.length > 0 && exportOptions && (
              <ExportButtons
                data={getExportData()}
                filename={exportFilename}
                dateFields={exportOptions.dateFields}
                numberFields={exportOptions.numberFields}
                title={exportOptions.title}
              />
            )}
          </div>

          {isLoading ? (
            renderSkeleton()
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="sticky top-0 bg-white z-10"
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
                        <React.Fragment key={row.id}>
                          <TableRow
                            className="even:bg-gray-50 hover:bg-gray-100"
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
                          {/* Sub-componente expandible si existe */}
                          {row.getIsExpanded() && renderRowSubComponent && (
                            <TableRow>
                              <TableCell
                                colSpan={row.getVisibleCells().length}
                                className="p-0"
                              >
                                <div className="p-4 bg-muted/50 rounded-md m-2">
                                  {renderRowSubComponent(row.original)}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          {emptyStateMessage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <DataTablePagination table={table} />
            </>
          )}

          {children && <div className="mt-4">{children}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
