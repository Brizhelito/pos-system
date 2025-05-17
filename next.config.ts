import type { NextConfig } from "next";
import dotenv from "dotenv";

// Cargar explícitamente el archivo .env
dotenv.config();

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Variables de la empresa
    COMPANY_NAME: process.env.COMPANY_NAME,
    COMPANY_ADDRESS: process.env.COMPANY_ADDRESS,
    COMPANY_CITY: process.env.COMPANY_CITY,
    COMPANY_ZIP: process.env.COMPANY_ZIP,
    COMPANY_PHONE: process.env.COMPANY_PHONE,
    COMPANY_EMAIL: process.env.COMPANY_EMAIL,
    COMPANY_RIF: process.env.COMPANY_RIF,
    COMPANY_WEBSITE: process.env.COMPANY_WEBSITE,
    COMPANY_LOGO_URL: process.env.COMPANY_LOGO_URL,

    // Variables de moneda
    CURRENCY_CODE: process.env.CURRENCY_CODE,
    CURRENCY_SYMBOL: process.env.CURRENCY_SYMBOL,
    CURRENCY_LOCALE: process.env.CURRENCY_LOCALE,

    // Variables de impuestos
    TAX_RATE: process.env.TAX_RATE,
    TAX_LABEL: process.env.TAX_LABEL,
    TAX_ENABLED: process.env.TAX_ENABLED,

    // Variables de aplicación
    APP_NAME: process.env.APP_NAME,
    DEFAULT_PAYMENT_METHOD: process.env.DEFAULT_PAYMENT_METHOD,
    DEFAULT_PAGINATION_LIMIT: process.env.DEFAULT_PAGINATION_LIMIT,
    INVOICE_PREFIX: process.env.INVOICE_PREFIX,

    // Las variables sensibles como DATABASE_URL no deben exponerse al cliente
  },
};

export default nextConfig;
