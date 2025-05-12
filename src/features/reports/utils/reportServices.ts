/**
 * Cliente API para los servicios de reportes
 */

export interface ReportParams {
  startDate?: Date;
  endDate?: Date;
  year?: number;
  limit?: number;
  [key: string]: unknown;
}

/**
 * Clase que proporciona métodos para acceder a los endpoints de reportes de ventas
 */
export class SalesReportsApi {
  /**
   * Realiza una petición al API de reportes de ventas
   */
  static async fetchReport(action: string, params: ReportParams) {
    try {
      const response = await fetch("/api/admin/reports/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error al obtener reporte de ventas (${action}):`, error);
      throw error;
    }
  }
}

/**
 * Clase que proporciona métodos para acceder a los endpoints de reportes de inventario
 */
export class InventoryReportsApi {
  /**
   * Realiza una petición al API de reportes de inventario
   */
  static async fetchReport(action: string, params: ReportParams = {}) {
    try {
      const response = await fetch("/api/admin/reports/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(
        `Error al obtener reporte de inventario (${action}):`,
        error
      );
      throw error;
    }
  }
}

/**
 * Clase que proporciona métodos para acceder a los endpoints de reportes de clientes
 */
export class CustomerReportsApi {
  /**
   * Realiza una petición al API de reportes de clientes
   */
  static async fetchReport(action: string, params: ReportParams) {
    try {
      const response = await fetch("/api/admin/reports/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error al obtener reporte de clientes (${action}):`, error);
      throw error;
    }
  }
}

// Funciones auxiliares para mantener compatibilidad con el código existente
export const fetchSalesReport = SalesReportsApi.fetchReport;
export const fetchInventoryReport = InventoryReportsApi.fetchReport;
export const fetchCustomersReport = CustomerReportsApi.fetchReport;

// Cliente API para los servicios de reportes de vendedores
export class SellerReportsApi {
  static async fetchReport(action: string, params: ReportParams) {
    try {
      const response = await fetch("/api/admin/reports/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...params }),
      });
      if (!response.ok)
        throw new Error(`Error en la petición: ${response.status}`);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(
        `Error al obtener reporte de vendedores (${action}):`,
        error
      );
      throw error;
    }
  }
}
export const fetchSellersReport = SellerReportsApi.fetchReport;

/**
 * Clase que proporciona métodos para acceder a los endpoints de reportes financieros
 */
export class FinancesReportsApi {
  /**
   * Realiza una petición al API de reportes financieros
   */
  static async fetchReport(action: string, params: ReportParams = {}) {
    try {
      const response = await fetch("/api/admin/reports/finances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(
        `Error al obtener reporte financiero (${action}):`,
        error
      );
      throw error;
    }
  }
}
