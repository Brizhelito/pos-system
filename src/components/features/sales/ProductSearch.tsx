import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/Products";
import { SaleItem } from "@/types/Sale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, ShoppingCart, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Assuming this function exists in your ProductService
import { getProducts } from "@/services/ProductService";

interface ProductSearchProps {
  cartItems: SaleItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  totalAmount: number;
}

export function ProductSearch({
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  totalAmount,
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.category && product.category.name.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Initialize product quantities
  useEffect(() => {
    const quantities: Record<number, number> = {};
    products.forEach((product) => {
      quantities[product.id] = 1;
    });
    setProductQuantities(quantities);
  }, [products]);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

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
    return products.find((p) => p.id === productId);
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
    const cartItem = cartItems.find((item) => item.productId === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    return product.stock >= quantity + cartQuantity;
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="cart" className="relative">
            Carrito
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cartItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar producto por nombre, descripción o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchQuery.trim() !== "" ? (
                  <p>No se encontraron productos que coincidan con la búsqueda.</p>
                ) : (
                  <p>No hay productos registrados.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`h-full ${isInCart(product.id) ? 'border-primary' : ''}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{product.category?.name || 'Sin categoría'}</Badge>
                          <span className="font-bold text-lg">${product.sellingPrice.toFixed(2)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span>Stock: {product.stock}</span>
                          {isInCart(product.id) && (
                            <Badge variant="secondary">
                              En carrito: {getCartQuantity(product.id)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, productQuantities[product.id] - 1)}
                              disabled={productQuantities[product.id] <= 1}
                            >
                              <Minus size={16} />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={product.stock}
                              value={productQuantities[product.id] || 1}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, productQuantities[product.id] + 1)}
                              disabled={productQuantities[product.id] >= product.stock}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                          <Button
                            onClick={() => {
                              const quantity = productQuantities[product.id] || 1;
                              if (hasEnoughStock(product, quantity)) {
                                onAddToCart(product, quantity);
                              } else {
                                toast.error(`Stock insuficiente para ${product.name}`);
                              }
                            }}
                            disabled={product.stock === 0}
                            className="gap-2"
                          >
                            <ShoppingCart size={16} />
                            <span>Agregar</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="cart" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resumen del Carrito</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                  <p>El carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="text-center">Cantidad</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map((item) => {
                          const product = findProduct(item.productId);
                          return (
                            <TableRow key={item.productId}>
                              <TableCell className="font-medium">{product?.name || `Producto #${item.productId}`}</TableCell>
                              <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleCartQuantityChange(item.productId, item.quantity - 1)}
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
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
                                    <Plus size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => onRemoveFromCart(item.productId)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  <Separator />

                  <div className="flex justify-between items-center font-bold text-lg pt-2">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
