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

    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : products.length - 1;
    if (products[newIndex]) {
      toast.info(`Seleccionado: ${products[newIndex].name}`);
    }
  };

  // Función para navegar hacia abajo en la lista
  const handleNavigateDown = () => {
    if (products.length === 0) return;

    setSelectedIndex((prev) => {
      if (prev === -1 || prev >= products.length - 1) return 0;
      return prev + 1;
    });

    const newIndex =
      selectedIndex < products.length - 1 ? selectedIndex + 1 : 0;
    if (products[newIndex]) {
      toast.info(`Seleccionado: ${products[newIndex].name}`);
    }
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
        toast.info(`Cantidad: ${quantity + 1}`);
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
        toast.info(`Cantidad: ${quantity - 1}`);
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
          toast.info("Volviendo a la lista de productos");
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
      } else if (data.products?.length > 0) {
        setSelectedIndex(0);
        setIsNavigating(true);
      } else {
        setSelectedProduct(null);
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
    <div className="product-search">
      <div className="flex items-center space-x-2 mb-3">
        <input
          ref={effectiveInputRef}
          type="text"
          className="border dark:border-gray-600 dark:bg-gray-800 rounded p-2 flex-1"
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Buscar producto"
          aria-label="Buscar producto"
          onFocus={() => setIsNavigating(false)}
          onBlur={() => products.length > 0 && setIsNavigating(true)}
        />

        <button
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          onClick={searchProducts}
          disabled={loading}
          aria-label="Buscar productos"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {products.length > 0 && (
        <div
          ref={productListRef}
          className="product-list mb-4 max-h-40 overflow-y-auto border dark:border-gray-700 rounded"
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
              className={`p-2 cursor-pointer border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all ${
                selectedIndex === index
                  ? "bg-blue-100 dark:bg-blue-900/50 outline-none ring-2 ring-blue-500 transform scale-[1.01]"
                  : ""
              }`}
              onClick={() => handleSelectProduct(product, index)}
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={0}
              onKeyDown={(e) => {
                // Solo manejamos Enter y ArrowRight en los elementos de la lista
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
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {product.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ${product.sellingPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs ${
                      product.stock > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
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
        <div className="add-to-cart flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border dark:border-gray-700 transition-all animate-fadeIn">
          <div className="flex-1">
            <p className="font-bold">{selectedProduct.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ${selectedProduct.sellingPrice.toFixed(2)} c/u
            </p>
          </div>

          <input
            type="number"
            ref={quantityInputRef}
            className="border dark:border-gray-600 dark:bg-gray-800 rounded p-2 w-20"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            min="1"
            max={selectedProduct.stock}
            aria-label="Cantidad"
            onKeyDown={(e) => {
              // Atajo para volver a la lista o confirmar
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

          <div className="flex flex-col space-y-2">
            <button
              ref={addButtonRef}
              className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
              onClick={handleAddToCart}
              aria-label="Agregar al carrito"
            >
              <span className="mr-1">Agregar</span>
              <kbd className="px-1 bg-green-700 dark:bg-green-800 text-xs rounded">
                Alt+A
              </kbd>
            </button>

            <button
              className="text-red-500 dark:text-red-400 border border-red-300 dark:border-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center text-sm"
              onClick={() => {
                setSelectedProduct(null);
                setQuantity(1);
                setSelectedIndex(-1);
                effectiveInputRef.current?.focus();
                toast.info("Producto deseleccionado");
              }}
              aria-label="Cancelar selección"
            >
              <span className="mr-1">Cancelar</span>
              <kbd className="px-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs rounded">
                Alt+X
              </kbd>
            </button>
          </div>
        </div>
      )}

      {products.length > 0 && !selectedProduct && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
