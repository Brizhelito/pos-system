# Estructura Modular para la Feature de Reportes

Este documento describe la estructura modular propuesta para reorganizar la feature de reportes y mejorar su mantenibilidad y consistencia.

## Principios de Diseño

- **Separación de Responsabilidades**: Cada componente, hook, o servicio debe tener una responsabilidad única y clara.
- **Reusabilidad**: Maximizar la reutilización de código mediante componentes compartidos.
- **Consistencia**: Mantener patrones de diseño y estilos consistentes en toda la feature.
- **Escalabilidad**: Facilitar la adición de nuevos tipos de reportes o características.

## Estructura Propuesta

```
src/features/reports/
├── components/                  # Componentes UI para reportes
│   ├── index.ts                 # Barril para exportar componentes
│   ├── common/                  # Componentes comunes a todos los reportes
│   │   ├── DateRangePicker.tsx  # Selector de rango de fechas
│   │   ├── ExportButtons.tsx    # Botones de exportación
│   │   └── Pagination.tsx       # Componente de paginación
│   ├── layout/                  # Componentes de layout
│   │   ├── ReportLayout.tsx     # Layout compartido para reportes
│   │   └── ReportHeader.tsx     # Encabezado compartido para reportes
│   ├── ui/                      # Componentes base de UI para reportes
│   │   ├── ReportCard.tsx       # Tarjeta estándar para reportes
│   │   ├── ReportMetricCards.tsx # Tarjetas para métricas
│   │   ├── ReportTabs.tsx       # Pestañas para secciones de reportes
│   │   └── ReportLoadingSkeleton.tsx # Esqueletos de carga
│   ├── data-display/            # Componentes para visualización de datos
│   │   ├── ReportDataTable.tsx  # Componente de tabla para reportes
│   │   ├── ReportBarChart.tsx   # Gráfico de barras estandarizado
│   │   └── ReportLineChart.tsx  # Gráfico de líneas estandarizado
│   ├── sales/                   # Componentes específicos para reportes de ventas
│   ├── inventory/               # Componentes específicos para reportes de inventario
│   ├── customers/               # Componentes específicos para reportes de clientes
│   └── sellers/                 # Componentes específicos para reportes de vendedores
├── hooks/                       # Hooks personalizados
│   ├── index.ts                 # Barril para exportar hooks
│   ├── useReportDateRange.ts    # Hook para manejar rangos de fechas
│   ├── usePagination.ts         # Hook para manejar paginación
│   └── useReportSorting.ts      # Hook para manejar ordenamiento
├── services/                    # Servicios para acceso a datos
│   ├── index.ts                 # Barril para exportar servicios
│   ├── sales/                   # Servicios relacionados con ventas
│   ├── inventory/               # Servicios relacionados con inventario
│   ├── customers/               # Servicios relacionados con clientes
│   └── sellers/                 # Servicios relacionados con vendedores
├── utils/                       # Utilidades compartidas
│   ├── index.ts                 # Barril para exportar utilidades
│   ├── reportServices.ts        # Cliente API para servicios de reportes
│   ├── reportHelpers.ts         # Funciones auxiliares para reportes
│   └── exportUtils.ts           # Utilidades para exportación de datos
├── types/                       # Tipos y interfaces
│   └── index.ts                 # Tipos compartidos para reportes
├── constants/                   # Constantes compartidas
│   ├── index.ts                 # Barril para exportar constantes
│   ├── reportConfig.ts          # Configuraciones para reportes
│   └── chartColors.ts           # Colores estandarizados para gráficos
└── README.md                    # Documentación de la feature
```

## Estandarización de Componentes

Se propone crear versiones estandarizadas de componentes comunes:

1. **ReportCard**: Componente base para tarjetas con título, subtítulo y contenido
2. **ReportBarChart**: Componente base para gráficos de barras con opciones estándar
3. **ReportLineChart**: Componente base para gráficos de líneas con opciones estándar
4. **ReportTable**: Componente base para tablas con funcionalidades comunes

## Convenciones de Nombrado

- **Componentes**: PascalCase (ej. ReportDataTable)
- **Hooks**: camelCase con prefijo "use" (ej. useReportDateRange)
- **Servicios**: PascalCase con sufijo "Service" (ej. InventoryReportService)
- **Utilidades**: camelCase (ej. formatCurrency)
- **Tipos/Interfaces**: PascalCase (ej. ReportConfiguration)

## Patrones de Importación

Se recomienda usar barriles (index.ts) para exportar componentes, hooks, utilidades, etc., facilitando importaciones más limpias:

```typescript
// Antes
import { ReportDataTable } from "@/features/reports/components/data-table/ReportDataTable";
import { useReportDateRange } from "@/features/reports/hooks/useReportDateRange";

// Después
import { ReportDataTable } from "@/features/reports/components";
import { useReportDateRange } from "@/features/reports/hooks";
```

## Próximos Pasos de Implementación

1. Crear directorios y barriles para la nueva estructura
2. Migrar componentes existentes a sus nuevas ubicaciones
3. Estandarizar componentes repetitivos
4. Actualizar importaciones en todo el código
5. Crear documentación para nuevos componentes compartidos 