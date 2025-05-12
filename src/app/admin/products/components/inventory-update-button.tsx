"use client";

import { useState } from "react";
import { StockForm } from "./stock-form";
import { ProductWithRelations } from "../columns";

interface InventoryUpdateButtonProps {
  product: ProductWithRelations | null;
  onSuccess: () => void;
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
}

export function InventoryUpdateButton({
  product,
  onSuccess,
  showForm,
  setShowForm,
}: InventoryUpdateButtonProps) {
  // Estado local solo si no se proporciona control externo
  const [localShowForm, setLocalShowForm] = useState(false);

  // Determinar qué estado usar
  const isFormVisible = showForm !== undefined ? showForm : localShowForm;
  const toggleForm = (show: boolean) => {
    if (setShowForm) {
      setShowForm(show);
    } else {
      setLocalShowForm(show);
    }
  };

  return (
    <>
      {product && (
        <StockForm
          open={isFormVisible}
          onClose={() => toggleForm(false)}
          product={product}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
