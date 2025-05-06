import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/Products";
import { SaleItem } from "@/types/Sale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  CircleDollarSign,
  BarChart3,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";

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

export function ProductSearch({
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

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Número de productos por página

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
    
    const quantities: Record<number, number> = {};
    products.forEach((product) => {
      quantities[product.id] = 1;
    });
    setProductQuantities(quantities);
  }, [products]);

  // Handle quantity change for a product
  const handleQuantityChange = (productId: number, value: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, value),
    }));
  };

  // Handle quantity change for a cart item
  const handleCartQuantityChange = (productId: number, value: number) => {
    if (value < 1) {
      onRemoveFromCart(productId);
    } else {
      onUpdateQuantity(productId, value);
    }
  };

  // Find product by ID
  const findProduct = (productId: number): Product | undefined => {
    return products?.find((p) => p.id === productId);
  };

  // Check if product is in cart
  const isInCart = (productId: number): boolean => {
    return cartItems.some((item) => item.productId === productId);
  };

  // Get quantity of product in cart
  const getCartQuantity = (productId: number): number => {
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Check if product has enough stock
  const hasEnoughStock = (product: Product, quantity: number): boolean => {
    return product.stock >= quantity;
  };

  // Handle adding currently selected product to cart
  const handleAddToCart = useCallback(() => {
    if (selectedProduct && hasEnoughStock(selectedProduct, productQuantities[selectedProduct.id] || 1)) {
      onAddToCart(selectedProduct, productQuantities[selectedProduct.id] || 1);
      toast.success(`${selectedProduct.name} agregado al carrito`);
      setSelectedProduct(null); // Clear selection after adding to cart
    } else if (selectedProduct) {
      toast.error("Stock insuficiente");
    }
  }, [selectedProduct, productQuantities, onAddToCart]);

  // Cálculo de productos por página
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  // Effect to update selectedProduct based on selectedIndex
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < paginatedProducts.length) {
      setSelectedProduct(paginatedProducts[selectedIndex]);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedIndex, paginatedProducts]);

  // Effect to reset selectedIndex when filtered products change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredProducts, currentPage]);

  // Effect to reset cart selection when changing tabs
  useEffect(() => {
    if (activeTab === 'products') {
      setSelectedCartItemIndex(-1);
    } else if (activeTab === 'cart') {
      setSelectedIndex(-1);
      setSelectedProduct(null);
      // Seleccionar el primer ítem del carrito si hay alguno
      if (cartItems.length > 0) {
        setSelectedCartItemIndex(0);
      }
    }
  }, [activeTab, cartItems.length]);

  // Implementar atajos de teclado para navegación y acciones comunes
  useHotkeys('alt+f', () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Enfocar búsqueda'
  });
  
  // Navegación con teclado para productos
  useHotkeys('arrowleft', () => {
    if (activeTab === 'products') {
      setSelectedIndex(prev => {
        // Lógica para moverse a la izquierda pero dentro de la misma fila
        const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        if (prev % columns === 0) {
          // Si estamos al inicio de una fila, ir al final de la fila anterior
          const newRow = Math.ceil(prev / columns) - 1;
          const maxIndex = Math.min(paginatedProducts.length - 1, (newRow + 1) * columns - 1);
          return Math.max(0, maxIndex);
        }
        return Math.max(0, prev - 1);
      });
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'products',
    preventDefault: true,
    description: 'Navegar izquierda'
  });
  
  useHotkeys('arrowright', () => {
    if (activeTab === 'products') {
      setSelectedIndex(prev => {
        const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        if ((prev + 1) % columns === 0 || prev === paginatedProducts.length - 1) {
          // Si estamos al final de una fila o al final de todos los productos, ir al inicio de la siguiente fila
          const newRow = Math.floor(prev / columns) + 1;
          const newIndex = newRow * columns;
          return Math.min(paginatedProducts.length - 1, newIndex);
        }
        return Math.min(paginatedProducts.length - 1, prev + 1);
      });
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'products',
    preventDefault: true,
    description: 'Navegar derecha'
  });
  
  useHotkeys('arrowup', () => {
    if (activeTab === 'products') {
      setSelectedIndex(prev => {
        const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        // Moverse hacia arriba
        return Math.max(0, prev - columns);
      });
    } else if (activeTab === 'cart') {
      setSelectedCartItemIndex(prev => Math.max(0, prev - 1));
    }
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Navegar arriba'
  });
  
  useHotkeys('arrowdown', () => {
    if (activeTab === 'products') {
      setSelectedIndex(prev => {
        const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        // Moverse hacia abajo
        return Math.min(paginatedProducts.length - 1, prev + columns);
      });
    } else if (activeTab === 'cart') {
      setSelectedCartItemIndex(prev => Math.min(cartItems.length - 1, prev + 1));
    }
  }, {
    enableOnFormTags: true,
    enabled: true,
    preventDefault: true,
    description: 'Navegar abajo'
  });
  
  useHotkeys('enter', () => {
    if (activeTab === 'products' && selectedProduct) {
      handleAddToCart();
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'products' && !!selectedProduct,
    preventDefault: true,
    description: 'Agregar producto seleccionado'
  });
  
  useHotkeys('tab', () => {
    setActiveTab(prev => prev === 'products' ? 'cart' : 'products');
  }, {
    enableOnFormTags: false,
    enabled: true,
    preventDefault: true,
    description: 'Cambiar entre productos y carrito'
  });
  
  useHotkeys('alt+a', () => {
    if (selectedProduct) {
      handleAddToCart();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!selectedProduct,
    preventDefault: true,
    description: 'Agregar producto seleccionado'
  });
  
  useHotkeys('alt+enter', () => {
    if (onContinue) {
      onContinue();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!onContinue,
    preventDefault: true,
    description: 'Continuar'
  });
  
  useHotkeys('escape', () => {
    if (onBack) {
      onBack();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!onBack,
    preventDefault: true,
    description: 'Volver'
  });

  useHotkeys('enter', () => {
    if (activeTab === 'products' && selectedProduct) {
      handleAddToCart();
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'products' && !!selectedProduct,
    preventDefault: true,
    description: 'Agregar producto seleccionado'
  });
  
  // Teclas para manipular cantidades en el carrito
  useHotkeys('plus, =', () => {
    if (activeTab === 'cart' && selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
      const item = cartItems[selectedCartItemIndex];
      const product = findProduct(item.productId);
      if (product && item.quantity < product.stock) {
        handleCartQuantityChange(item.productId, item.quantity + 1);
      } else {
        toast.error("Stock insuficiente");
      }
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'cart' && selectedCartItemIndex >= 0,
    preventDefault: true,
    description: 'Aumentar cantidad'
  });
  
  useHotkeys('minus, -', () => {
    if (activeTab === 'cart' && selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
      const item = cartItems[selectedCartItemIndex];
      if (item.quantity > 1) {
        handleCartQuantityChange(item.productId, item.quantity - 1);
      }
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'cart' && selectedCartItemIndex >= 0,
    preventDefault: true,
    description: 'Disminuir cantidad'
  });
  
  useHotkeys('delete, backspace', () => {
    if (activeTab === 'cart' && selectedCartItemIndex >= 0 && selectedCartItemIndex < cartItems.length) {
      const item = cartItems[selectedCartItemIndex];
      onRemoveFromCart(item.productId);
      // Ajustar el índice seleccionado si eliminamos el último ítem
      if (selectedCartItemIndex >= cartItems.length - 1 && selectedCartItemIndex > 0) {
        setSelectedCartItemIndex(selectedCartItemIndex - 1);
      }
      toast.success("Producto eliminado del carrito");
    }
  }, {
    enableOnFormTags: true,
    enabled: activeTab === 'cart' && selectedCartItemIndex >= 0,
    preventDefault: true,
    description: 'Eliminar producto'
  });
  
  useHotkeys('tab', () => {
    setActiveTab(prev => prev === 'products' ? 'cart' : 'products');
  }, {
    enableOnFormTags: false,
    enabled: true,
    preventDefault: true,
    description: 'Cambiar entre productos y carrito'
  });
  
  useHotkeys('alt+a', () => {
    if (selectedProduct) {
      handleAddToCart();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!selectedProduct,
    preventDefault: true,
    description: 'Agregar producto seleccionado'
  });
  
  useHotkeys('alt+enter', () => {
    if (onContinue) {
      onContinue();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!onContinue,
    preventDefault: true,
    description: 'Continuar'
  });
  
  useHotkeys('escape', () => {
    if (onBack) {
      onBack();
    }
  }, {
    enableOnFormTags: true,
    enabled: !!onBack,
    preventDefault: true,
    description: 'Volver'
  });

  return (
    <div className="space-y-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="products" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <PackageOpen className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="cart" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrito {cartItems.length > 0 && <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">{cartItems.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          <div className="space-y-4">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-full border-muted"
                  ref={searchInputRef}
                />
              </div>
              {categories.length > 0 && (
                <div className="flex overflow-x-auto pb-1 gap-1 sm:max-w-[50%]">
                  <Button 
                    variant={selectedCategory === null ? "default" : "outline"} 
                    size="sm"
                    className="rounded-full shrink-0 h-11 px-4"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Todos
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="rounded-full shrink-0 h-11 px-4"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive">
                <p>Error al cargar los productos. Intente nuevamente.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <PackageOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-lg font-medium">No se encontraron productos</p>
                <p className="text-sm">Intente con otra búsqueda o categoría</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Productos grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="h-full"
                    >
                      <Card className="h-full flex flex-col hover:shadow-md transition-shadow border overflow-hidden">
                        {product.stock < 5 && (
                          <div className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs px-2 py-0.5 absolute right-2 top-2 rounded-full">
                            ¡Últimas unidades!
                          </div>
                        )}
                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent 
                          className={cn(
                            "p-3 pt-1 flex-grow flex flex-col cursor-pointer",
                            selectedProduct?.id === product.id && "bg-emerald-50 dark:bg-emerald-950 ring-2 ring-emerald-500 ring-inset"
                          )}
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedIndex(index);
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <CircleDollarSign className="h-4 w-4 text-emerald-500 mr-1" />
                              <span className="font-bold text-lg">${product.sellingPrice.toFixed(2)}</span>
                            </div>
                            {product.category && (
                              <Badge variant="secondary" className="text-xs">
                                {product.category.name}
                              </Badge>
                            )}
                          </div>
                          
                          {product.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          
                          <div className="flex items-center mt-auto">
                            <Badge variant={product.stock > 0 ? "outline" : "destructive"} className={cn(
                              "text-xs",
                              product.stock > 0 ? "bg-green-50 text-green-700 border-green-200" : ""
                            )}>
                              <BarChart3 className="h-3 w-3 mr-1" />
                              {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0 border-t flex justify-between items-center">
                          {product.stock > 0 ? (
                            isInCart(product.id) ? (
                              <div className="flex items-center space-x-1 w-full">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleCartQuantityChange(product.id, getCartQuantity(product.id) - 1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-8 text-center">{getCartQuantity(product.id)}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    if (hasEnoughStock(product, getCartQuantity(product.id) + 1)) {
                                      handleCartQuantityChange(product.id, getCartQuantity(product.id) + 1);
                                    } else {
                                      toast.error("Stock insuficiente");
                                    }
                                  }}
                                  disabled={!hasEnoughStock(product, getCartQuantity(product.id) + 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8 ml-auto"
                                  onClick={() => onRemoveFromCart(product.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center w-full">
                                <div className="flex items-center space-x-1 mr-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleQuantityChange(product.id, productQuantities[product.id] - 1)}
                                    disabled={productQuantities[product.id] <= 1}
                                  >
                                    <Minus size={12} />
                                  </Button>
                                  <span className="w-6 text-center text-sm">{productQuantities[product.id] || 1}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleQuantityChange(product.id, productQuantities[product.id] + 1)}
                                    disabled={!hasEnoughStock(product, (productQuantities[product.id] || 1) + 1)}
                                  >
                                    <Plus size={12} />
                                  </Button>
                                </div>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="ml-auto bg-emerald-500 hover:bg-emerald-600"
                                  onClick={() => {
                                    if (hasEnoughStock(product, productQuantities[product.id] || 1)) {
                                      onAddToCart(product, productQuantities[product.id] || 1);
                                      toast.success(`${product.name} agregado al carrito`);
                                    } else {
                                      toast.error("Stock insuficiente");
                                    }
                                  }}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Agregar
                                </Button>
                              </div>
                            )
                          ) : (
                            <Button disabled className="w-full" variant="outline">
                              Sin stock
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="icon"
                          className={`h-8 w-8 ${currentPage === i + 1 ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cart" className="mt-0">
          <Card className="shadow-md border overflow-hidden">
            <CardHeader className="p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center">
                  <ShoppingCart className="h-5 w-5 text-emerald-500 mr-2" />
                  Productos en el carrito
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <div className="bg-muted/30 mx-auto mb-4 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Tu carrito está vacío</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Agrega productos para continuar con la venta
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => setActiveTab("products")}
                  >
                    Ver productos
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y"
                >
                  <ScrollArea className="h-[300px] sm:h-[350px]">
                    {cartItems.map((item, index) => {
                      const product = findProduct(item.productId);
                      return (
                        <motion.div 
                          key={item.productId} 
                          variants={itemVariants}
                          className={cn(
                            "p-4 hover:bg-muted/20",
                            selectedCartItemIndex === index && "bg-emerald-50 dark:bg-emerald-950 ring-2 ring-emerald-500 ring-inset"
                          )}
                          onClick={() => setSelectedCartItemIndex(index)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex-1">
                              <div className="font-medium mb-0.5">
                                {product?.name || `Producto #${item.productId}`}
                              </div>
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2 text-xs">
                                  {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  ${item.unitPrice.toFixed(2)} c/u
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleCartQuantityChange(item.productId, item.quantity - 1)}
                                >
                                  <Minus size={12} />
                                </Button>
                                <span className="w-7 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    const product = findProduct(item.productId);
                                    if (product && item.quantity < product.stock) {
                                      handleCartQuantityChange(item.productId, item.quantity + 1);
                                    } else {
                                      toast.error("Stock insuficiente");
                                    }
                                  }}
                                  disabled={product && item.quantity >= product?.stock}
                                >
                                  <Plus size={12} />
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="font-semibold sm:text-right">
                                  ${item.subtotal.toFixed(2)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                  onClick={() => onRemoveFromCart(item.productId)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </ScrollArea>
                </motion.div>
              )}
            </CardContent>
            {cartItems.length > 0 && (
              <CardFooter className="p-4 bg-muted/10 border-t">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>Subtotal:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span>ITBIS (18%):</span>
                    <span>${(totalAmount * 0.18).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>${(totalAmount * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-between mt-4">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            Volver
            <span className="ml-1 text-xs opacity-70">(Esc)</span>
          </Button>
        )}
        {onContinue && (
          <Button variant="default" size="sm" onClick={onContinue}>
            Continuar
            <span className="ml-1 text-xs opacity-70">(Alt+Enter)</span>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
        <span className="bg-muted px-2 py-1 rounded text-xs">Alt+F: Buscar</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">Alt+A: Agregar</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">Flecha izquierda/derecha: Navegar entre productos</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">Flecha arriba/abajo: Navegar entre elementos</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">Enter: Agregar producto</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">Tab: Cambiar entre productos y carrito</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">+ / -: Aumentar/disminuir cantidad en carrito</span>
        <span className="bg-muted px-2 py-1 rounded text-xs">Delete/Backspace: Eliminar del carrito</span>
      </div>
    </div>
  );
}
