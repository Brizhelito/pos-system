# Métodos de Pago - Documentación Detallada

Este documento describe los diferentes métodos de pago disponibles en el sistema POS, sus campos requeridos, validaciones y flujos de trabajo.

## Métodos Disponibles

El sistema soporta cuatro métodos de pago principales:

1. Efectivo
2. Pago Móvil
3. Transferencia Bancaria
4. Punto de Venta

## 1. Efectivo

El método de pago en efectivo permite registrar el monto recibido y calcular automáticamente el cambio a devolver.

### Campos

| Campo | Descripción | Tipo | Requerido |
|-------|-------------|------|-----------|
| Monto recibido | Cantidad de dinero entregada por el cliente | Numérico | Sí |

### Validaciones

- El monto recibido debe ser mayor o igual al total de la venta
- No se permite procesar la venta si el monto es menor al total

### Características Especiales

- **Sugerencia de Montos**: El sistema ofrece botones para sugerir montos comunes (+5, +10, +20, +50, +100)
- **Cálculo Automático de Cambio**: El sistema muestra el cambio a devolver
- **Atajos Rápidos**: Se incluyen atajos para establecer montos rápidamente
- **Monto Exacto**: Con Alt+M se puede establecer el monto exacto

### Flujo de Trabajo

1. Seleccionar "Efectivo" como método de pago
2. Ingresar el monto recibido manualmente o usar los botones de sugerencia
3. El sistema calcula automáticamente el cambio
4. Procesar la venta

## 2. Pago Móvil

Este método permite registrar pagos realizados a través de aplicaciones móviles de bancos.

### Campos

| Campo | Descripción | Tipo | Requerido |
|-------|-------------|------|-----------|
| Número de teléfono | Número asociado a la cuenta móvil | Texto | Sí |
| Banco | Entidad financiera que procesa el pago | Selección | Sí |
| Referencia | Código de confirmación de la transacción | Texto | Sí |

### Validaciones

- El número de teléfono debe tener un formato válido
- Se debe seleccionar un banco
- La referencia es obligatoria

### Características Especiales

- **Generación Automática de Referencias**: El sistema puede generar un número de referencia aleatorio
- **Lista de Bancos Predefinida**: Incluye las principales entidades bancarias

### Flujo de Trabajo

1. Seleccionar "Pago Móvil" como método de pago
2. Ingresar el número de teléfono del cliente
3. Seleccionar el banco emisor
4. Ingresar la referencia proporcionada por el cliente o generar una automáticamente
5. Procesar la venta

## 3. Transferencia Bancaria

Permite registrar pagos realizados mediante transferencias entre cuentas bancarias.

### Campos

| Campo | Descripción | Tipo | Requerido |
|-------|-------------|------|-----------|
| Banco origen | Entidad bancaria del cliente | Selección | Sí |
| Banco destino | Entidad bancaria receptora | Selección | Sí |
| Referencia | Código de confirmación de la transferencia | Texto | Sí |

### Validaciones

- Ambos bancos deben ser seleccionados
- La referencia es obligatoria

### Características Especiales

- **Lista de Bancos Predefinida**: Incluye las principales entidades bancarias para origen y destino

### Flujo de Trabajo

1. Seleccionar "Transferencia" como método de pago
2. Seleccionar el banco origen (del cliente)
3. Seleccionar el banco destino (de la empresa)
4. Ingresar la referencia proporcionada por el cliente
5. Procesar la venta

## 4. Punto de Venta

Este método registra pagos realizados con tarjetas de débito o crédito a través de un terminal punto de venta.

### Campos

| Campo | Descripción | Tipo | Requerido |
|-------|-------------|------|-----------|
| Banco | Entidad bancaria de la tarjeta | Selección | Sí |
| Últimos 4 dígitos | Últimos números de la tarjeta | Texto (4 caracteres) | Sí |
| Referencia | Número de lote o aprobación | Texto | Sí |

### Validaciones

- El banco debe ser seleccionado
- Los últimos dígitos deben ser exactamente 4 caracteres numéricos
- La referencia es obligatoria

### Flujo de Trabajo

1. Seleccionar "Punto de Venta" como método de pago
2. Seleccionar el banco emisor de la tarjeta
3. Registrar los últimos 4 dígitos de la tarjeta
4. Ingresar el número de referencia (lote o aprobación)
5. Procesar la venta

## Navegación por Teclado

Todos los métodos de pago están optimizados para una operación eficiente por teclado:

| Atajo | Función |
|-------|---------|
| `Alt+1` | Seleccionar Efectivo |
| `Alt+2` | Seleccionar Pago Móvil |
| `Alt+3` | Seleccionar Transferencia |
| `Alt+4` | Seleccionar Punto de Venta |
| `Tab` | Navegar entre campos |
| `Alt+Enter` | Procesar pago directamente |

## Integración con el Recibo

Los detalles del método de pago seleccionado y la información ingresada se incluyen automáticamente en el recibo generado, proporcionando un registro completo de la transacción para el cliente y para fines contables.

## Consideraciones Técnicas

- Los datos de pago se almacenan temporalmente en el localStorage para recuperación en caso de problemas
- La información sensible de pagos no se almacena permanentemente en el sistema
- Los datos de pago se validan tanto en el frontend como en el backend antes de procesar la venta 