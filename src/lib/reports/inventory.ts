import prisma from "@/lib/db/prisma";

/**
 * Obtiene todos los productos con información de categorías y proveedores
 */
export async function getAllInventory() {
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
export async function getLowStockInventory() {
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
export async function getInventoryValue() {
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
export async function getInventoryTurnover(startDate: Date, endDate: Date) {
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
