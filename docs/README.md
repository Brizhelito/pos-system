# Sistema POS - Documentación

Bienvenido a la documentación del Sistema de Punto de Venta (POS). Esta documentación está diseñada para ayudar a usuarios, administradores y desarrolladores a entender y utilizar eficientemente el sistema.

## Contenido

### Guías de Usuario
- [Manual del Módulo de Ventas](./sales-module.md)
- [Guía Rápida de Atajos de Teclado](./keyboard-shortcuts.md)
- [Métodos de Pago](./payment-methods.md)

### Documentación Técnica
- [Arquitectura del Sistema](./architecture.md)
- [API](./api.md)
- [Estructura del Código](./code-structure.md)

### Mantenimiento
- [Guía de Resolución de Problemas](./troubleshooting.md)
- [Actualización del Sistema](./updates.md)

## Introducción al Sistema POS

El Sistema de Punto de Venta (POS) es una solución integral diseñada para optimizar el proceso de ventas en comercios minoristas. Algunas de sus características principales incluyen:

- Interfaz intuitiva y amigable para el usuario
- Operación completa mediante teclado para mayor velocidad
- Múltiples métodos de pago
- Gestión de clientes y productos
- Generación e impresión de recibos
- Persistencia de datos para recuperación en caso de fallas

## Navegación por Teclado

Una de las características distintivas de este sistema es su completa operabilidad mediante teclado, permitiendo realizar ventas sin necesidad de utilizar el mouse. Consulte la [Guía Rápida de Atajos de Teclado](./keyboard-shortcuts.md) para obtener una lista completa de los atajos disponibles.

## Módulo de Ventas

El [módulo de ventas](./sales-module.md) es el componente central del sistema, permitiendo realizar transacciones de venta completas desde la selección de cliente y productos hasta la finalización del pago y generación del recibo.

## Métodos de Pago

El sistema soporta múltiples [métodos de pago](./payment-methods.md), incluyendo efectivo, pago móvil, transferencia bancaria y punto de venta. Cada método cuenta con validaciones y flujos de trabajo específicos.

## Soporte

Si encuentra algún problema o tiene alguna pregunta que no esté cubierta en esta documentación, póngase en contacto con el equipo de soporte técnico a través de:

- Email: soporte@sistema-pos.com
- Teléfono: +58 123-456-7890

---

© 2023 Sistema POS | Todos los derechos reservados 

# Documentación del Sistema POS

Esta documentación proporciona una visión general del sistema de punto de venta (POS) y sirve como guía para desarrolladores.

## Índice

1. [Arquitectura](#arquitectura)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Módulos Principales](#módulos-principales)
4. [Sistema de Reportes](#sistema-de-reportes)
5. [API Reference](#api-reference)
6. [Guías de Desarrollo](#guías-de-desarrollo)

## Arquitectura

El sistema está construido sobre Next.js 14 utilizando una arquitectura basada en características (features) para mantener el código organizado y escalable.

## Estructura del Proyecto

```
pos-system/
├── prisma/                 # Configuración de base de datos y migraciones
├── public/                 # Archivos estáticos
├── src/
│   ├── app/                # Rutas y páginas de Next.js (App Router)
│   ├── lib/                # Utilidades y lógica compartida
│   │   ├── api/            # Funciones auxiliares para APIs
│   │   ├── auth/           # Lógica de autenticación
│   │   ├── db/             # Configuración y utilidades de base de datos
│   │   └── utils/          # Funciones de utilidad generales
│   ├── components/         # Componentes globales
│   │   ├── ui/             # Componentes de UI reutilizables
│   │   ├── forms/          # Componentes de formulario
│   │   └── layout/         # Componentes de diseño (header, footer, etc.)
│   ├── features/           # Funcionalidades agrupadas por dominio
│   │   ├── sales/          # Feature de ventas
│   │   ├── inventory/      # Feature de inventario
│   │   ├── customers/      # Feature de clientes
│   │   └── reports/        # Feature de reportes
│   ├── types/              # Definiciones de tipos TypeScript
│   └── middleware.ts       # Middleware de Next.js
├── docs/                   # Documentación adicional
└── scripts/                # Scripts de utilidad
```

## Módulos Principales

### Ventas

El módulo de ventas permite realizar transacciones, gestionar el carrito de compras y procesar pagos.

### Inventario

El módulo de inventario permite gestionar productos, categorías, proveedores y stock.

### Clientes

El módulo de clientes permite gestionar la información de los clientes, historial de compras y preferencias.

### Usuarios

El módulo de usuarios permite gestionar cuentas, roles y permisos dentro del sistema.

### Reportes

El módulo de reportes proporciona análisis y visualizaciones de datos para ayudar en la toma de decisiones. Incluye reportes sobre ventas, inventario, clientes y vendedores.

## Sistema de Reportes

El sistema de reportes ha sido mejorado con las siguientes características:

### Interfaz de Usuario Mejorada

- **Selector de Fechas Avanzado**: Implementación de un DateRangePicker con rangos predefinidos y calendario visual.
- **Visualizaciones Interactivas**: Gráficos y tablas interactivos con capacidad de filtrado y exportación.
- **Experiencia Móvil Optimizada**: Diseño responsivo para todos los componentes de reportes.

### Tipos de Reportes

- **Reportes de Ventas**: Análisis de ventas por período, producto, categoría y método de pago.
- **Reportes de Inventario**: Análisis de stock, rotación de productos y valoración de inventario.
- **Reportes de Clientes**: Segmentación de clientes, análisis RFM, retención y patrones estacionales.
- **Reportes de Vendedores**: Rendimiento de vendedores, tendencias de ventas y productos más vendidos.

### Características Técnicas

- **Configuraciones Centralizadas**: Sistema de constantes globales para formato de moneda, colores y opciones.
- **Rendimiento Optimizado**: Manejo eficiente de grandes conjuntos de datos y renderizado condicional.
- **Exportación de Datos**: Capacidad para exportar datos en diversos formatos (CSV, Excel, PDF).

Para más detalles, consulta la [documentación específica del módulo de reportes](/src/features/reports/README.md).

## API Reference

La API del sistema está organizada en rutas basadas en recursos:

- `/api/sales` - Endpoints relacionados con ventas
- `/api/inventory` - Endpoints relacionados con inventario
- `/api/customers` - Endpoints relacionados con clientes
- `/api/users` - Endpoints relacionados con usuarios
- `/api/admin/reports` - Endpoints relacionados con reportes (acceso administrativo)

## Guías de Desarrollo

### Convenciones de Código

- Utilizamos ESLint y Prettier para mantener un estilo de código consistente
- Los componentes de React utilizan una estructura funcional con hooks
- Preferimos TypeScript para todas las implementaciones nuevas

### Flujo de Trabajo Git

1. Crear una rama desde `develop` con el formato `feature/nombre-caracteristica`
2. Desarrollar y probar los cambios localmente
3. Crear un Pull Request hacia `develop`
4. Después de la revisión, hacer merge a `develop`
5. Periódicamente, `develop` se fusiona con `main` para las releases 