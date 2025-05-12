/**
 * Tipos comunes para la API de Next.js App Router
 */

/**
 * Interfaz para los parámetros de ruta con un ID
 * Esta interfaz cumple con el formato esperado por Next.js
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
 */
export interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * Interfaz para los parámetros de ruta con múltiples segmentos
 */
export interface MultiSegmentRouteContext<T extends Record<string, string>> {
  params: T;
}
