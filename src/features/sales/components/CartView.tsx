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
    (item: CartItem, newQuantity: number) => {
      if (newQuantity < 1) return;
      onUpdateItem({
        ...item,
        quantity: newQuantity,
        subtotal: item.unitPrice * newQuantity,
      });
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
    <div className="cart-view h-full flex flex-col">
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-gray-500 dark:text-gray-400">
          <svg
            className="w-12 h-12 mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-sm mb-1">El carrito está vacío</p>
          <p className="text-xs">Use F2 para buscar productos</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {items.map((item, index) => (
            <div
              key={item.productId}
              className="cart-item border-b dark:border-gray-700 p-2 hover:bg-accent/5"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {item.product.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Disminuir cantidad"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>

                    <button
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                      aria-label="Aumentar cantidad"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ${item.unitPrice.toFixed(2)} c/u
                      </p>
                      <p className="font-bold text-sm">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>

                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleRemoveItem(item.productId)}
                      aria-label="Eliminar producto"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartView;
