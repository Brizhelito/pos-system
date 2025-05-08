"use client";
import React, { useCallback, useState, useRef, useEffect, memo } from "react";
import { CartItem } from "../types";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

interface CartViewProps {
  items: CartItem[];
  onUpdateItem: (item: CartItem) => void;
  onRemoveItem: (productId: number) => void;
}

const CartViewComponent = ({
  items,
  onUpdateItem,
  onRemoveItem,
}: CartViewProps) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const cartInputRef = useRef<HTMLInputElement>(null);
  const cartContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the selected item
  const scrollToItem = useCallback((index: number) => {
    if (index !== -1 && itemRefs.current[index]) {
      itemRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  // Funciones utilizadas en handleKeyDown
  const handleQuantityChange = useCallback(
    (item: CartItem, newQuantity: number) => {
      if (newQuantity < 1) return;
      onUpdateItem({
        ...item,
        quantity: newQuantity,
        subtotal: item.unitPrice * newQuantity,
      });
    },
    [onUpdateItem]
  );

  const handleRemoveItem = useCallback(
    (productId: number) => {
      onRemoveItem(productId);
    },
    [onRemoveItem]
  );

  // Handle arrow key navigation - optimizado con useCallback
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (items.length === 0) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedItemIndex((prev) => {
            const newIndex = prev <= 0 ? items.length - 1 : prev - 1;
            scrollToItem(newIndex);
            return newIndex;
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedItemIndex((prev) => {
            const newIndex =
              prev === -1 || prev >= items.length - 1 ? 0 : prev + 1;
            scrollToItem(newIndex);
            return newIndex;
          });
          break;
        case "+":
          if (selectedItemIndex !== -1) {
            e.preventDefault();
            const item = items[selectedItemIndex];
            if (item.quantity < item.product.stock) {
              handleQuantityChange(item, item.quantity + 1);
              // Mostrar toast solo para cambios de cantidad significativos (más de 5)
              if (item.quantity + 1 === 5 || (item.quantity + 1) % 10 === 0) {
                toast.info(`Cantidad: ${item.quantity + 1}`);
              }
            } else {
              // Mostrar toast para error de stock (crítico)
              toast.error(`Stock máximo alcanzado: ${item.product.stock}`);
            }
          }
          break;
        case "-":
          if (selectedItemIndex !== -1) {
            e.preventDefault();
            const item = items[selectedItemIndex];
            if (item.quantity > 1) {
              handleQuantityChange(item, item.quantity - 1);
              // Mostrar toast solo para cambios significativos (menos de 5)
              if (item.quantity - 1 === 1 || item.quantity - 1 === 5) {
                toast.info(`Cantidad: ${item.quantity - 1}`);
              }
            }
          }
          break;
        case "Delete":
        case "Backspace":
          if (selectedItemIndex !== -1) {
            e.preventDefault();
            // Siempre mostrar toast para eliminación (crítico)
            toast.info(`Eliminado: ${items[selectedItemIndex].product.name}`);
            handleRemoveItem(items[selectedItemIndex].productId);
            setSelectedItemIndex((prev) =>
              prev >= items.length - 1 ? Math.max(0, items.length - 2) : prev
            );
          }
          break;
        case "Escape":
          e.preventDefault();
          cartInputRef.current?.blur();
          setSelectedItemIndex(-1);
          break;
      }
    },
    [
      items,
      selectedItemIndex,
      handleQuantityChange,
      handleRemoveItem,
      scrollToItem,
    ]
  );

  // Handle item click - optimizado con useCallback
  const handleItemClick = useCallback((index: number) => {
    setSelectedItemIndex(index);
    cartInputRef.current?.focus();
  }, []);

  // Focus the cart input when Alt+E is pressed (changed from Alt+R)
  useHotkeys(
    "alt+e",
    () => {
      cartInputRef.current?.focus();
      // Solo mostrar el toast cuando hay items disponibles
      if (items.length > 0) {
        toast.info("Carrito activado");
      }
      if (items.length > 0 && selectedItemIndex === -1) {
        setSelectedItemIndex(0);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // Escuchar el evento personalizado para activar el carrito
  useEffect(() => {
    const handleFocusCart = () => {
      cartInputRef.current?.focus();
      if (items.length > 0 && selectedItemIndex === -1) {
        setSelectedItemIndex(0);
      }
    };

    window.addEventListener("focusCart", handleFocusCart);

    return () => {
      window.removeEventListener("focusCart", handleFocusCart);
    };
  }, [items.length, selectedItemIndex]);

  // Effect to highlight the selected item
  useEffect(() => {
    if (selectedItemIndex !== -1 && items.length > 0) {
      scrollToItem(selectedItemIndex);
    }
  }, [selectedItemIndex, items.length, scrollToItem]);

  return (
    <div className="cart-view h-full flex flex-col">
      {/* Hidden input for keyboard focus */}
      <input
        ref={cartInputRef}
        type="text"
        className="sr-only"
        aria-label="Control del carrito"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      />

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
        <div className="flex-1 overflow-y-auto" ref={cartContainerRef}>
          <div className="p-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0">
            <span>
              Presione{" "}
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                Alt+E
              </kbd>{" "}
              para activar el carrito
            </span>
            <p>
              Use{" "}
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>{" "}
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>{" "}
              para navegar,{" "}
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">+</kbd>{" "}
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">-</kbd>{" "}
              para cambiar cantidad y{" "}
              <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
                Supr
              </kbd>{" "}
              para eliminar
            </p>
          </div>

          {items.map((item, index) => (
            <div
              key={item.productId}
              ref={(el) => {
                itemRefs.current[index] = el;
                return undefined;
              }}
              className={`cart-item border-b dark:border-gray-700 p-2 hover:bg-accent/5 ${
                selectedItemIndex === index
                  ? "bg-primary/10 dark:bg-primary/20 outline-none ring-1 ring-primary"
                  : ""
              } transition-all`}
              onClick={() => handleItemClick(index)}
              tabIndex={-1}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item, item.quantity - 1);
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item, item.quantity + 1);
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.productId);
                        if (selectedItemIndex === index) {
                          setSelectedItemIndex(Math.max(0, items.length - 2));
                        }
                      }}
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

const CartView = memo(CartViewComponent);
CartView.displayName = "CartView";

export default CartView;
