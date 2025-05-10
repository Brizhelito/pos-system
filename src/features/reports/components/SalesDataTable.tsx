"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, SortAsc, SortDesc, Calendar, Tag, User } from "lucide-react";
import { Pagination } from "./Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportButtons } from "./ExportButtons";
import { ReportData } from "../utils/exportUtils";

export interface SaleItem {
  id: string;
  fecha: string;
  producto: string;
  categoria: string;
  precio: number;
  cantidad: number;
  total: number;
  vendedor: string;
}

interface SalesDataTableProps {
  data: SaleItem[];
  exportFilename?: string;
}

export function SalesDataTable({
  data,
  exportFilename = "ventas-detalle",
}: SalesDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<SaleItem[]>(data);
  const [sortField, setSortField] = useState<keyof SaleItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [vendedorFilter, setVendedorFilter] = useState<string>("todos");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Listar categorías y vendedores únicos para los filtros
  const uniqueCategories = [
    "todas",
    ...new Set(data.map((item) => item.categoria)),
  ];
  const uniqueVendedores = [
    "todos",
    ...new Set(data.map((item) => item.vendedor)),
  ];

  // Actualizar filteredData cuando cambien los datos base o los filtros
  useEffect(() => {
    let result = [...data];

    // Aplicar filtro de texto de búsqueda
    if (searchTerm.trim()) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.producto.toLowerCase().includes(lowercaseSearchTerm) ||
          item.categoria.toLowerCase().includes(lowercaseSearchTerm) ||
          item.vendedor.toLowerCase().includes(lowercaseSearchTerm) ||
          item.fecha.includes(searchTerm)
      );
    }

    // Aplicar filtro de categoría
    if (categoryFilter !== "todas") {
      result = result.filter((item) => item.categoria === categoryFilter);
    }

    // Aplicar filtro de vendedor
    if (vendedorFilter !== "todos") {
      result = result.filter((item) => item.vendedor === vendedorFilter);
    }

    // Aplicar ordenamiento
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // Asumimos que son números
          return sortOrder === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      });
    }

    setFilteredData(result);
    // Cuando cambiamos los filtros, volvemos a la primera página
    setCurrentPage(1);
  }, [data, searchTerm, categoryFilter, vendedorFilter, sortField, sortOrder]);

  // Manejador para cambiar el ordenamiento
  const handleSort = (field: keyof SaleItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Calcular datos paginados
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Función para obtener el ícono de ordenamiento
  const getSortIcon = (field: keyof SaleItem) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <SortAsc className="inline h-4 w-4 ml-1" />
    ) : (
      <SortDesc className="inline h-4 w-4 ml-1" />
    );
  };

  // Obtener el estilo para los encabezados de columna ordenables
  const getSortableHeaderStyle = (field: keyof SaleItem) => {
    return `cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center ${
      sortField === field ? "text-primary" : ""
    }`;
  };

  // Función para convertir datos a formato exportable
  const getExportData = (): ReportData[] => {
    return data.map((item) => ({ ...item } as unknown as ReportData));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-between md:space-x-2">
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter"}
            />
          </div>

          <div className="flex space-x-2">
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "todas" ? "Todas las categorías" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select value={vendedorFilter} onValueChange={setVendedorFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueVendedores.map((vendedor) => (
                    <SelectItem key={vendedor} value={vendedor}>
                      {vendedor === "todos" ? "Todos los vendedores" : vendedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Botones de exportación */}
        {data.length > 0 && (
          <ExportButtons
            data={getExportData()}
            filename={exportFilename}
            dateFields={["fecha"]}
            numberFields={["precio", "cantidad", "total"]}
          />
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Datos de ventas del periodo seleccionado</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>
                <div
                  className={getSortableHeaderStyle("fecha")}
                  onClick={() => handleSort("fecha")}
                >
                  <Calendar className="mr-1 h-4 w-4" />
                  Fecha {getSortIcon("fecha")}
                </div>
              </TableHead>
              <TableHead>
                <div
                  className={getSortableHeaderStyle("producto")}
                  onClick={() => handleSort("producto")}
                >
                  Producto {getSortIcon("producto")}
                </div>
              </TableHead>
              <TableHead>
                <div
                  className={getSortableHeaderStyle("categoria")}
                  onClick={() => handleSort("categoria")}
                >
                  Categoría {getSortIcon("categoria")}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className={`${getSortableHeaderStyle("precio")} justify-end`}
                  onClick={() => handleSort("precio")}
                >
                  Precio {getSortIcon("precio")}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className={`${getSortableHeaderStyle(
                    "cantidad"
                  )} justify-end`}
                  onClick={() => handleSort("cantidad")}
                >
                  Cantidad {getSortIcon("cantidad")}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className={`${getSortableHeaderStyle("total")} justify-end`}
                  onClick={() => handleSort("total")}
                >
                  Total {getSortIcon("total")}
                </div>
              </TableHead>
              <TableHead>
                <div
                  className={getSortableHeaderStyle("vendedor")}
                  onClick={() => handleSort("vendedor")}
                >
                  Vendedor {getSortIcon("vendedor")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.producto}</TableCell>
                  <TableCell>{row.categoria}</TableCell>
                  <TableCell className="text-right">
                    {row.precio.toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-right">{row.cantidad}</TableCell>
                  <TableCell className="text-right">
                    {row.total.toFixed(2)} €
                  </TableCell>
                  <TableCell>{row.vendedor}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Mostrando{" "}
          {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} de{" "}
          {filteredData.length} registros
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
