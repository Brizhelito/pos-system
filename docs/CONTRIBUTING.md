# Guía de Contribución - Sistema POS

¡Gracias por tu interés en contribuir al Sistema POS! Esta guía proporciona toda la información necesaria para realizar contribuciones efectivas al proyecto.

## Índice

1. [Código de Conducta](#código-de-conducta)
2. [Primeros Pasos](#primeros-pasos)
3. [Flujo de Trabajo de Git](#flujo-de-trabajo-de-git)
4. [Estándares de Código](#estándares-de-código)
5. [Pull Requests](#pull-requests)
6. [Reportar Bugs](#reportar-bugs)
7. [Solicitar Features](#solicitar-features)
8. [Documentación](#documentación)
9. [Pruebas](#pruebas)
10. [Preguntas](#preguntas)

## Código de Conducta

Este proyecto y todos sus participantes están regidos por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## Primeros Pasos

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18.x o superior)
- npm (v9.x o superior) o yarn (v1.22.x o superior)
- PostgreSQL (v14.x o superior)
- Git

### Configuración del Entorno

1. Haz un fork del repositorio
2. Clona tu fork:
   ```bash
   git clone https://github.com/tu-usuario/pos-system.git
   cd pos-system
   ```
3. Añade el repositorio original como "upstream":
   ```bash
   git remote add upstream https://github.com/repositorio-original/pos-system.git
   ```
4. Instala dependencias:
   ```bash
   npm install
   # o con yarn
   yarn install
   ```
5. Copia el archivo .env.example a .env y configura las variables
6. Configura la base de datos:
   ```bash
   npx prisma migrate dev
   ```
7. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Flujo de Trabajo de Git

Seguimos una versión simplificada del modelo [GitHub Flow](https://guides.github.com/introduction/flow/):

1. Crea una rama para tu contribución desde `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/nombre-de-caracteristica
   # O para correcciones:
   git checkout -b fix/nombre-del-bug
   ```

2. Realiza tus cambios, siguiendo las [convenciones de código](#estándares-de-código)

3. Asegúrate de que tu código pase todas las pruebas:
   ```bash
   npm run test
   npm run lint
   ```

4. Haz commits de tus cambios siguiendo las [convenciones de commits](#convenciones-de-commits):
   ```bash
   git add .
   git commit -m "feat: añadir funcionalidad X"
   ```

5. Push a tu fork:
   ```bash
   git push origin feature/nombre-de-caracteristica
   ```

6. Abre un Pull Request hacia la rama `develop` del repositorio original

### Convenciones de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit claros y estructurados:

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[pie opcional]
```

Tipos comunes:
- `feat`: Nueva característica
- `fix`: Corrección de un bug
- `docs`: Cambios de documentación
- `style`: Cambios que no afectan al código (formato, espacios, etc.)
- `refactor`: Refactorización del código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o corregir pruebas
- `chore`: Cambios en el proceso de build o herramientas auxiliares

Ejemplos:
```
feat(ventas): añadir opción de pago mixto

fix(auth): corregir validación de contraseña

docs(readme): actualizar instrucciones de instalación
```

## Estándares de Código

### Formateo y Linting

- Usamos ESLint para el linting
- Prettier para formateo consistente
- TypeScript para el tipado estático

Asegúrate de que tu código siga las reglas configuradas:
```bash
npm run lint
npm run format
```

Para evitar problemas, considera configurar tu editor para formatear al guardar.

### Convenciones de Nomenclatura

- **Archivos**: 
  - Componentes: PascalCase (ej. `ProductCard.tsx`)
  - Utilitarios: camelCase (ej. `formatCurrency.ts`)
  - Constantes: UPPER_SNAKE_CASE (ej. `APP_CONSTANTS.ts`)
  
- **Nombrado**:
  - Componentes: PascalCase (ej. `ProductCard`)
  - Funciones/Variables: camelCase (ej. `calculateTotal`)
  - Interfaces/Types: PascalCase (ej. `ProductInterface`)
  - Constantes: UPPER_SNAKE_CASE (ej. `MAX_PRODUCTS`)

### Estructura de Componentes

Para componentes React, seguimos este patrón:

```tsx
// Importaciones agrupadas por tipo
import React, { useState, useEffect } from 'react';
// Componentes UI primero
import { Button, Card } from '@/components/ui';
// Luego hooks y utilitarios
import { useProducts } from '@/hooks';
import { formatCurrency } from '@/utils';
// Tipos al final de las importaciones
import type { Product } from '@/types';

// Props con interface o type
interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

// Componente como función nombrada y con tipos
export function ProductCard({ product, onSelect }: ProductCardProps) {
  // Estado y lógica
  const [isSelected, setIsSelected] = useState(false);
  
  // Funciones auxiliares dentro del componente
  const handleClick = () => {
    setIsSelected(!isSelected);
    onSelect(product);
  };
  
  // JSX con indentación consistente
  return (
    <Card className={isSelected ? 'selected' : ''}>
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price)}</p>
      <Button onClick={handleClick}>
        {isSelected ? 'Deseleccionar' : 'Seleccionar'}
      </Button>
    </Card>
  );
}
```

## Pull Requests

### Proceso de PR

1. Asegúrate de que tu código sigue todas las [convenciones](#estándares-de-código)
2. Verifica que todas las pruebas pasen
3. Crea un PR desde tu rama feature/fix a la rama `develop` del repositorio principal
4. Completa la plantilla de PR con:
   - Descripción clara de los cambios
   - Referencias a issues relacionados
   - Capturas de pantalla (si aplica)
   - Pasos para probar los cambios

### Revisión de Código

- Cada PR requiere al menos una revisión aprobada para ser mergeado
- Responde a los comentarios y sugerencias de manera oportuna
- Realiza los cambios solicitados en la misma rama

## Reportar Bugs

Para reportar un bug, crea un issue siguiendo la plantilla de bug report y proporciona:

- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs. actual
- Capturas de pantalla (si aplica)
- Contexto adicional (navegador, SO, etc.)

## Solicitar Features

Para solicitar una nueva característica, crea un issue usando la plantilla de feature request:

- Describe claramente la característica deseada
- Explica por qué sería valiosa
- Sugiere cómo podría implementarse (opcional)
- Proporciona ejemplos o mockups (si aplica)

## Documentación

La buena documentación es tan importante como el código:

- Actualiza README.md si los cambios impactan el uso general
- Documenta nuevas características en `docs/`
- Usa comentarios JSDoc para funciones y componentes complejos
- Mantén los comentarios actualizados con el código

### JSDoc

Ejemplo de documentación de función con JSDoc:

```typescript
/**
 * Calcula el total de una venta aplicando impuestos y descuentos
 * 
 * @param {SaleItem[]} items - Productos en el carrito
 * @param {number} taxRate - Tasa de impuesto (ej: 0.16 para 16%)
 * @param {number} [discount=0] - Descuento a aplicar (opcional)
 * @returns {number} El total calculado
 * 
 * @example
 * const items = [{price: 100, quantity: 2}, {price: 50, quantity: 1}];
 * const total = calculateTotal(items, 0.16, 10);
 * // Retorna: 278.8 (250 + 16% - 10)
 */
function calculateTotal(items: SaleItem[], taxRate: number, discount: number = 0): number {
  // Implementación...
}
```

## Pruebas

Implementamos diferentes tipos de pruebas:

- **Unitarias**: Para funciones y componentes aislados
- **Integración**: Para interacciones entre componentes
- **E2E**: Para flujos completos de usuario

### Escribir Pruebas

- Cada nueva característica debe incluir pruebas
- Las correcciones de bugs deben incluir pruebas que eviten regresiones
- Usa patrones descriptivos para nombrar tests:
  ```typescript
  describe('ProductCard', () => {
    it('debería mostrar el nombre y precio del producto', () => {
      // ...
    });
    
    it('debería llamar a onSelect cuando se hace click en el botón', () => {
      // ...
    });
  });
  ```

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm run test

# Pruebas específicas
npm run test -- -t "nombre del test"

# Cobertura
npm run test:coverage
```

## Preguntas

Si tienes preguntas o necesitas ayuda:

1. Consulta la [documentación existente](docs/)
2. Revisa los [issues abiertos](https://github.com/repositorio-original/pos-system/issues)
3. Abre un [nuevo issue](https://github.com/repositorio-original/pos-system/issues/new) con la etiqueta "question"
4. Contacta al equipo de desarrollo: developers@sistema-pos.com

---

¡Gracias por contribuir al Sistema POS! Tu ayuda es invaluable para hacer este proyecto mejor para todos. 