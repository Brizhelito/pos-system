"use client";

import { useEffect, useState } from "react";
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
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface DataTableAdvancedProps<TData, TValue> {
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
  addNewButton?: {
    label: string;
    onClick: () => void;
  };
}

export function DataTableAdvanced<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder,
  filterColumn,
  filterOptions,
  addNewButton,
}: DataTableAdvancedProps<TData, TValue>) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Efecto para manejar el montaje y evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Si la componente no está montada aún, mostrar un placeholder para evitar hidratación incorrecta
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        <div className="rounded-md border">
          <div className="h-[300px] animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </div>
        <div className="animate-pulse h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchColumn={searchColumn}
        searchPlaceholder={searchPlaceholder}
        filterColumn={filterColumn}
        filterOptions={filterOptions}
        addNewButton={addNewButton}
      />
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
                className={
                  isDark
                    ? "border-gray-700 hover:bg-gray-800/50"
                    : "border-gray-200 hover:bg-gray-100/50"
                }
              >
                {headerGroup.headers.map((header) => {
                  return (
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
                  );
                })}
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
                  isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100"
                }
              >
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
