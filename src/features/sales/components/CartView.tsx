"use client";
import React, { useCallback } from "react";
import { CartItem } from "../types";

interface CartViewProps {
  items: CartItem[];
  onUpdateItem: (item: CartItem) => void;
  onRemoveItem: (productId: number) => void;
}

const CartView = ({ items, onUpdateItem, onRemoveItem }: CartViewProps) => {
  const handleQuantityChange = useCallback(
    (productId: number, newQuantity: number) => {
      if (newQuantity < 1) return;
      const item = items.find((item) => item.productId === productId);
      if (item) {
        onUpdateItem({
          ...item,
          quantity: newQuantity,
          subtotal: item.unitPrice * newQuantity,
        });
      }
    },
    [items, onUpdateItem]
  );

  const handleRemoveItem = useCallback(
    (productId: number) => {
      onRemoveItem(productId);
    },
    [onRemoveItem]
  );

  return (
    <div className="cart-view" role="region" aria-label="Carrito de compras">
      {items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-full text-center p-4"
          role="status"
          aria-label="Carrito vacío"
        >
          <div className="text-muted-foreground mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-lg font-medium">El carrito está vacío</p>
            <p className="text-sm mt-1">
              Presiona F2 para buscar y agregar productos
            </p>
          </div>
        </div>
      ) : (
        <div
          className="space-y-3"
          role="list"
          aria-label="Productos en el carrito"
        >
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200"
              role="listitem"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {item.product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ${item.unitPrice.toFixed(2)} c/u
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center border rounded-lg"
                  role="group"
                  aria-label={`Cantidad de ${item.product.name}`}
                >
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - 1)
                    }
                    className="p-2 hover:bg-accent transition-colors rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Disminuir cantidad"
                    disabled={item.quantity <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span
                    className="px-3 py-1 text-sm font-medium"
                    aria-label={`Cantidad actual: ${item.quantity}`}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                    className="p-2 hover:bg-accent transition-colors rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Aumentar cantidad"
                    disabled={item.quantity >= item.product.stock}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                  aria-label={`Eliminar ${item.product.name} del carrito`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-right min-w-[80px]">
                <p
                  className="font-medium text-foreground"
                  aria-label={`Subtotal: $${item.subtotal.toFixed(2)}`}
                >
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartView;
