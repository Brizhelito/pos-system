/**
 * Rutas de la API para el módulo de ventas
 */

export const SALES_API_ROUTES = {
  // Customer endpoints
  CUSTOMER_SEARCH: "/api/sales/customers/search",
  CUSTOMER_CREATE: "/api/sales/customers/create",

  // Product endpoints
  PRODUCT_SEARCH: "/api/sales/products/search",

  // Sale endpoints
  PROCESS_SALE: "/api/sales/process-sale",
  GET_RECEIPT: "/api/sales/receipt",
};

export default SALES_API_ROUTES;
