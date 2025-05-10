import prisma from "@/lib/db/prisma";

export interface InventoryValueData {
  totalValue: number;
  categories: {
    name: string;
    value: number;
    percentage: number;
  }[];
}

export interface InventoryTurnoverItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  soldQuantity: number;
  turnoverRate: number;
}

export interface InventoryItem {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  valorTotal: number;
  ultimaVenta: Date | null;
  rotacion: string;
}

export interface CategorySummary {
  categoria: string;
  productos: number;
  valorTotal: number;
  porcentaje: number;
}

// Nuevas interfaces para reportes avanzados
export interface StockPredictionItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  dailyConsumption: number;
  daysUntilEmpty: number;
  estimatedEmptyDate: Date;
}

export interface EarlyAlertItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  alertLevel: "crítico" | "bajo" | "adecuado";
  daysLeft: number | null;
  reorderQuantity: number;
}

export interface ExcessInventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  optimalStock: number;
  excessStock: number;
  excessCost: number;
  lastSaleDate: Date | null;
  daysSinceLastSale: number | null;
}

export interface InventoryVelocityItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  soldQuantity: number;
  turnoverRate: number;
  daysToSellStock: number | null;
  velocityCategory: "muy rápida" | "rápida" | "media" | "lenta" | "muy lenta";
}

export class InventoryReportService {
  /**
   * Obtiene todos los productos con información de categorías y proveedores
   */
  static async getAllInventory() {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
          provider: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return products;
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      throw error;
    }
  }

  /**
   * Obtiene productos con stock bajo (menor o igual al stock mínimo)
   */
  static async getLowStockInventory() {
    try {
      const products = await prisma.product.findMany({
        where: {
          stock: {
            lte: prisma.product.fields.minStock,
          },
        },
        include: {
          category: true,
          provider: true,
        },
        orderBy: {
          stock: "asc",
        },
      });

      return products;
    } catch (error) {
      console.error("Error al obtener productos con stock bajo:", error);
      throw error;
    }
  }

  /**
   * Obtiene datos para análisis de valor de inventario
   */
  static async getInventoryValue(): Promise<InventoryValueData> {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      // Calcular valor total del inventario
      const totalValue = products.reduce(
        (sum, product) => sum + Number(product.purchasePrice) * product.stock,
        0
      );

      // Agrupar por categoría
      const categoriesMap = new Map();

      products.forEach((product) => {
        const categoryName = product.category.name;
        const productValue = Number(product.purchasePrice) * product.stock;

        if (!categoriesMap.has(categoryName)) {
          categoriesMap.set(categoryName, {
            name: categoryName,
            value: 0,
            percentage: 0,
          });
        }

        const category = categoriesMap.get(categoryName);
        category.value += productValue;
      });

      // Calcular porcentajes
      categoriesMap.forEach((category) => {
        category.percentage = (category.value / totalValue) * 100;
      });

      return {
        totalValue,
        categories: Array.from(categoriesMap.values()),
      };
    } catch (error) {
      console.error("Error al obtener valor del inventario:", error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de rotación de inventario
   */
  static async getInventoryTurnover(
    startDate: Date,
    endDate: Date
  ): Promise<InventoryTurnoverItem[]> {
    try {
      // Obtener ventas en el período
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calcular unidades vendidas por producto
      const productSalesMap = new Map();

      sales.forEach((sale) => {
        sale.saleitem.forEach((item) => {
          const productId = item.productId;
          const currentAmount = productSalesMap.get(productId) || 0;
          productSalesMap.set(productId, currentAmount + item.quantity);
        });
      });

      // Obtener información actual de los productos
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      // Calcular índice de rotación
      const turnoverData = products.map((product) => {
        const soldQuantity = productSalesMap.get(product.id) || 0;
        const currentStock = product.stock;
        // Si el stock actual es 0, usamos un valor pequeño para evitar división por cero
        const averageStock = currentStock === 0 ? 0.1 : currentStock;
        const turnoverRate = soldQuantity / averageStock;

        return {
          id: product.id,
          name: product.name,
          category: product.category.name,
          stock: currentStock,
          soldQuantity,
          turnoverRate: parseFloat(turnoverRate.toFixed(2)),
        };
      });

      // Ordenar por índice de rotación (de mayor a menor)
      return turnoverData.sort((a, b) => b.turnoverRate - a.turnoverRate);
    } catch (error) {
      console.error("Error al obtener rotación de inventario:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los items de inventario con información detallada
   */
  static async getInventoryItems(
    startDate: Date,
    endDate: Date
  ): Promise<InventoryItem[]> {
    try {
      // Obtener productos
      const products = await this.getAllInventory();

      // Obtener ventas de los productos en el período para determinar última venta y rotación
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          saleDate: "desc",
        },
      });

      // Mapa para última fecha de venta por producto
      const lastSaleDates = new Map();
      // Mapa para cantidad vendida por producto
      const soldQuantities = new Map();

      // Procesar las ventas para extraer información
      sales.forEach((sale) => {
        const saleDate = sale.saleDate;

        sale.saleitem.forEach((item) => {
          const productId = item.productId;

          // Registrar la fecha de venta más reciente
          if (!lastSaleDates.has(productId)) {
            lastSaleDates.set(productId, saleDate);
          }

          // Sumar cantidades vendidas
          const currentQuantity = soldQuantities.get(productId) || 0;
          soldQuantities.set(productId, currentQuantity + item.quantity);
        });
      });

      // Transformar los productos al formato de InventoryItem
      return products.map((product) => {
        const soldQuantity = soldQuantities.get(product.id) || 0;
        const rotacion = this.determinarRotacion(
          product.stock,
          product.minStock,
          soldQuantity
        );

        return {
          id: product.id.toString(),
          nombre: product.name,
          categoria: product.category.name,
          stock: product.stock,
          precio: Number(product.sellingPrice),
          valorTotal: Number(product.sellingPrice) * product.stock,
          ultimaVenta: lastSaleDates.get(product.id) || null,
          rotacion,
        };
      });
    } catch (error) {
      console.error("Error al obtener items de inventario:", error);
      throw error;
    }
  }

  /**
   * Obtiene resumen del inventario por categorías
   */
  static async getInventoryByCategory(): Promise<CategorySummary[]> {
    try {
      // Obtener el valor del inventario agrupado por categoría
      const inventoryValue = await this.getInventoryValue();

      // Obtener el recuento de productos por categoría
      const categories = await prisma.category.findMany();

      // Para cada categoría, contar sus productos
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const count = await prisma.product.count({
            where: {
              categoryId: category.id,
            },
          });
          return {
            name: category.name,
            count,
          };
        })
      );

      // Crear un mapa para buscar rápidamente la cantidad de productos por categoría
      const productCountsMap = new Map();
      categoriesWithCounts.forEach((category) => {
        productCountsMap.set(category.name, category.count);
      });

      // Transformar los datos al formato esperado
      return inventoryValue.categories.map((category) => ({
        categoria: category.name,
        productos: productCountsMap.get(category.name) || 0,
        valorTotal: category.value,
        porcentaje: category.percentage,
      }));
    } catch (error) {
      console.error("Error al obtener resumen por categoría:", error);
      throw error;
    }
  }

  /**
   * Determina la rotación de un producto basada en su stock y ventas
   * @private
   */
  private static determinarRotacion(
    stock: number,
    minStock: number,
    vendidos: number
  ): string {
    // Sin stock
    if (stock === 0) return "Sin stock";

    // Si no hay ventas
    if (vendidos === 0) return "Muy baja";

    // Calcular rotación basada en la relación entre vendidos y stock actual
    const ratio = vendidos / stock;

    if (ratio > 2) return "Alta";
    if (ratio > 1) return "Media";
    if (stock <= minStock) return "Muy baja";
    return "Baja";
  }

  /**
   * Obtiene predicción de agotamiento de stock
   * Calcula cuándo se espera que un producto se quede sin stock basado en tendencias de venta
   */
  static async getStockPrediction(
    startDate: Date,
    endDate: Date
  ): Promise<StockPredictionItem[]> {
    try {
      // Calcular cantidad de días en el rango
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      // Obtener ventas en el período para calcular consumo diario
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calcular consumo diario por producto
      const productSalesMap = new Map();

      sales.forEach((sale) => {
        sale.saleitem.forEach((item) => {
          const productId = item.productId;
          const currentAmount = productSalesMap.get(productId) || 0;
          productSalesMap.set(productId, currentAmount + item.quantity);
        });
      });

      // Obtener información actual de los productos
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      // Calcular predicción para cada producto
      const predictions = products.map((product) => {
        const totalSold = productSalesMap.get(product.id) || 0;

        // Calcular consumo diario (unidades vendidas por día)
        // Evitar división por cero utilizando 1 como mínimo para días
        const safeDaysDiff = Math.max(daysDiff, 1);
        const dailyConsumption = totalSold / safeDaysDiff;

        // Calcular días hasta quedar sin stock
        // Si no hay ventas o consumo diario es 0, establecer como infinito (9999)
        const daysUntilEmpty =
          dailyConsumption > 0
            ? Math.ceil(product.stock / dailyConsumption)
            : 9999;

        // Calcular fecha estimada de agotamiento
        const today = new Date();
        const estimatedEmptyDate = new Date(today);
        estimatedEmptyDate.setDate(today.getDate() + daysUntilEmpty);

        return {
          id: product.id,
          name: product.name,
          category: product.category.name,
          currentStock: product.stock,
          minStock: product.minStock,
          dailyConsumption,
          daysUntilEmpty,
          estimatedEmptyDate,
        };
      });

      // Ordenar por días hasta quedar sin stock (de menor a mayor)
      return predictions
        .filter((p) => p.daysUntilEmpty !== 9999) // Filtrar productos sin consumo
        .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);
    } catch (error) {
      console.error("Error al obtener predicción de stock:", error);
      throw error;
    }
  }

  /**
   * Obtiene productos que pronto llegarán a nivel crítico
   */
  static async getEarlyAlerts(
    startDate: Date,
    endDate: Date
  ): Promise<EarlyAlertItem[]> {
    try {
      // Calcular cantidad de días en el rango
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      // Obtener ventas en el período para calcular consumo diario
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calcular consumo diario por producto
      const productSalesMap = new Map();

      sales.forEach((sale) => {
        sale.saleitem.forEach((item) => {
          const productId = item.productId;
          const currentAmount = productSalesMap.get(productId) || 0;
          productSalesMap.set(productId, currentAmount + item.quantity);
        });
      });

      // Obtener información actual de los productos
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      // Determinar alertas para cada producto
      const alertItems = products.map((product) => {
        const totalSold = productSalesMap.get(product.id) || 0;

        // Calcular consumo diario (unidades vendidas por día)
        const safeDaysDiff = Math.max(daysDiff, 1);
        const dailyConsumption = totalSold / safeDaysDiff;

        // Calcular días restantes hasta llegar al nivel mínimo
        const stockAboveMin = Math.max(0, product.stock - product.minStock);
        const daysLeft =
          dailyConsumption > 0
            ? Math.ceil(stockAboveMin / dailyConsumption)
            : 9999;

        // Determinar nivel de alerta
        let alertLevel: "crítico" | "bajo" | "adecuado";
        if (product.stock <= product.minStock) {
          alertLevel = "crítico";
        } else if (daysLeft <= 7) {
          alertLevel = "bajo";
        } else {
          alertLevel = "adecuado";
        }

        // Calcular cantidad recomendada para reordenar
        // Fórmula simple: (consumo diario * 30 días) - stock actual
        const reorderQuantity = Math.max(
          0,
          Math.ceil(dailyConsumption * 30) - product.stock
        );

        return {
          id: product.id,
          name: product.name,
          category: product.category.name,
          currentStock: product.stock,
          minStock: product.minStock,
          alertLevel,
          daysLeft: daysLeft === 9999 ? null : daysLeft,
          reorderQuantity,
        };
      });

      // Filtrar y ordenar por nivel de alerta y días restantes
      return alertItems
        .filter((item) => item.alertLevel !== "adecuado")
        .sort((a, b) => {
          // Primero por nivel de alerta (crítico > bajo)
          if (a.alertLevel === "crítico" && b.alertLevel !== "crítico")
            return -1;
          if (a.alertLevel !== "crítico" && b.alertLevel === "crítico")
            return 1;

          // Luego por días restantes (ascendente)
          const daysA = a.daysLeft === null ? 9999 : a.daysLeft;
          const daysB = b.daysLeft === null ? 9999 : b.daysLeft;
          return daysA - daysB;
        });
    } catch (error) {
      console.error("Error al obtener alertas tempranas:", error);
      throw error;
    }
  }

  /**
   * Obtiene productos con exceso de inventario que generan costos
   */
  static async getExcessInventory(
    startDate: Date,
    endDate: Date
  ): Promise<ExcessInventoryItem[]> {
    try {
      // Calcular cantidad de días en el rango
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      // Obtener ventas en el período para calcular consumo diario y fechas de última venta
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          saleDate: "desc",
        },
      });

      // Mapas para almacenar datos
      const productSalesMap = new Map(); // Cantidades vendidas
      const productLastSaleMap = new Map(); // Fecha de última venta

      sales.forEach((sale) => {
        const saleDate = sale.saleDate;

        sale.saleitem.forEach((item) => {
          const productId = item.productId;

          // Actualizar cantidad vendida
          const currentAmount = productSalesMap.get(productId) || 0;
          productSalesMap.set(productId, currentAmount + item.quantity);

          // Actualizar fecha de última venta (solo si no existe aún)
          if (!productLastSaleMap.has(productId)) {
            productLastSaleMap.set(productId, saleDate);
          }
        });
      });

      // Obtener información actual de los productos
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      // Calcular productos con exceso de stock
      const excessItems = products.map((product) => {
        const totalSold = productSalesMap.get(product.id) || 0;
        const lastSaleDate = productLastSaleMap.get(product.id) || null;

        // Calcular consumo diario y stock óptimo
        const safeDaysDiff = Math.max(daysDiff, 1);
        const dailyConsumption = totalSold / safeDaysDiff;

        // Stock óptimo: minStock + (consumo diario * 30 días)
        const optimalStock =
          product.minStock + Math.ceil(dailyConsumption * 30);

        // Calcular exceso de stock
        const excessStock = Math.max(0, product.stock - optimalStock);

        // Calcular costo del exceso (asumimos que es el costo de compra)
        const excessCost = excessStock * Number(product.purchasePrice);

        // Calcular días desde la última venta
        const today = new Date();
        let daysSinceLastSale = null;
        if (lastSaleDate) {
          daysSinceLastSale = Math.ceil(
            (today.getTime() - lastSaleDate.getTime()) / (1000 * 3600 * 24)
          );
        }

        return {
          id: product.id,
          name: product.name,
          category: product.category.name,
          currentStock: product.stock,
          optimalStock,
          excessStock,
          excessCost,
          lastSaleDate,
          daysSinceLastSale,
        };
      });

      // Filtrar productos con exceso de stock y ordenar por costo de exceso (de mayor a menor)
      return excessItems
        .filter((item) => item.excessStock > 0)
        .sort((a, b) => b.excessCost - a.excessCost);
    } catch (error) {
      console.error("Error al obtener exceso de inventario:", error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de velocidad de rotación de inventario
   */
  static async getInventoryVelocity(
    startDate: Date,
    endDate: Date
  ): Promise<InventoryVelocityItem[]> {
    try {
      // Calcular cantidad de días en el rango
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      // Obtener ventas en el período
      const sales = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        include: {
          saleitem: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calcular unidades vendidas por producto
      const productSalesMap = new Map();

      sales.forEach((sale) => {
        sale.saleitem.forEach((item) => {
          const productId = item.productId;
          const currentAmount = productSalesMap.get(productId) || 0;
          productSalesMap.set(productId, currentAmount + item.quantity);
        });
      });

      // Obtener información actual de los productos
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      // Calcular velocidad de rotación para cada producto
      const velocityData = products.map((product) => {
        const soldQuantity = productSalesMap.get(product.id) || 0;
        const currentStock = product.stock;

        // Si el stock actual es 0, usamos un valor pequeño para evitar división por cero
        const averageStock = currentStock === 0 ? 0.1 : currentStock;

        // Calcular índice de rotación
        const turnoverRate = soldQuantity / averageStock;

        // Calcular días para vender todo el stock actual
        let daysToSellStock = 9999;
        if (soldQuantity > 0) {
          const dailySales = soldQuantity / daysDiff;
          daysToSellStock = Math.ceil(currentStock / dailySales);
        }

        // Determinar categoría de velocidad
        let velocityCategory:
          | "muy rápida"
          | "rápida"
          | "media"
          | "lenta"
          | "muy lenta";

        if (turnoverRate >= 3) {
          velocityCategory = "muy rápida";
        } else if (turnoverRate >= 1.5) {
          velocityCategory = "rápida";
        } else if (turnoverRate >= 0.5) {
          velocityCategory = "media";
        } else if (turnoverRate > 0) {
          velocityCategory = "lenta";
        } else {
          velocityCategory = "muy lenta";
        }

        return {
          id: product.id,
          name: product.name,
          category: product.category.name,
          currentStock,
          soldQuantity,
          turnoverRate: parseFloat(turnoverRate.toFixed(2)),
          daysToSellStock: daysToSellStock === 9999 ? null : daysToSellStock,
          velocityCategory,
        };
      });

      // Ordenar por índice de rotación (de mayor a menor)
      return velocityData.sort((a, b) => b.turnoverRate - a.turnoverRate);
    } catch (error) {
      console.error("Error al obtener velocidad de inventario:", error);
      throw error;
    }
  }
}
