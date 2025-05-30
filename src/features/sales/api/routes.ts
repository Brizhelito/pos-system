/**
 * Rutas de la API para el módulo de ventas
 */

export const SALES_API_ROUTES = {
  // Customer endpoints
  CUSTOMER_SEARCH: "/api/sales/customers/search",
  CUSTOMER_CREATE: "/api/sales/customers/create",
  CUSTOMER_SEARCH_BY_NAME: "/api/sales/customers/search-by-name",
  CUSTOMER_UPDATE: "/api/sales/customers/update",

  // Product endpoints
  PRODUCT_SEARCH: "/api/sales/products/search",
  PRODUCT_DETAIL: "/api/sales/products/detail",

  // Category endpoints
  CATEGORIES: "/api/sales/categories",

  // Sale endpoints
  PROCESS_SALE: "/api/sales/process-sale",
  GET_RECEIPT: "/api/sales/receipt",
  GENERATE_PDF: "/api/sales/receipt/pdf",
  SEND_EMAIL: "/api/sales/receipt/email",
};

export default SALES_API_ROUTES;
