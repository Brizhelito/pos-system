"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Renderizar botones de páginas
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si hay menos que el máximo visible
      startPage = 1;
      endPage = totalPages;
    } else {
      // Determinar el rango de páginas a mostrar
      const middlePage = Math.floor(maxVisiblePages / 2);

      if (currentPage <= middlePage + 1) {
        // Estamos al principio
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - middlePage) {
        // Estamos al final
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Estamos en el medio
        startPage = currentPage - middlePage;
        endPage = currentPage + middlePage;
      }
    }

    // Añadir botones de página
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "outline" : "ghost"}
          size="sm"
          onClick={() => onPageChange(i)}
          className={`${
            i === currentPage ? "bg-primary text-primary-foreground" : ""
          } h-8 w-8 p-0`}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        className="hidden h-8 w-8 p-0 sm:flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        className="hidden h-8 w-8 p-0 sm:flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
