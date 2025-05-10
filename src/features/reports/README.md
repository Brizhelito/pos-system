# Feature de Reportes

Esta feature proporciona componentes, hooks y servicios para la generación y visualización de reportes en la aplicación.

## Estructura

La estructura de la feature sigue un enfoque modular para facilitar la mantenibilidad y escalabilidad:

```
src/features/reports/
├── components/                  # Componentes UI para reportes
│   ├── common/                  # Componentes comunes (DateRangePicker, ExportButtons, etc.)
│   ├── layout/                  # Componentes de layout (ReportLayout, ReportHeader)
│   ├── ui/                      # Componentes base de UI (ReportCard, ReportMetricCards, etc.)
│   ├── data-display/            # Componentes para visualización de datos (tablas, gráficos)
│   ├── sales/                   # Componentes específicos para reportes de ventas
│   ├── inventory/               # Componentes específicos para reportes de inventario
│   ├── customers/               # Componentes específicos para reportes de clientes
│   └── sellers/                 # Componentes específicos para reportes de vendedores
├── hooks/                       # Hooks personalizados
├── services/                    # Servicios para acceso a datos
├── utils/                       # Utilidades compartidas
├── types/                       # Tipos e interfaces
├── config/                      # Configuraciones globales
└── constants/                   # Constantes compartidas
```

## Componentes Principales

### Componentes Comunes
- `DateRangePicker`: Selector de rango de fechas con soporte para rangos predefinidos
  - Incluye opciones como "Hoy", "Esta semana", "Último mes", etc.
  - Selector de calendario para selección personalizada
  - Diseño responsivo para móvil
- `ExportButtons`: Botones para exportar datos en diferentes formatos
- `Pagination`: Componente de paginación

### Componentes de Layout
- `ReportLayout`: Layout compartido para reportes
- `ReportHeader`: Encabezado compartido para reportes

### Componentes UI Base
- `ReportCard`: Tarjeta estándar para reportes
- `ReportMetricCards`: Tarjetas para métricas
- `ReportTabs`: Pestañas para secciones de reportes
- `ReportLoadingSkeleton`: Esqueletos de carga

### Componentes de Visualización de Datos
- `ReportDataTable`: Componente de tabla para reportes con soporte para:
  - Columnas personalizables
  - Filtros
  - Exportación
  - Estado de carga
  - Verificación de existencia de columnas
  - Resumen de datos
- `SellerTrendChart`: Gráfico de tendencias para vendedores
  - Múltiples tipos de visualización (líneas, barras, área)
  - Filtrado por vendedor
  - Filtrado por fecha
  - Vista apilada o individual
  - Métricas de rendimiento
- `TopSellerProductsTable`: Tabla de productos más vendidos por vendedor

## Mejoras Recientes
- Se optimizó el selector de fechas (`DateRangePicker`) con:
  - Sistema de pestañas para navegar entre calendario y rangos predefinidos
  - Interfaz mejorada para dispositivos móviles
  - Mayor consistencia visual con el resto de la aplicación
- Se resolvieron problemas de rendimiento en gráficos:
  - Inicialización de estados usando `useEffect`
  - Evitado de ciclos de renderizado innecesarios
  - Mejor manejo de datos vacíos o incompletos
- Centralización de configuraciones:
  - Formato de moneda
  - Paletas de colores
  - Opciones por defecto

## Uso

### Ejemplo de uso de componentes

```tsx
import { 
  ReportLayout, 
  ReportHeader, 
  ReportDataTable,
  ReportMetricCards,
  DateRangePicker  
} from "@/features/reports/components";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function SalesReport() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range && range.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from,
      });
    }
  };

  return (
    <ReportLayout>
      <ReportHeader 
        title="Reporte de Ventas" 
        backLink="/admin/reports"
      >
        <DateRangePicker 
          dateRange={dateRange}
          setDateRange={handleDateRangeChange}
        />
      </ReportHeader>
      
      {/* Resto del reporte */}
    </ReportLayout>
  );
}
```

## Convenciones

- Los componentes siguen el patrón de diseño de componentes controlados
- Se utilizan archivos barril (index.ts) para exportar componentes
- Los nombres de componentes siguen el formato PascalCase
- Los hooks siguen el formato camelCase con prefijo "use"

## Servicios

Los servicios están organizados en clases estáticas para cada tipo de reporte:

- `SalesReportService`: Reportes relacionados con ventas
- `InventoryReportService`: Reportes relacionados con inventario
- `CustomerReportService`: Reportes relacionados con clientes
- `SellerReportService`: Reportes relacionados con vendedores

Estos servicios contienen la lógica de negocio para obtener y procesar datos desde la base de datos.

## API

La comunicación con el backend se realiza a través de clases cliente en `utils/reportServices.ts`:

- `SalesReportsApi`: Cliente para los endpoints de reportes de ventas
- `InventoryReportsApi`: Cliente para los endpoints de reportes de inventario
- `CustomerReportsApi`: Cliente para los endpoints de reportes de clientes
- `SellerReportsApi`: Cliente para los endpoints de reportes de vendedores

## Endpoints

Los endpoints están protegidos y solo pueden ser accedidos por administradores en:

- `/api/admin/reports/sales`
- `/api/admin/reports/inventory`
- `/api/admin/reports/customers`
- `/api/admin/reports/sellers`

## Páginas

Las páginas de reportes se encuentran en:

- `/admin/reports/sales`
- `/admin/reports/inventory`
- `/admin/reports/customers`
- `/admin/reports/sellers`

## Configuraciones Globales

Las configuraciones globales para los reportes se encuentran en `config/constants.ts`:

```tsx
// Configuración de moneda
export const CURRENCY = {
  symbol: "€",
  code: "EUR",
  name: "Euro",
  format: (value: number) => `${CURRENCY.symbol}${value.toFixed(2)}`,
};

// Configuración de gráficos
export const CHART_COLORS = {
  primary: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
  secondary: ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"],
  accent: ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff"],
  danger: ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca"],
  warning: ["#ca8a04", "#eab308", "#facc15", "#fde047", "#fef08a"],
};

// Configuración de fechas
export const DATE_FORMAT = "dd/MM/yyyy";

// Opciones para los reportes
export const REPORT_OPTIONS = {
  maxItemsInTables: 100,
  maxItemsInCharts: 10,
  defaultDateRange: 30, // días
};
```

## Optimizaciones

- Uso de React.memo para componentes de renderizado intensivo
- Lazy loading de componentes pesados
- Uso de useMemo para cálculos costosos y preparación de datos
- Paginación de tablas para manejo de grandes conjuntos de datos
- Comprobación de existencia de columnas en tablas dinámicas
- Sincronización eficiente de filtros y selección de fechas

## Acceso

Todo el sistema de reportes está restringido a usuarios con rol de administrador. Cualquier acceso a las rutas de reportes sin los permisos adecuados será redirigido a la página de no autorizado (`/unauthorized`).

# Componentes de Reportes

Este directorio contiene los componentes utilizados para la generación y visualización de reportes en el sistema POS.

## AdvancedDateRangePicker

El componente `AdvancedDateRangePicker` es una mejora significativa sobre el selector de rangos de fecha anterior. Ofrece:

- **Interfaz dual**: Selector de calendario y lista de rangos predefinidos
- **Rangos predefinidos comunes**: Hoy, Ayer, Esta semana, Últimos 7/30/90 días, etc.
- **Búsqueda de rangos**: Permite buscar entre los rangos predefinidos
- **Opciones personalizables**: Permite añadir rangos de fechas adicionales
- **Diseño adaptable**: Modos horizontal y compacto (vertical)
- **Selección inteligente**: Detecta y muestra el nombre del rango seleccionado

### Uso básico

```tsx
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AdvancedDateRangePicker } from "@/features/reports/components/ui/AdvancedDateRangePicker";

export default function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <AdvancedDateRangePicker
      value={dateRange}
      onChange={setDateRange}
    />
  );
}
```

### Opciones de personalización

```tsx
<AdvancedDateRangePicker
  value={dateRange}
  onChange={setDateRange}
  align="end"
  showIcon={false}
  compact={true}
  placeholder="Seleccione un período"
  additionalOptions={[
    {
      label: "Todo el registro",
      value: "all_time",
      dateRange: {
        from: new Date(2020, 0, 1),
        to: new Date(),
      },
    },
  ]}
  className="border p-3 rounded-md"
/>
```

## Mejoras sobre el componente anterior

1. **Experiencia de usuario mejorada**:
   - Interfaz más intuitiva y completa
   - Búsqueda de rangos predefinidos
   - Botones de acceso rápido a rangos comunes

2. **Personalización**:
   - Más opciones de configuración
   - Soporte para rangos personalizados

3. **Reconocimiento inteligente**:
   - Detecta automáticamente cuando un rango coincide con uno predefinido

4. **Diseño adaptable**:
   - Opciones para diferentes tamaños de pantalla y layouts

5. **Componentes modernos**:
   - Uso de Command para búsqueda y selección
   - Mejor accesibilidad y usabilidad 