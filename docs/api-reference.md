# Referencia de API - Sistema POS

Esta documentación proporciona información detallada sobre los endpoints de la API REST del Sistema POS. Está diseñada para desarrolladores que necesitan integrar otros sistemas o extender la funcionalidad existente.

## Índice

1. [Autenticación](#autenticación)
2. [Productos](#productos)
3. [Categorías](#categorías)
4. [Proveedores](#proveedores)
5. [Clientes](#clientes)
6. [Ventas](#ventas)
7. [Usuarios](#usuarios)
8. [Reportes](#reportes)
9. [Códigos de Error](#códigos-de-error)
10. [Límites de Uso](#límites-de-uso)

## Información General

- **URL Base**: `https://tu-dominio.com/api`
- **Formato de Respuesta**: Todas las respuestas están en formato JSON
- **Métodos HTTP**: La API soporta los métodos estándar (GET, POST, PUT, DELETE)
- **Versionado**: La versión actual es v1, accesible a través de `/api/*`

## Autenticación

La API utiliza autenticación basada en sesiones mediante Iron Session para endpoints web, y tokens JWT para acceso programático.

### Inicio de Sesión

```
POST /api/login
```

**Cuerpo de la Solicitud**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Nombre Completo",
    "email": "usuario@ejemplo.com",
    "role": "ADMIN"
  }
}
```

### Cerrar Sesión

```
POST /api/logout
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### Verificar Sesión Actual

```
GET /api/auth/session
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "name": "Nombre Completo",
    "email": "usuario@ejemplo.com",
    "role": "ADMIN"
  }
}
```

## Productos

### Obtener Todos los Productos

```
GET /api/products
```

**Parámetros de Consulta**:
- `page`: Número de página (predeterminado: 1)
- `limit`: Elementos por página (predeterminado: 20, máximo: 100)
- `sort`: Campo para ordenar (name, price, stock, etc.)
- `order`: Dirección de ordenamiento (asc, desc)
- `category`: Filtrar por ID de categoría
- `search`: Búsqueda por texto

**Respuesta Exitosa (200 OK)**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Producto de Ejemplo",
      "description": "Descripción del producto",
      "purchasePrice": 10.00,
      "sellingPrice": 15.00,
      "stock": 100,
      "minStock": 10,
      "categoryId": 1,
      "providerId": 1,
      "category": {
        "id": 1,
        "name": "Categoría"
      },
      "provider": {
        "id": 1,
        "name": "Proveedor"
      }
    }
    // Más productos...
  ],
  "pagination": {
    "totalItems": 150,
    "totalPages": 8,
    "currentPage": 1,
    "itemsPerPage": 20
  }
}
```

### Obtener un Producto Específico

```
GET /api/products/{id}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "name": "Producto de Ejemplo",
  "description": "Descripción detallada del producto",
  "purchasePrice": 10.00,
  "sellingPrice": 15.00,
  "stock": 100,
  "minStock": 10,
  "categoryId": 1,
  "providerId": 1,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z",
  "category": {
    "id": 1,
    "name": "Categoría"
  },
  "provider": {
    "id": 1,
    "name": "Proveedor"
  }
}
```

### Crear un Nuevo Producto

```
POST /api/products
```

**Cuerpo de la Solicitud**:
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción del nuevo producto",
  "purchasePrice": 8.50,
  "sellingPrice": 12.75,
  "stock": 50,
  "minStock": 5,
  "categoryId": 2,
  "providerId": 3
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": 2,
  "name": "Nuevo Producto",
  "description": "Descripción del nuevo producto",
  "purchasePrice": 8.50,
  "sellingPrice": 12.75,
  "stock": 50,
  "minStock": 5,
  "categoryId": 2,
  "providerId": 3,
  "createdAt": "2023-02-01T00:00:00Z",
  "updatedAt": "2023-02-01T00:00:00Z"
}
```

### Actualizar un Producto

```
PUT /api/products/{id}
```

**Cuerpo de la Solicitud**:
```json
{
  "name": "Producto Actualizado",
  "sellingPrice": 14.99,
  "stock": 75
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "name": "Producto Actualizado",
  "description": "Descripción detallada del producto",
  "purchasePrice": 10.00,
  "sellingPrice": 14.99,
  "stock": 75,
  "minStock": 10,
  "categoryId": 1,
  "providerId": 1,
  "updatedAt": "2023-02-15T00:00:00Z"
}
```

### Actualizar Stock de un Producto

```
PUT /api/products/{id}/stock
```

**Cuerpo de la Solicitud**:
```json
{
  "quantity": 10,
  "operation": "add" // "add" o "subtract"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "name": "Producto Actualizado",
  "stock": 85,
  "previousStock": 75
}
```

### Eliminar un Producto

```
DELETE /api/products/{id}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Producto eliminado correctamente"
}
```

### Búsqueda de Productos

```
GET /api/products/search
```

**Parámetros de Consulta**:
- `query`: Términos de búsqueda
- `category`: ID de categoría (opcional)
- `inStock`: true/false para filtrar por disponibilidad

**Respuesta Exitosa (200 OK)**:
```json
{
  "products": [
    // Lista de productos que coinciden con la búsqueda
  ],
  "total": 5
}
```

## Categorías

### Obtener Todas las Categorías

```
GET /api/categories
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electrónica",
      "createdAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Ropa",
      "createdAt": "2023-01-02T00:00:00Z"
    }
    // Más categorías...
  ]
}
```

### Operaciones CRUD para Categorías

Las categorías soportan operaciones similares a los productos:

- **Obtener una Categoría**: `GET /api/categories/{id}`
- **Crear Categoría**: `POST /api/categories`
- **Actualizar Categoría**: `PUT /api/categories/{id}`
- **Eliminar Categoría**: `DELETE /api/categories/{id}`

## Clientes

### Obtener Todos los Clientes

```
GET /api/sales/customers
```

**Parámetros de Consulta**:
- `page`: Número de página
- `limit`: Elementos por página
- `search`: Búsqueda por nombre, email o número de identificación

**Respuesta Exitosa (200 OK)**:
```json
{
  "customers": [
    {
      "id": 1,
      "name": "Cliente Ejemplo",
      "email": "cliente@ejemplo.com",
      "phone": "+58 123 456 7890",
      "idType": "VENEZOLANO",
      "idNumber": "V12345678"
    }
    // Más clientes...
  ],
  "pagination": {
    "totalItems": 50,
    "totalPages": 3,
    "currentPage": 1,
    "itemsPerPage": 20
  }
}
```

### Operaciones para Clientes

- **Búsqueda de Clientes**: `GET /api/sales/customers/search?query=ejemplo`
- **Búsqueda por Nombre**: `GET /api/sales/customers/search-by-name?name=ejemplo`
- **Crear Cliente**: `POST /api/sales/customers/create`
- **Actualizar Cliente**: `PUT /api/sales/customers/update`

## Ventas

### Crear una Nueva Venta

```
POST /api/sales/process-sale
```

**Cuerpo de la Solicitud**:
```json
{
  "customerId": 1,
  "paymentMethod": "EFECTIVO",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 15.00
    },
    {
      "productId": 3,
      "quantity": 1,
      "unitPrice": 25.50
    }
  ],
  "paymentDetails": {
    "amount": 55.50,
    "reference": "EFECT-12345"
  }
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": 1,
  "customerId": 1,
  "userId": 2,
  "totalAmount": 55.50,
  "paymentMethod": "EFECTIVO",
  "status": "COMPLETED",
  "saleDate": "2023-03-15T14:30:00Z",
  "items": [
    {
      "productId": 1,
      "name": "Producto Ejemplo",
      "quantity": 2,
      "unitPrice": 15.00,
      "subtotal": 30.00
    },
    {
      "productId": 3,
      "name": "Otro Producto",
      "quantity": 1,
      "unitPrice": 25.50,
      "subtotal": 25.50
    }
  ],
  "customer": {
    "id": 1,
    "name": "Cliente Ejemplo"
  },
  "createdAt": "2023-03-15T14:30:00Z"
}
```

### Obtener Ventas

```
GET /api/sales
```

**Parámetros de Consulta**:
- `startDate`: Fecha inicial (YYYY-MM-DD)
- `endDate`: Fecha final (YYYY-MM-DD)
- `status`: Estado de la venta (PENDING, COMPLETED, CANCELLED)
- `paymentMethod`: Método de pago
- `customerId`: Filtrar por cliente
- `page`: Número de página
- `limit`: Elementos por página

**Respuesta Exitosa (200 OK)**:
```json
{
  "sales": [
    // Lista de ventas
  ],
  "pagination": {
    "totalItems": 120,
    "totalPages": 6,
    "currentPage": 1,
    "itemsPerPage": 20
  },
  "summary": {
    "totalSales": 120,
    "totalAmount": 8750.25
  }
}
```

### Obtener Detalles de una Venta

```
GET /api/sales/{id}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "customerId": 1,
  "userId": 2,
  "totalAmount": 55.50,
  "paymentMethod": "EFECTIVO",
  "status": "COMPLETED",
  "saleDate": "2023-03-15T14:30:00Z",
  "items": [
    // Detalles de los productos vendidos
  ],
  "customer": {
    "id": 1,
    "name": "Cliente Ejemplo",
    "email": "cliente@ejemplo.com",
    "phone": "+58 123 456 7890"
  },
  "user": {
    "id": 2,
    "name": "Vendedor"
  },
  "createdAt": "2023-03-15T14:30:00Z",
  "updatedAt": "2023-03-15T14:30:00Z"
}
```

## Reportes

La API de reportes proporciona datos agregados para análisis.

### Resumen de Ventas

```
GET /api/admin/reports/sales/summary
```

**Parámetros de Consulta**:
- `period`: "daily", "weekly", "monthly", "yearly"
- `startDate`: Fecha inicial
- `endDate`: Fecha final

**Respuesta Exitosa (200 OK)**:
```json
{
  "totalSales": 450,
  "totalAmount": 25750.75,
  "averageTicket": 57.22,
  "timeDistribution": [
    {
      "period": "2023-03-01",
      "count": 15,
      "amount": 850.50
    },
    // Más períodos...
  ]
}
```

### Top Productos

```
GET /api/admin/dashboard/top-products
```

**Parámetros de Consulta**:
- `limit`: Número de productos a mostrar (predeterminado: 10)
- `period`: "week", "month", "year"

**Respuesta Exitosa (200 OK)**:
```json
{
  "products": [
    {
      "id": 5,
      "name": "Producto Popular",
      "quantity": 150,
      "revenue": 2250.00,
      "percentage": 15.5
    },
    // Más productos...
  ]
}
```

### Análisis de Rentabilidad

```
GET /api/admin/dashboard/profit-analysis
```

**Parámetros de Consulta**:
- `period`: "week", "month", "year"

**Respuesta Exitosa (200 OK)**:
```json
{
  "totalRevenue": 25750.75,
  "totalCost": 15450.50,
  "grossProfit": 10300.25,
  "grossMargin": 40.0,
  "trending": {
    "revenue": "+5.3%",
    "profit": "+7.1%"
  },
  "timeDistribution": [
    // Análisis a lo largo del tiempo
  ],
  "categoryDistribution": [
    // Análisis por categoría
  ]
}
```

## Códigos de Error

La API utiliza códigos de estado HTTP estándar. Además, todas las respuestas de error incluyen un mensaje descriptivo:

### Ejemplos de Errores

**400 Bad Request**:
```json
{
  "error": "Solicitud inválida",
  "message": "El campo 'name' es obligatorio",
  "code": "VALIDATION_ERROR"
}
```

**401 Unauthorized**:
```json
{
  "error": "No autorizado",
  "message": "Se requiere autenticación para acceder a este recurso",
  "code": "AUTHENTICATION_REQUIRED"
}
```

**403 Forbidden**:
```json
{
  "error": "Acceso denegado",
  "message": "No tienes permiso para acceder a este recurso",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

**404 Not Found**:
```json
{
  "error": "Recurso no encontrado",
  "message": "El producto con ID 999 no existe",
  "code": "RESOURCE_NOT_FOUND"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Error interno del servidor",
  "message": "Ha ocurrido un error inesperado",
  "code": "SERVER_ERROR"
}
```

## Límites de Uso

La API implementa límites de tasa para garantizar la estabilidad:

- 100 solicitudes por minuto para endpoints generales
- 300 solicitudes por minuto para endpoints de ventas
- 50 solicitudes por minuto para endpoints de reportes

Cuando se exceden estos límites, la API responde con un código de estado 429 (Too Many Requests).

## Consideraciones para el Desarrollo

- Todas las fechas están en formato ISO 8601 (UTC)
- Los valores monetarios se representan como números de punto flotante
- Las cantidades siempre son números enteros
- Todas las solicitudes que modifican datos (POST, PUT, DELETE) requieren autenticación
- La mayoría de los endpoints GET están disponibles para usuarios autenticados con roles adecuados

Para más información o soporte, contacte al equipo de desarrollo en api-support@sistema-pos.com. 