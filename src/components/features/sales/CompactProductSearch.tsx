import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/Products";
import { SaleItem } from "@/types/Sale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, ShoppingCart, Plus, Minus, Trash2, Loader2, FileText, LayoutGrid, ChevronRight, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { cn } from "@/lib/utils";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Error al cargar los datos");
  return res.json();
});

interface ProductSearchProps {
  cartItems: SaleItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  totalAmount: number;
  onContinue?: () => void;
  onBack?: () => void;
}

export function CompactProductSearch({
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  totalAmount,
  onContinue,
  onBack,
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("products");
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedCartItemIndex, setSelectedCartItemIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [gridView, setGridView] = useState(true);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Aumenté el número de productos por página para mostrar más productos de una vez
  
  // Columnas por fila (responsive)
  const colsPerRow = 4;

  // Fetch products using SWR
  const { data: products, error, isLoading } = useSWR<Product[]>(
    '/api/products', 
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 segundos
    }
  );

  // Obtener categorías únicas
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set<string>();
    products.forEach(product => {
      if (product.category?.name) {
        uniqueCategories.add(product.category.name);
      }
    });
    return Array.from(uniqueCategories);
  }, [products]);

  // Filter products when search query or category changes
  useEffect(() => {
    if (!products) {
      setFilteredProducts([]);
      return;
    }
    
    let filtered = [...products];
    
    // Filtrar por búsqueda
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.category && product.category.name.toLowerCase().includes(query))
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category?.name === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Resetea la página cuando cambia la búsqueda o categoría
  }, [searchQuery, selectedCategory, products]);

  // Initialize product quantities
  useEffect(() => {
    if (!products) return;
    
    const initialQuantities: Record<number, number> = {};
    products.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    
    setProductQuantities(initialQuantities);
  }, [products]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // No capturar eventos de teclas si estamos en un input o textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
         document.activeElement.tagName === "TEXTAREA" ||
         document.activeElement.tagName === "SELECT")
      ) {
        return;
      }
      
      // Focus search with Alt+F
      if (e.altKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      
      // Add product with Alt+A
      if (e.altKey && e.key === 'a' && selectedProduct) {
        e.preventDefault();
        handleAddToCart(selectedProduct);
        return;
      }
      
      // Switch tabs with Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        setActiveTab(prev => prev === "products" ? "cart" : "products");
        return;
      }
      
      if (activeTab === "products" && filteredProducts.length > 0) {
        const numProducts = filteredProducts.length;
        const productsPerPage = pageSize;
        
        // Get current page products
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, numProducts);
        const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
        
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (selectedIndex < 0) {
            setSelectedIndex(0);
            setSelectedProduct(currentPageProducts[0]);
          } else {
            const nextIndex = (selectedIndex + 1) % currentPageProducts.length;
            setSelectedIndex(nextIndex);
            setSelectedProduct(currentPageProducts[nextIndex]);
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (selectedIndex < 0) {
            setSelectedIndex(currentPageProducts.length - 1);
            setSelectedProduct(currentPageProducts[currentPageProducts.length - 1]);
          } else {
            const prevIndex = selectedIndex <= 0 ? currentPageProducts.length - 1 : selectedIndex - 1;
            setSelectedIndex(prevIndex);
            setSelectedProduct(currentPageProducts[prevIndex]);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (selectedIndex < 0) {
            setSelectedIndex(0);
            setSelectedProduct(currentPageProducts[0]);
          } else {
            const prevRowIndex = selectedIndex - colsPerRow;
            if (prevRowIndex >= 0) {
              setSelectedIndex(prevRowIndex);
              setSelectedProduct(currentPageProducts[prevRowIndex]);
            } else {
              // Ir a la última fila, misma columna
              const col = selectedIndex % colsPerRow;
              const lastRowIndex = Math.floor((currentPageProducts.length - 1) / colsPerRow) * colsPerRow + col;
              const targetIndex = lastRowIndex < currentPageProducts.length ? lastRowIndex : lastRowIndex - colsPerRow + (currentPageProducts.length % colsPerRow);
              if (targetIndex >= 0 && targetIndex < currentPageProducts.length) {
                setSelectedIndex(targetIndex);
                setSelectedProduct(currentPageProducts[targetIndex]);
              }
            }
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (selectedIndex < 0) {
            setSelectedIndex(0);
            setSelectedProduct(currentPageProducts[0]);
          } else {
            const nextRowIndex = selectedIndex + colsPerRow;
            if (nextRowIndex < currentPageProducts.length) {
              setSelectedIndex(nextRowIndex);
              setSelectedProduct(currentPageProducts[nextRowIndex]);
            } else {
              // Ir a la primera fila, misma columna
              const col = selectedIndex % colsPerRow;
              if (col < currentPageProducts.length) {
                setSelectedIndex(col);
                setSelectedProduct(currentPageProducts[col]);
              }
            }
          }
        } else if (e.key === 'Enter' && selectedProduct) {
          e.preventDefault();
          handleAddToCart(selectedProduct);
        }
      } else if (activeTab === "cart" && cartItems.length > 0) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (selectedCartItemIndex <= 0) {
            setSelectedCartItemIndex(cartItems.length - 1);
          } else {
            setSelectedCartItemIndex(prev => prev - 1);
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (selectedCartItemIndex < 0 || selectedCartItemIndex >= cartItems.length - 1) {
            setSelectedCartItemIndex(0);
          } else {
            setSelectedCartItemIndex(prev => prev + 1);
          }
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          if (selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
            const item = cartItems[selectedCartItemIndex];
            const product = findProduct(item.productId);
            if (product && item.quantity < product.stock) {
              handleCartQuantityChange(item.productId, item.quantity + 1);
            } else {
              toast.error("Stock insuficiente");
            }
          }
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          if (selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
            const item = cartItems[selectedCartItemIndex];
            if (item.quantity > 1) {
              handleCartQuantityChange(item.productId, item.quantity - 1);
            }
          }
        } else if ((e.key === 'Delete' || e.key === 'Backspace') && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          if (selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
            const item = cartItems[selectedCartItemIndex];
            onRemoveFromCart(item.productId);
            if (selectedCartItemIndex >= cartItems.length - 1) {
              setSelectedCartItemIndex(Math.max(0, cartItems.length - 2));
            }
          }
        }
      }
      
      // Navegar por página
      if (e.key === 'PageUp' || (e.ctrlKey && e.key === 'ArrowLeft')) {
        e.preventDefault();
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
          setSelectedIndex(-1);
          setSelectedProduct(null);
        }
      } else if (e.key === 'PageDown' || (e.ctrlKey && e.key === 'ArrowRight')) {
        e.preventDefault();
        const totalPages = Math.ceil(filteredProducts.length / pageSize);
        if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
          setSelectedIndex(-1);
          setSelectedProduct(null);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, cartItems, colsPerRow, currentPage, filteredProducts, onRemoveFromCart, pageSize, selectedCartItemIndex, selectedIndex, selectedProduct]);

  // Handle quantity change for a product
 

  // Handle quantity change for a cart item
  const handleCartQuantityChange = (productId: number, value: number) => {
    const product = findProduct(productId);
    if (product && hasEnoughStock(product, value)) {
      onUpdateQuantity(productId, value);
    }
  };

  // Find product by ID
  const findProduct = (productId: number): Product | undefined => {
    return products?.find(p => p.id === productId);
  };

  // Check if product is in cart
  const isInCart = (productId: number): boolean => {
    return cartItems.some(item => item.productId === productId);
  };

  // Get quantity of product in cart
  const getCartQuantity = (productId: number): number => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Check if product has enough stock
  const hasEnoughStock = (product: Product, quantity: number): boolean => {
    return product.stock >= quantity;
  };

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    const quantity = productQuantities[product.id] || 1;
    
    if (hasEnoughStock(product, quantity)) {
      onAddToCart(product, quantity);
      toast.success(`${product.name} añadido al carrito`);
    } else {
      toast.error(`No hay suficiente stock de ${product.name}`);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  
  // Get current page products
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-2">
      {/* Barra de búsqueda compacta con categorías */}
      <div className="flex gap-1 items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pr-8 text-sm"
            ref={searchInputRef}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full aspect-square"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => setGridView(!gridView)}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </Button>
        
        {/* Modo compacto del carrito */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1", 
            cartItems.length > 0 ? "bg-primary/10 border-primary/30" : ""
          )}
          onClick={() => setActiveTab(prev => prev === "products" ? "cart" : "products")}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {cartItems.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1 text-xs font-normal">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Categorías en chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          <Button
            variant={selectedCategory === null ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="h-6 px-2 text-xs"
          >
            Todos
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-6 px-2 text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      
      {/* Tabs para productos y carrito */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="products" className="m-0 p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-2 text-xs text-destructive bg-destructive/10 rounded-lg">
              Error al cargar productos. Intente nuevamente.
            </div>
          ) : currentPageProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No se encontraron productos</p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  className="mt-1 h-auto p-0 text-xs"
                  onClick={() => setSearchQuery("")}
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Vista de productos */}
              <div className={`grid ${gridView ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-1'} gap-1`}>
                {currentPageProducts.map((product, index) => (
                  <Card
                    key={product.id}
                    className={cn(
                      "overflow-hidden transition-all h-full border-muted",
                      selectedIndex === index ? "ring-2 ring-primary" : "",
                      gridView ? "p-1" : "p-2"
                    )}
                    onClick={() => {
                      setSelectedIndex(index);
                      setSelectedProduct(product);
                    }}
                  >
                    <div className={gridView ? "h-full flex flex-col" : "flex items-center gap-2"}>
                      {/* Información del producto */}
                      <div className={gridView ? "flex-1" : "flex-1 truncate"}>
                        <div className="font-medium text-xs truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          Stock: {product.stock}
                        </div>
                        <div className="text-xs font-semibold">${(product.sellingPrice || 0).toFixed(2)}</div>
                      </div>
                      
                      {/* Controles de cantidad */}
                      <div className={gridView ? "mt-1 flex justify-between items-center" : "flex-shrink-0 flex items-center"}>
                        {!isInCart(product.id) ? (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-6 w-full px-1 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={product.stock <= 0}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Agregar
                          </Button>
                        ) : (
                          <div className="bg-primary/10 text-xs px-1 py-0.5 rounded text-primary font-medium">
                            En carrito: {getCartQuantity(product.id)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <div className="text-xs px-2">
                    Página {currentPage} de {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="cart" className="m-0 p-0">
          <Card className="border-muted overflow-hidden">
            <CardContent className="p-1">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">El carrito está vacío</p>
                  <Button 
                    variant="link" 
                    className="mt-1 h-auto p-0 text-xs"
                    onClick={() => setActiveTab("products")}
                  >
                    Agregar productos
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <ScrollArea className="max-h-[35vh]">
                    {cartItems.map((item, index) => {
                      const product = findProduct(item.productId);
                      return (
                        <motion.div
                          key={item.productId}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={cn(
                            "border-b border-border last:border-0 p-1.5",
                            selectedCartItemIndex === index ? "bg-muted" : ""
                          )}
                          onClick={() => {
                            setSelectedCartItemIndex(index);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs truncate">
                                {product?.name || "Producto no disponible"}
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>${item.subtotal.toFixed(2)} x {item.quantity}</span>
                                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-5 w-5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.quantity > 1) {
                                    handleCartQuantityChange(item.productId, item.quantity - 1);
                                  }
                                }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={10} />
                              </Button>
                              
                              <span className="text-xs font-medium w-4 text-center">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-5 w-5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const product = findProduct(item.productId);
                                  if (product && item.quantity < product.stock) {
                                    handleCartQuantityChange(item.productId, item.quantity + 1);
                                  } else {
                                    toast.error("Stock insuficiente");
                                  }
                                }}
                                disabled={product && item.quantity >= product?.stock}
                              >
                                <Plus size={10} />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveFromCart(item.productId);
                                }}
                              >
                                <Trash2 size={10} />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </ScrollArea>
                  
                  {/* Resumen compacto */}
                  <div className="border-t pt-1.5 pb-1 px-1.5 bg-muted/30 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ITBIS (18%):</span>
                      <span>${(totalAmount * 0.18).toFixed(2)}</span>
                    </div>
                    <Separator className="my-1 h-px" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${(totalAmount * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Botones de navegación en línea */}
      <div className="flex justify-between gap-2">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack} className="h-7 px-2 text-xs">
            <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Volver
          </Button>
        )}
        
        {cartItems.length > 0 && onContinue && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onContinue} 
            className="h-7 px-2 text-xs ml-auto"
          >
            Continuar <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {/* Atajos de teclado - Mostrados en una línea */}
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
        <kbd className="px-1 py-0.5 bg-muted/50 rounded">↑/↓/←/→: Navegar</kbd>
        <kbd className="px-1 py-0.5 bg-muted/50 rounded">Enter: Agregar</kbd>
        <kbd className="px-1 py-0.5 bg-muted/50 rounded">Tab: Cambiar vista</kbd>
        <kbd className="px-1 py-0.5 bg-muted/50 rounded">+/-: Ajustar cantidad</kbd>
        <kbd className="px-1 py-0.5 bg-muted/50 rounded">Del: Eliminar</kbd>
        <kbd className="px-1 py-0.5 bg-muted/50 rounded">Alt+F: Buscar</kbd>
      </div>
    </div>
  );
}
