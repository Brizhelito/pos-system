# Guía de Desarrollo - Sistema POS

Esta guía está diseñada para desarrolladores que deseen extender, personalizar o contribuir al Sistema POS. Proporciona información técnica sobre la arquitectura, patrones de diseño y mejores prácticas para el desarrollo.

## Contenido

1. [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Patrones de Diseño](#patrones-de-diseño)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Flujo de Datos](#flujo-de-datos)
7. [Manejo de Estado](#manejo-de-estado)
8. [Base de Datos](#base-de-datos)
9. [APIs y Servicios](#apis-y-servicios)
10. [Testing](#testing)
11. [Despliegue](#despliegue)
12. [Convenciones de Código](#convenciones-de-código)

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js (v18.x o superior)
- npm (v9.x o superior) o yarn (v1.22.x o superior)
- PostgreSQL (v14.x o superior)
- Git

### Pasos para Configurar el Entorno

1. **Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/pos-system.git
cd pos-system
```

2. **Instalar Dependencias**

```bash
npm install
# o con yarn
yarn install
```

3. **Configurar Variables de Entorno**

Copia el archivo `.env.example` a `.env` y configura las variables según tu entorno:

```bash
cp .env.example .env
```

Variables esenciales a configurar:
- `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL
- `SECRET_KEY`: Clave secreta para encriptación y tokens
- `NODE_ENV`: Entorno de desarrollo (development, production)

4. **Configurar la Base de Datos**

```bash
# Generar el cliente Prisma basado en schema.prisma
npx prisma generate

# Crear la estructura de la base de datos
npx prisma migrate dev

# (Opcional) Cargar datos de ejemplo
npm run prisma:seed
```

5. **Iniciar el Servidor de Desarrollo**

```bash
npm run dev
# o con yarn
yarn dev
```

El servidor estará disponible en http://localhost:3000.

## Arquitectura del Sistema

El Sistema POS sigue una arquitectura moderna basada en componentes y organizada por características (feature-based architecture).

### Diagrama General

```
Cliente <--> Next.js Server <--> Base de Datos (PostgreSQL)
```

### Componentes Principales

- **Frontend**: Interfaz de usuario construida con React y componentes de Radix UI
- **Servidor**: API Routes de Next.js para manejar solicitudes del cliente
- **ORM**: Prisma para interactuar con la base de datos
- **Autenticación**: Sistema basado en Iron Session
- **Estado Global**: Contexts de React para manejo de estado a nivel de aplicación

## Stack Tecnológico

### Frontend

- **Framework**: Next.js 15.x - Framework de React con renderizado híbrido
- **UI Components**: Radix UI - Componentes accesibles y sin estilos predefinidos
- **Estilos**: TailwindCSS 4.x - Framework de utilidades CSS
- **Formularios**: React Hook Form - Biblioteca para manejar formularios
- **Validación**: Zod - Validación de esquemas TypeScript-first
- **Gráficos**: Nivo / Recharts - Bibliotecas de visualización de datos
- **Animaciones**: Framer Motion - Biblioteca de animaciones

### Backend

- **API Routes**: Next.js API Routes - Endpoints serverless
- **Database ORM**: Prisma - ORM para TypeScript y Node.js
- **Autenticación**: Iron Session - Manejo de sesiones sin cookies
- **Gestión de Archivos**: ExcelJS / jsPDF - Generación de reportes

### DevOps

- **Linting**: ESLint - Herramienta de análisis estático
- **Formateo**: Prettier - Formateador de código
- **Control de Versiones**: Git - Sistema de control de versiones
- **CI/CD**: GitHub Actions - Automatización de integración y despliegue

## Patrones de Diseño

El sistema implementa varios patrones de diseño para mantener el código organizado y escalable:

### Arquitectura Basada en Características (Feature-Based Architecture)

El código está organizado por dominios funcionales (features) en lugar de por tipo tecnológico, lo que facilita la navegación y el mantenimiento.

### Patrón Repositorio

Para la interacción con la base de datos, utilizamos el patrón repositorio que abstrae la lógica de acceso a datos:

```typescript
// src/lib/db/repositories/ProductRepository.ts
import { prisma } from '@/lib/db/prisma';
import type { Product } from '@prisma/client';

export class ProductRepository {
  async findAll() {
    return prisma.product.findMany({
      include: { category: true, provider: true }
    });
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, provider: true }
    });
  }

  // Más métodos...
}
```

### Patrón Servicio

Implementamos servicios para encapsular la lógica de negocio:

```typescript
// src/lib/services/SaleService.ts
import { SaleRepository } from '@/lib/db/repositories/SaleRepository';
import { ProductRepository } from '@/lib/db/repositories/ProductRepository';
import type { CreateSaleDTO } from '@/types/Sale';

export class SaleService {
  private saleRepository: SaleRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.saleRepository = new SaleRepository();
    this.productRepository = new ProductRepository();
  }

  async createSale(data: CreateSaleDTO) {
    // Lógica de negocio para crear una venta
    // Validaciones, manejo de stock, cálculos, etc.
    
    // Persistencia de datos
    return this.saleRepository.create(data);
  }

  // Más métodos...
}
```

### Context API para Estado Global

Utilizamos React Context para manejar el estado global de la aplicación:

```typescript
// src/contexts/SalesContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { SaleItem, Customer } from '@/types/Sales';

interface SalesContextType {
  items: SaleItem[];
  customer: Customer | null;
  addItem: (item: SaleItem) => void;
  removeItem: (itemId: number) => void;
  setCustomer: (customer: Customer | null) => void;
  // Más métodos...
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementación del provider
  // ...

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
```

## Estructura de Carpetas

La estructura de carpetas sigue un enfoque basado en características y responsabilidades:

```
pos-system/
├── prisma/                 # Esquema de base de datos y migraciones
│   ├── schema.prisma       # Definición del esquema
│   ├── migrations/         # Migraciones de la base de datos
│   └── seed.ts             # Script para poblar la base de datos con datos iniciales
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── app/                # Rutas y páginas (App Router de Next.js)
│   │   ├── (auth)/         # Rutas relacionadas con autenticación
│   │   ├── admin/          # Rutas de la interfaz de administrador
│   │   ├── api/            # Endpoints de la API
│   │   └── seller/         # Rutas de la interfaz de vendedor
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/             # Componentes de UI básicos
│   │   ├── forms/          # Componentes de formulario
│   │   └── layout/         # Componentes de estructura de página
│   ├── contexts/           # Providers de React Context
│   ├── features/           # Características/módulos del sistema
│   │   ├── sales/          # Feature de ventas
│   │   ├── inventory/      # Feature de inventario
│   │   ├── customers/      # Feature de clientes
│   │   └── reports/        # Feature de reportes
│   ├── lib/                # Utilidades y servicios
│   │   ├── api/            # Utilidades para API
│   │   ├── auth/           # Servicios de autenticación
│   │   ├── db/             # Configuración y acceso a base de datos
│   │   ├── services/       # Servicios de negocio
│   │   └── utils/          # Funciones utilitarias
│   ├── providers/          # Proveedores de contexto globales
│   ├── types/              # Definiciones de tipos TypeScript
│   └── utils/              # Utilidades generales
├── docs/                   # Documentación
├── tests/                  # Tests y fixtures
└── scripts/                # Scripts de utilidad
```

## Flujo de Datos

### Cliente-Servidor

1. El cliente envía una solicitud a través de la API de Next.js
2. La solicitud es interceptada por middleware para autenticación
3. Se procesa la solicitud en la ruta API correspondiente
4. Se interactúa con la base de datos a través de Prisma
5. Se envía la respuesta al cliente

### Frontend

1. Los componentes de React manejan la interacción del usuario
2. Las acciones del usuario desencadenan actualizaciones de estado
3. El estado actualizado se propaga a través de contexts
4. Los componentes se vuelven a renderizar con los nuevos datos

## Manejo de Estado

### Estado Local

Para estado específico de componentes, utilizamos useState de React:

```tsx
const [quantity, setQuantity] = useState<number>(1);
```

### Estado Global

Para estado compartido entre múltiples componentes, utilizamos Context API:

```tsx
const { items, addItem, removeItem } = useSales();
```

## Base de Datos

### Esquema

El esquema de la base de datos está definido en Prisma:

```prisma
// Ejemplo simplificado
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(SELLER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sales     Sale[]
}

model Product {
  id            Int       @id @default(autoincrement())
  name          String
  description   String?
  purchasePrice Float
  sellingPrice  Float
  stock         Int
  minStock      Int
  categoryId    Int
  providerId    Int
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  category      Category  @relation(fields: [categoryId], references: [id])
  provider      Provider  @relation(fields: [providerId], references: [id])
  saleItems     SaleItem[]
}

// Más modelos...
```

### Prisma Client

Usamos Prisma Client para interactuar con la base de datos:

```typescript
// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

## APIs y Servicios

### API Routes

Las API Routes de Next.js se utilizan para crear endpoints:

```typescript
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // Implementación para crear un producto
}
```

### Capa de Servicio

Implementamos una capa de servicio para encapsular la lógica de negocio:

```typescript
// src/lib/services/ReportService.ts
import { prisma } from '@/lib/db/prisma';
import { DateRange } from '@/types/Reports';

export class ReportService {
  async getSalesSummary(dateRange: DateRange, userId?: number) {
    const { startDate, endDate } = dateRange;
    
    const query: any = {
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      }
    };
    
    if (userId) {
      query.where.userId = userId;
    }
    
    const sales = await prisma.sale.findMany(query);
    
    // Procesar y analizar datos
    
    return {
      totalSales: sales.length,
      totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      // Más estadísticas...
    };
  }
  
  // Más métodos para diferentes tipos de reportes
}
```

## Testing

Utilizamos Jest para pruebas unitarias e integración:

### Ejemplo de Test Unitario

```typescript
// tests/units/utils/calculations.test.ts
import { calculateTotalWithTax, applyDiscount } from '@/utils/calculations';

describe('Calculation Utils', () => {
  test('calculateTotalWithTax should add tax correctly', () => {
    expect(calculateTotalWithTax(100, 0.16)).toBe(116);
  });
  
  test('applyDiscount should reduce price correctly', () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });
});
```

### Ejemplo de Test de Integración

```typescript
// tests/integration/api/products.test.ts
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/products/route';
import { prismaMock } from '../mocks/prisma';

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(() => ({ user: { id: 1, role: 'ADMIN' } })),
}));

describe('Products API', () => {
  test('GET should return products', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1, name: 'Test Product', price: 100 },
    ]);
    
    const { req } = createMocks({ method: 'GET' });
    const response = await GET(req);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Test Product');
  });
});
```

## Despliegue

### Preparación para Producción

```bash
# Construir la aplicación para producción
npm run build

# Iniciar la aplicación en modo producción
npm start
```

### Consideraciones para Producción

- Configura variables de entorno para producción
- Utiliza un servicio de base de datos gestionado (AWS RDS, Digital Ocean, etc.)
- Configura estrategias de caché cuando sea posible
- Implementa monitoreo y registro (logging)
- Configura un dominio personalizado y certificados SSL

## Convenciones de Código

### Nombrado

- **Archivos de Componentes**: PascalCase (ej. `ProductCard.tsx`)
- **Archivos de Utilidades**: camelCase (ej. `formatCurrency.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `MAX_PRODUCTS_PER_PAGE`)
- **Interfaces/Types**: PascalCase con prefijo 'I' para interfaces (ej. `IProduct`)
- **Enums**: PascalCase (ej. `PaymentMethod`)

### Imports

Organizamos los imports en este orden:
1. Librerías externas
2. Componentes
3. Hooks y contexts
4. Utilidades y tipos
5. Estilos

### Comentarios

Utilizamos comentarios JSDoc para funciones y componentes principales:

```typescript
/**
 * Calcula el subtotal de una lista de productos
 * @param items - Lista de items del carrito
 * @returns El subtotal calculado
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
```

### Errores y Excepciones

Utilizamos un enfoque consistente para el manejo de errores:

```typescript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Error específico:', error);
  throw new Error(`Operación fallida: ${error.message}`);
}
```

## Contribución

Si deseas contribuir al proyecto, consulta la [Guía de Contribución](CONTRIBUTING.md) para conocer el proceso de envío de Pull Requests, convenciones de código y flujo de trabajo de Git.

---

Para más información, consulta la [API Reference](api-reference.md) o contacta al equipo de desarrollo en developers@sistema-pos.com. 