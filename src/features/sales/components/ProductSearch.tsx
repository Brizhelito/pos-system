"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import { Product, CartItem } from "../types";
import SALES_API_ROUTES from "../api/routes";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

interface ProductSearchProps {
  onAddToCart: (item: CartItem) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const ProductSearch = ({ onAddToCart, inputRef }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const internalSearchInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const productListRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Usar la referencia externa si se proporciona, o la interna si no
  const effectiveInputRef = inputRef || internalSearchInputRef;

  // Focus automático en el campo de búsqueda al cargar
  useEffect(() => {
    effectiveInputRef.current?.focus();
  }, [effectiveInputRef]);

  // Efecto para scroll automático al navegar la lista
  useEffect(() => {
    if (selectedIndex >= 0 && productRefs.current[selectedIndex]) {
      productRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Función para navegar hacia arriba en la lista
  const handleNavigateUp = () => {
    if (products.length === 0) return;

    setSelectedIndex((prev) => {
      if (prev <= 0) return products.length - 1;
      return prev - 1;
    });
  };

  // Función para navegar hacia abajo en la lista
  const handleNavigateDown = () => {
    if (products.length === 0) return;

    setSelectedIndex((prev) => {
      if (prev === -1 || prev >= products.length - 1) return 0;
      return prev + 1;
    });
  };

  // Función para seleccionar el producto actual
  const handleSelectCurrentProduct = () => {
    if (products.length > 0 && selectedIndex >= 0 && !selectedProduct) {
      setSelectedProduct(products[selectedIndex]);
      setTimeout(() => quantityInputRef.current?.focus(), 100);
      toast.info(`Producto seleccionado: ${products[selectedIndex].name}`);
    }
  };

  // Control de navegación por teclado con useHotkeys (mantenerlos como respaldo)
  useHotkeys(
    "right",
    () => {
      if (products.length > 0 && selectedIndex >= 0 && !selectedProduct) {
        handleSelectCurrentProduct();
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled:
        products.length > 0 &&
        selectedIndex >= 0 &&
        !selectedProduct &&
        isNavigating,
    }
  );

  // Atajo para aumentar cantidad
  useHotkeys(
    "alt+up, alt+=, alt+plus",
    () => {
      if (selectedProduct && quantity < selectedProduct.stock) {
        setQuantity((prev) => prev + 1);
        if (quantity + 1 === 5 || (quantity + 1) % 10 === 0) {
          toast.info(`Cantidad: ${quantity + 1}`);
        }
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled: !!selectedProduct,
    }
  );

  // Atajo para disminuir cantidad
  useHotkeys(
    "alt+down, alt+-",
    () => {
      if (selectedProduct && quantity > 1) {
        setQuantity((prev) => prev - 1);
        if (quantity - 1 === 1) {
          toast.info(`Cantidad: ${quantity - 1}`);
        }
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled: !!selectedProduct,
    }
  );

  // Atajo para agregar directamente al carrito
  useHotkeys(
    "alt+a",
    () => {
      if (selectedProduct) {
        handleAddToCart();
        toast.success("Producto añadido al carrito");
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled: !!selectedProduct,
    }
  );

  // Atajo para seleccionar el producto seleccionado
  useHotkeys(
    "enter",
    () => {
      if (products.length > 0 && selectedIndex >= 0 && !selectedProduct) {
        setSelectedProduct(products[selectedIndex]);
        setTimeout(() => quantityInputRef.current?.focus(), 100);
      } else if (selectedProduct) {
        handleAddToCart();
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled:
        ((products.length > 0 && selectedIndex >= 0) || !!selectedProduct) &&
        isNavigating,
    }
  );

  // Atajo para cancelar la selección del producto
  useHotkeys(
    "alt+x",
    () => {
      if (selectedProduct) {
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedIndex(-1);
        effectiveInputRef.current?.focus();
        toast.info("Producto deseleccionado");
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled: !!selectedProduct,
    }
  );

  // Atajo para moverse entre secciones - al presionar izquierda en un producto seleccionado
  // volvemos a la lista de productos
  useHotkeys(
    "left",
    () => {
      if (selectedProduct) {
        // Volver a la lista de productos
        const currentIndex = products.findIndex(
          (p) => p.id === selectedProduct.id
        );
        if (currentIndex >= 0) {
          setSelectedProduct(null);
          setSelectedIndex(currentIndex);
          // Enfocar el item en la lista
          setTimeout(() => {
            const element = productRefs.current[currentIndex];
            if (element) {
              element.focus();
              element.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }, 100);
        }
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enabled: !!selectedProduct && products.length > 0,
    }
  );

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setLoading(true);
    setSelectedIndex(-1);

    try {
      // Llamada a la API para buscar productos
      const response = await fetch(
        `${SALES_API_ROUTES.PRODUCT_SEARCH}?term=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProducts(data.products || []);

      // Si solo hay un producto, seleccionarlo automáticamente
      if (data.products?.length === 1) {
        setSelectedProduct(data.products[0]);
        setSelectedIndex(0);
        setTimeout(() => quantityInputRef.current?.focus(), 100);
        toast.info(`Producto encontrado: ${data.products[0].name}`);
      } else if (data.products?.length > 0) {
        setSelectedIndex(0);
        setIsNavigating(true);
        toast.info(`${data.products.length} productos encontrados`);
      } else {
        setSelectedProduct(null);
        toast.info("No se encontraron productos");
      }
    } catch (error) {
      console.error("Error al buscar productos:", error);
      toast.error("Error al buscar productos");
    } finally {
      setLoading(false);
    }
  };

  // Manejador para teclas de entrada en campo de búsqueda
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchProducts();
      return;
    }

    // Activar modo navegación si tenemos productos y presionamos flechas
    if (products.length > 0) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsNavigating(true);
        handleNavigateUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsNavigating(true);
        handleNavigateDown();
      } else if (e.key === "ArrowRight" && selectedIndex >= 0) {
        e.preventDefault();
        handleSelectCurrentProduct();
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error("Seleccione un producto");
      return;
    }

    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    if (quantity > selectedProduct.stock) {
      toast.error(`Stock insuficiente. Disponible: ${selectedProduct.stock}`);
      return;
    }

    const cartItem: CartItem = {
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: quantity,
      unitPrice: selectedProduct.sellingPrice,
      subtotal: selectedProduct.sellingPrice * quantity,
    };

    onAddToCart(cartItem);

    // Reiniciar para nueva búsqueda
    setSearchTerm("");
    setQuantity(1);
    setSelectedProduct(null);
    setProducts([]);
    setSelectedIndex(-1);
    setIsNavigating(false);
    effectiveInputRef.current?.focus();
  };

  const handleSelectProduct = (product: Product, index: number) => {
    setSelectedProduct(product);
    setSelectedIndex(index);
    setTimeout(() => quantityInputRef.current?.focus(), 100);
  };

  // Reestablecer el modo de navegación cuando se cambia el texto
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsNavigating(false);
  };

  return (
    <div className="product-search flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-0">
          <input
            ref={effectiveInputRef}
            type="text"
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md pl-3 pr-8 py-2 w-full text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Buscar producto por nombre o código"
            aria-label="Buscar producto"
            onFocus={() => setIsNavigating(false)}
            onBlur={() => products.length > 0 && setIsNavigating(true)}
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => {
                setSearchTerm("");
                effectiveInputRef.current?.focus();
              }}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        <button
          className="bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm flex items-center gap-1"
          onClick={searchProducts}
          disabled={loading}
          aria-label="Buscar productos"
        >
          <span className="hidden sm:inline">
            {loading ? "Buscando..." : "Buscar"}
          </span>
          <span className="inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>

      {products.length > 0 && (
        <div
          ref={productListRef}
          className="product-list mb-3 flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md shadow-sm"
          role="listbox"
          aria-label="Lista de productos"
          onFocus={() => setIsNavigating(true)}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                productRefs.current[index] = el;
              }}
              className={`p-2 cursor-pointer border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all ${
                selectedIndex === index
                  ? "bg-primary/10 dark:bg-primary/20 outline-none ring-1 ring-primary"
                  : ""
              }`}
              onClick={() => handleSelectProduct(product, index)}
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "ArrowRight") {
                  e.preventDefault();
                  handleSelectProduct(product, index);
                }
              }}
              onFocus={() => {
                setSelectedIndex(index);
                setIsNavigating(true);
              }}
            >
              <div className="flex justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm whitespace-nowrap">
                    ${product.sellingPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs whitespace-nowrap ${
                      product.stock > 0
                        ? "text-green-600 dark:text-green-500"
                        : "text-red-600 dark:text-red-500"
                    }`}
                  >
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="add-to-cart flex flex-col bg-accent/30 dark:bg-accent/10 p-3 rounded-md border border-accent/20 dark:border-accent/20 shadow-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm truncate">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-muted-foreground">
                ${selectedProduct.sellingPrice.toFixed(2)} c/u
              </p>
            </div>

            <button
              className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-sm shadow-sm ml-2"
              onClick={() => {
                setSelectedProduct(null);
                setQuantity(1);
                setSelectedIndex(-1);
                effectiveInputRef.current?.focus();
                toast.info("Producto deseleccionado");
              }}
              aria-label="Cancelar selección"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
              <span className="sr-only">Cancelar</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden shadow-sm">
              <button
                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center h-8 w-8"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
                </svg>
              </button>

              <input
                type="number"
                ref={quantityInputRef}
                className="w-12 h-8 text-center border-0 dark:bg-gray-800 text-sm focus:ring-0 focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="1"
                max={selectedProduct.stock}
                aria-label="Cantidad"
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    const event = new KeyboardEvent("keydown", { key: "left" });
                    window.dispatchEvent(event);
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddToCart();
                  }
                }}
              />

              <button
                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center h-8 w-8"
                onClick={() =>
                  quantity < selectedProduct.stock && setQuantity(quantity + 1)
                }
                disabled={quantity >= selectedProduct.stock}
                aria-label="Aumentar cantidad"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                </svg>
              </button>
            </div>

            <button
              ref={addButtonRef}
              className="bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm flex items-center gap-1 flex-1 justify-center"
              onClick={handleAddToCart}
              aria-label="Agregar al carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Agregar</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-primary-foreground/20 text-primary-foreground text-xs rounded ml-1">
                Alt+A
              </kbd>
            </button>
          </div>
        </div>
      )}

      {products.length > 0 && !selectedProduct && (
        <div className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block mt-2">
          <p>
            Usa{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>{" "}
            para navegar,{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">→</kbd> o{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
              Enter
            </kbd>{" "}
            para seleccionar producto
          </p>
        </div>
      )}

      {selectedProduct && (
        <div className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block mt-2">
          <p>
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
              Alt+↑
            </kbd>{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
              Alt+↓
            </kbd>{" "}
            para cambiar cantidad,{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
              Alt+A
            </kbd>{" "}
            para agregar,{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">←</kbd> o{" "}
            <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">
              Alt+X
            </kbd>{" "}
            para cancelar
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
 