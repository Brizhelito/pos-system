/**
 * Utilidades para acceder al localStorage de manera segura en entornos SSR
 */

/**
 * Verifica si estamos en el navegador
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Obtiene un valor del localStorage de manera segura
 * @param key Clave a buscar
 * @param defaultValue Valor por defecto si no existe
 * @returns El valor almacenado o el valor por defecto
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error al obtener ${key} del localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Guarda un valor en localStorage de manera segura
 * @param key Clave donde guardar
 * @param value Valor a guardar
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage:`, error);
  }
};

/**
 * Elimina un valor del localStorage de manera segura
 * @param key Clave a eliminar
 */
export const removeStorageItem = (key: string): void => {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar ${key} del localStorage:`, error);
  }
};

/**
 * Limpia todo el localStorage de manera segura
 */
export const clearStorage = (): void => {
  if (!isBrowser) return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error al limpiar el localStorage:", error);
  }
};
