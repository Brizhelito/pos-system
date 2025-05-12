# Instrucciones para Favicons - Configuración Completa

Para implementar correctamente los favicons en este proyecto, coloca los siguientes archivos descargados en la carpeta `public/` (no en esta subcarpeta):

## Archivos requeridos:

### Básicos:
1. `favicon.ico` - Favicon tradicional (recomendado 32x32 + 16x16)
2. `favicon-16x16.png` - Favicon pequeño
3. `favicon-32x32.png` - Favicon mediano

### Apple:
4. `apple-touch-icon.png` - Para dispositivos iOS (180x180px)

### Android:
5. `android-chrome-192x192.png` - Para Android (192x192 píxeles)
6. `android-chrome-512x512.png` - Para Android (512x512 píxeles)

### Manifiesto:
7. `site.webmanifest` - Archivo de manifiesto web (ya creado)

## Estado actual:
- ✅ Se ha configurado correctamente en `layout.tsx` la referencia a todos los iconos
- ✅ Se ha creado el archivo `site.webmanifest` con la configuración adecuada
- ✅ Se corrigió el error `themeColor` moviéndolo a la exportación `viewport`
- ✅ Se crearon archivos temporales para evitar errores 404 mientras se obtienen los definitivos
- ⏳ **Pendiente**: Reemplazar los archivos temporales con los favicons definitivos

## Notas importantes:
- Los archivos deben colocarse directamente en la carpeta `public/`, no en subcarpetas
- Asegúrate de que los nombres coincidan exactamente con los especificados
- Se ha implementado soporte para modo claro/oscuro en la configuración del viewport

## Herramientas recomendadas:
- [Favicon.io](https://favicon.io/) - Generador de favicon gratuito
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Herramienta completa para generar favicons

## Configuración avanzada:
- Para PWA completa, considera agregar Service Workers
- El archivo site.webmanifest ya está configurado con:
  - Nombre de la aplicación
  - Descripción
  - Íconos
  - Colores de tema
  - Orientación predeterminada
  - Configuración de visualización 