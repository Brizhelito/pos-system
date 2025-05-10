"use client";

import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
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

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = "Buscar...",
  addNewButton,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumn && table.getColumn(searchColumn) && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)!.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)!.setFilterValue(event.target.value)
            }
            className="h-9 w-[250px] lg:w-[300px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {addNewButton && (
          <Button onClick={addNewButton.onClick}>{addNewButton.label}</Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
