/**
 * Utilidades para manejar la configuración almacenada en la base de datos
 */
import { prisma } from "@/components/config/db";
import { INVOICE_CONFIG, TAX_CONFIG, APP_CONFIG } from "./env";
import { config } from "@prisma/client";

/**
 * Obtiene el valor de una configuración de la base de datos
 * @param key Clave de la configuración
 * @param defaultValue Valor por defecto si no existe
 * @returns El valor de la configuración
 */
export const getConfigValue = async (
  key: string,
  defaultValue?: string
): Promise<string> => {
  try {
    const config = await prisma.config.findUnique({
      where: { key },
    });

    return config?.value || defaultValue || "";
  } catch (error) {
    console.error(`Error al obtener configuración ${key}:`, error);
    return defaultValue || "";
  }
};

/**
 * Obtiene múltiples valores de configuración
 * @param keys Claves de configuración a obtener
 * @returns Objeto con las configuraciones obtenidas
 */
export const getConfigValues = async (
  keys: string[]
): Promise<Record<string, string>> => {
  try {
    const configs = await prisma.config.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    const result: Record<string, string> = {};
    configs.forEach((configItem: config) => {
      result[configItem.key] = configItem.value;
    });

    return result;
  } catch (error) {
    console.error("Error al obtener configuraciones:", error);
    return {};
  }
};

/**
 * Establece un valor de configuración en la base de datos
 * @param key Clave de la configuración
 * @param value Valor de la configuración
 * @returns El objeto de configuración actualizado
 */
export const setConfigValue = async (
  key: string,
  value: string
): Promise<boolean> => {
  try {
    await prisma.config.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: {
        key,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error(`Error al guardar configuración ${key}:`, error);
    return false;
  }
};

/**
 * Carga valores específicos de la configuración desde .env o valores predeterminados
 */
export const getDefaultConfig = async (): Promise<Record<string, string>> => {
  return {
    tax_rate: String(TAX_CONFIG.rate * 100),
    invoice_prefix: INVOICE_CONFIG.prefix,
    default_payment_method: APP_CONFIG.defaultPaymentMethod,
  };
};

/**
 * Inicializa la tabla de configuración si está vacía
 */
export const initializeConfig = async (): Promise<void> => {
  try {
    const count = await prisma.config.count();
    if (count === 0) {
      const defaults = await getDefaultConfig();
      for (const [key, value] of Object.entries(defaults)) {
        await setConfigValue(key, value);
      }
    }
  } catch (error) {
    console.error("Error al inicializar configuración:", error);
  }
};
