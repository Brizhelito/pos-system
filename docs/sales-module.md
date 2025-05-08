# Documentación del Módulo de Ventas (POS)

## Índice
1. [Descripción General](#descripción-general)
2. [Flujo de Trabajo](#flujo-de-trabajo)
3. [Componentes Principales](#componentes-principales)
4. [Atajos de Teclado](#atajos-de-teclado)
5. [Métodos de Pago](#métodos-de-pago)
6. [Detalles Técnicos](#detalles-técnicos)
7. [Optimizaciones y Mejores Prácticas](#optimizaciones-y-mejores-prácticas)

## Descripción General

El Módulo de Ventas (POS - Point of Sale) es una solución integral para gestionar ventas en tiempo real. Permite seleccionar clientes, buscar y agregar productos al carrito, procesar diferentes métodos de pago y generar recibos.

### Características Principales:

- Búsqueda rápida de clientes por ID
- Búsqueda y selección de productos con gestión de stock
- Carrito de compras con gestión de cantidades
- Múltiples métodos de pago (Efectivo, Pago Móvil, Transferencia, Punto de Venta)
- Generación e impresión de recibos
- Navegación completa por teclado para una operación rápida
- Persistencia local de datos para recuperación en caso de problemas

## Flujo de Trabajo

1. **Selección de Cliente**
   - Buscar cliente por ID
   - Ver/seleccionar cliente encontrado
   - Crear nuevo cliente si no existe

2. **Búsqueda y Selección de Productos**
   - Buscar productos por nombre o código
   - Navegar en la lista de resultados
   - Seleccionar un producto
   - Ajustar cantidad
   - Agregar al carrito

3. **Gestión del Carrito**
   - Visualizar productos agregados
   - Modificar cantidades
   - Eliminar productos
   - Ver subtotal, impuestos y total

4. **Proceso de Pago**
   - Seleccionar método de pago
   - Completar detalles según el método seleccionado
   - Procesar la venta

5. **Generación de Recibo**
   - Visualizar recibo completo
   - Imprimir recibo
   - Cerrar y comenzar nueva venta

## Componentes Principales

### 1. SaleContainer
Componente principal que integra todos los módulos y gestiona el estado global de la venta.

### 2. CustomerSearch
Permite buscar clientes por ID y crear nuevos si no existen.

### 3. ProductSearch
Búsqueda de productos con navegación por teclado en los resultados.

### 4. CartView
Visualización del carrito con controles para modificar cantidades y eliminar productos.

### 5. PaymentDetails
Gestión de los diferentes métodos de pago con sus respectivos campos y validaciones.

### 6. SaleReceipt
Visualización e impresión del recibo de venta.

## Atajos de Teclado

El sistema está optimizado para operación por teclado, permitiendo realizar ventas sin necesidad de usar el mouse.

### Atajos Globales

| Atajo | Función |
|-------|---------|
| `F1` | Activar búsqueda de cliente |
| `F2` | Activar búsqueda de productos |
| `F3` | Activar detalles de pago |
| `F4` | Procesar venta |
| `Alt+B` | Cancelar venta completa |
| `Alt+L` | Limpiar carrito |
| `Alt+X` | Cerrar recibo |

### Navegación entre Secciones

| Atajo | Función |
|-------|---------|
| `Alt+Q` | Ir a sección de cliente |
| `Alt+W` | Ir a sección de productos |
| `Alt+E` | Activar carrito |
| `Alt+P` | Activar detalles de pago |
| `Alt+Shift+C` | Activar carrito |

### Búsqueda de Productos

| Atajo | Función |
|-------|---------|
| `↑` `↓` | Navegar en resultados |
| `Enter` `→` | Seleccionar producto |
| `Alt+↑` `Alt+↓` | Aumentar/disminuir cantidad |
| `Alt+A` | Agregar al carrito |
| `Alt+X` | Cancelar selección |
| `←` | Volver a la lista |

### Carrito

| Atajo | Función |
|-------|---------|
| `↑` `↓` | Navegar entre productos |
| `+` `-` | Cambiar cantidad |
| `Delete` `Backspace` | Eliminar producto |
| `Escape` | Salir del carrito |

### Métodos de Pago

| Atajo | Función |
|-------|---------|
| `Alt+1` | Efectivo |
| `Alt+2` | Pago Móvil |
| `Alt+3` | Transferencia |
| `Alt+4` | Punto de Venta |
| `Alt+Enter` | Procesar pago |
| `Alt+Shift+1-5` | Sugerir monto (+5, +10, +20, +50, +100) |
| `Alt+M` | Monto exacto |

### Recibo

| Atajo | Función |
|-------|---------|
| `Alt+P` | Imprimir recibo |
| `Alt+Shift+P` | Imprimir recibo (alternativo) |
| `Alt+X` | Cerrar recibo |

## Métodos de Pago

### 1. Efectivo
- Ingreso de monto recibido
- Cálculo automático de cambio
- Sugerencias de denominaciones comunes

### 2. Pago Móvil
- Número de teléfono
- Banco
- Referencia (con generación automática)

### 3. Transferencia Bancaria
- Banco origen
- Banco destino
- Referencia

### 4. Punto de Venta
- Banco
- Últimos 4 dígitos
- Referencia

## Detalles Técnicos

### Arquitectura
El módulo está construido con una arquitectura basada en componentes React, utilizando:

- **Estado local y refs**: Para la gestión de estado interno de componentes
- **Context API**: Para compartir estado entre componentes relacionados
- **LocalStorage**: Para persistencia de datos temporales
- **Optimizaciones de renderizado**: useCallback, useMemo, y React.memo

### Persistencia de Datos
Se utiliza localStorage para guardar:
- Carrito actual
- Cliente seleccionado
- Método de pago
- Detalles del pago

Esto permite recuperar la información en caso de recarga accidental.

### Gestión de APIs
Se comunica con los siguientes endpoints:
- `/api/customers/search`: Búsqueda de clientes
- `/api/products/search`: Búsqueda de productos
- `/api/sales/process`: Procesamiento de ventas

## Optimizaciones y Mejores Prácticas

1. **Navegación por Teclado**: Sistema completamente operable mediante teclado
2. **Feedback con Toasts**: Notificaciones informativas para acciones importantes
3. **Debounce en Búsquedas**: Evita múltiples llamadas a APIs durante la escritura
4. **Memoización**: Uso de React.memo, useCallback y useMemo para evitar re-renders innecesarios
5. **Validaciones**: Validación de datos en cada paso para evitar errores
6. **Accesibilidad**: Implementación de atributos ARIA para mejor accesibilidad
7. **Responsividad**: Adaptación a diferentes tamaños de pantalla

## Cómo Usar

1. Inicie sesión en el sistema
2. Acceda a la sección de Ventas
3. Use F1 para buscar un cliente o crear uno nuevo
4. Use F2 para buscar productos y agregarlos al carrito
5. Ajuste cantidades directamente en el carrito si es necesario
6. Seleccione el método de pago y complete los detalles requeridos
7. Presione F4 o el botón "Procesar Venta" para finalizar
8. Imprima el recibo usando Alt+P 