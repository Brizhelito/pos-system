# Guía para Administradores - Sistema POS

Esta guía está dirigida específicamente a usuarios con rol de Administrador en el Sistema POS. Cubre todas las funcionalidades exclusivas disponibles para este rol y proporciona instrucciones detalladas para la gestión efectiva del sistema.

## Contenido

1. [Panel de Administración](#panel-de-administración)
2. [Gestión de Usuarios](#gestión-de-usuarios)
3. [Configuración del Sistema](#configuración-del-sistema)
4. [Gestión de Inventario](#gestión-de-inventario)
5. [Gestión de Proveedores](#gestión-de-proveedores)
6. [Reportes Avanzados](#reportes-avanzados)
7. [Copias de Seguridad](#copias-de-seguridad)
8. [Mejores Prácticas](#mejores-prácticas)

## Panel de Administración

El panel de administración proporciona una visión general del rendimiento del sistema y acceso rápido a todas las funciones administrativas.

### Acceso al Panel

1. Inicia sesión con tus credenciales de administrador
2. Serás redirigido automáticamente al Dashboard de administración
3. Alternativamente, haz clic en "Admin" en el menú lateral

### Widgets del Dashboard

El dashboard incluye los siguientes widgets informativos:

- **Resumen de Ventas**: Muestra las ventas del día, semana y mes
- **Productos con Bajo Stock**: Lista de productos que requieren reposición
- **Actividad Reciente**: Últimas transacciones y cambios en el sistema
- **Rendimiento de Vendedores**: Estadísticas de los vendedores más activos
- **Métodos de Pago**: Distribución de ventas por método de pago
- **Clientes Principales**: Top clientes por volumen de compras

## Gestión de Usuarios

Como administrador, puedes crear, modificar y gestionar todos los usuarios del sistema.

### Crear un Nuevo Usuario

1. Ve a la sección "Usuarios" desde el menú lateral
2. Haz clic en el botón "Nuevo Usuario"
3. Completa el formulario con la información requerida:
   - Nombre completo
   - Correo electrónico
   - Contraseña inicial
   - Rol (Administrador o Vendedor)
4. Haz clic en "Guardar"

### Modificar un Usuario Existente

1. Ve a la sección "Usuarios"
2. Encuentra al usuario deseado en la lista o utiliza el buscador
3. Haz clic en el ícono de edición (lápiz)
4. Actualiza la información necesaria
5. Haz clic en "Guardar Cambios"

### Desactivar/Reactivar un Usuario

1. Ve a la sección "Usuarios"
2. Encuentra al usuario deseado
3. Haz clic en el botón de estado (toggle)
4. Confirma la acción en el diálogo

## Configuración del Sistema

### Ajustes Generales

1. Ve a la sección "Configuración" desde el menú lateral
2. En la pestaña "General", puedes modificar:
   - Nombre del negocio
   - Información de contacto
   - Moneda predeterminada
   - Zona horaria
   - Idioma del sistema

### Configuración de Impuestos

1. En la sección "Configuración", ve a la pestaña "Impuestos"
2. Aquí puedes:
   - Definir tasas de impuestos
   - Configurar reglas para aplicación automática
   - Establecer exenciones para categorías o productos específicos

### Métodos de Pago

1. En la sección "Configuración", ve a la pestaña "Pagos"
2. Puedes activar/desactivar los siguientes métodos:
   - Efectivo
   - Transferencia bancaria
   - Pago móvil
   - Punto de venta (tarjetas)
3. Para cada método, configura detalles específicos como cuentas bancarias o proveedores de servicios

### Configuración de Recibos

1. En la sección "Configuración", ve a la pestaña "Recibos"
2. Aquí puedes personalizar:
   - Encabezado y pie de página
   - Información legal a incluir
   - Logotipo del negocio
   - Formato de impresión

## Gestión de Inventario

### Categorías de Productos

1. Ve a la sección "Categorías" desde el menú de Inventario
2. Para crear una categoría:
   - Haz clic en "Nueva Categoría"
   - Ingresa el nombre y descripción
   - Haz clic en "Guardar"
3. Para modificar una categoría:
   - Haz clic en el ícono de edición
   - Actualiza la información
   - Haz clic en "Guardar Cambios"

### Productos

1. Ve a la sección "Productos" desde el menú de Inventario
2. Para añadir un nuevo producto:
   - Haz clic en "Nuevo Producto"
   - Completa la información: nombre, descripción, precios, stock, etc.
   - Selecciona categoría y proveedor
   - Establece niveles de stock mínimo
   - Haz clic en "Guardar"
3. Para editar un producto:
   - Busca el producto deseado
   - Haz clic en el ícono de edición
   - Actualiza la información
   - Haz clic en "Guardar Cambios"

### Ajustes de Inventario

1. Ve a la sección "Ajustes de Inventario"
2. Para registrar una entrada de stock:
   - Haz clic en "Nueva Entrada"
   - Selecciona el producto
   - Ingresa la cantidad y precio de compra
   - Añade número de factura o referencia
   - Haz clic en "Registrar"
3. Para registrar una salida por motivos distintos a ventas:
   - Haz clic en "Nueva Salida"
   - Selecciona el producto
   - Ingresa la cantidad y motivo (merma, daño, etc.)
   - Haz clic en "Registrar"

## Gestión de Proveedores

### Añadir un Proveedor

1. Ve a la sección "Proveedores" desde el menú lateral
2. Haz clic en "Nuevo Proveedor"
3. Completa la información:
   - Nombre de la empresa
   - Contacto principal
   - Teléfono y correo
   - Dirección
   - Notas adicionales
4. Haz clic en "Guardar"

### Asociar Productos a Proveedores

1. Desde la ficha de un proveedor, ve a la pestaña "Productos"
2. Haz clic en "Asociar Productos"
3. Selecciona los productos de este proveedor
4. Opcionalmente, ingresa códigos de referencia y precios específicos
5. Haz clic en "Guardar Asociaciones"

## Reportes Avanzados

Como administrador, tienes acceso a todos los reportes del sistema, organizados en categorías:

### Reportes de Ventas

1. Ve a "Reportes" > "Ventas"
2. Aquí encontrarás:
   - Ventas por período
   - Ventas por vendedor
   - Ventas por categoría
   - Análisis de métodos de pago
   - Tendencias de ventas

### Reportes de Inventario

1. Ve a "Reportes" > "Inventario"
2. Disponible:
   - Valoración de inventario
   - Rotación de productos
   - Productos de bajo rendimiento
   - Análisis de categorías
   - Alertas de stock

### Reportes de Clientes

1. Ve a "Reportes" > "Clientes"
2. Incluye:
   - Segmentación de clientes
   - Análisis RFM (Recencia, Frecuencia, Monetario)
   - Patrones de compra
   - Retención de clientes

### Reportes Financieros

1. Ve a "Reportes" > "Finanzas"
2. Accede a:
   - Análisis de ganancias
   - Margen por producto/categoría
   - Costos vs. ingresos
   - Proyecciones

### Exportación de Reportes

Todos los reportes pueden exportarse:

1. Configura los filtros deseados
2. Haz clic en "Exportar"
3. Selecciona el formato (Excel, PDF, CSV)
4. El archivo se descargará automáticamente

## Copias de Seguridad

### Crear una Copia de Seguridad Manual

1. Ve a "Configuración" > "Sistema" > "Respaldo"
2. Haz clic en "Crear Respaldo"
3. Espera a que se complete el proceso
4. Haz clic en "Descargar" para guardar el archivo

### Configurar Copias Automáticas

1. Ve a "Configuración" > "Sistema" > "Respaldo"
2. En la sección "Respaldos Programados":
   - Activa la opción
   - Define la frecuencia (diaria, semanal, mensual)
   - Establece la hora
   - Opcionalmente, configura el almacenamiento en la nube
3. Haz clic en "Guardar Configuración"

## Mejores Prácticas

Como administrador del sistema, considera estas recomendaciones:

### Seguridad

- Cambia regularmente tu contraseña de administrador
- No compartas tus credenciales
- Revisa periódicamente los registros de actividad
- Asigna solo los permisos necesarios a cada usuario

### Mantenimiento

- Realiza copias de seguridad regularmente
- Revisa y ajusta niveles de stock mínimo
- Actualiza información de productos y precios
- Elimina usuarios inactivos o revoca accesos no necesarios

### Optimización

- Configura categorías de productos de manera lógica
- Establece procesos claros para la gestión de inventario
- Capacita regularmente a los vendedores
- Utiliza los reportes para identificar áreas de mejora

---

Para cualquier consulta adicional o soporte técnico, contacta con el equipo de desarrollo a través de soporte@sistema-pos.com. 