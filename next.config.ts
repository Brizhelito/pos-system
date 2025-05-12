import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de rendimiento
  poweredByHeader: false,
  compress: true,
  // Configuración de imágenes
  images: {
    formats: ["image/avif", "image/webp"],
    // Añadir dominios seguros si es necesario
    // domains: ['example.com'],
  },
  // Optimizaciones para producción
  productionBrowserSourceMaps: false,
};

export default nextConfig;
