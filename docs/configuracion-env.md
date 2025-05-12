# Configuración de Variables de Entorno

Este documento describe las variables de entorno disponibles para configurar el sistema POS.

## Cómo usar

1. Crea un archivo llamado `.env` en la raíz del proyecto.
2. Copia las variables de este documento y configura sus valores.
3. Reinicia la aplicación para que los cambios tengan efecto.

## Variables disponibles

### Base de datos
```
DATABASE_URL="postgresql://username:password@localhost:5432/pos_system"
```

### Autenticación
```
SECRET_COOKIE_PASSWORD="" # Mínimo 32 caracteres
BCRYPT_PEPPER="" # Un valor secreto para adicional seguridad
SESSION_DURATION_DAYS=7
```

### Información de la empresa
```
COMPANY_NAME="Mundo de la Pasta"
COMPANY_ADDRESS="Av. Principal 123"
COMPANY_CITY="Ciudad, Estado"
COMPANY_ZIP="12345"
COMPANY_PHONE="+58 123-456-7890"
COMPANY_EMAIL="contacto@mundo.com"
COMPANY_RIF="J-12345678-9"
COMPANY_WEBSITE="www.mundo.com"
COMPANY_LOGO_URL="/logo.png"
```

### Configuración de impuestos
```
TAX_RATE=0.16
TAX_LABEL="IVA"
TAX_ENABLED=true
```

### Configuración de moneda
```
CURRENCY_CODE="USD"
CURRENCY_SYMBOL="$"
CURRENCY_LOCALE="en-US"
```

### Configuración de facturación
```
INVOICE_PREFIX="FAC-"
```

### Configuración de la aplicación
```
APP_NAME="POS System"
DEFAULT_PAYMENT_METHOD="EFECTIVO"
DEFAULT_PAGINATION_LIMIT=20
```

## Notas importantes

- Nunca compartas tu archivo `.env` en repositorios públicos.
- Las variables `SECRET_COOKIE_PASSWORD` y `BCRYPT_PEPPER` deben ser valores seguros y únicos.
- Para producción, asegúrate de configurar todas las variables con valores apropiados.
- La variable `DATABASE_URL` debe apuntar a tu base de datos de producción cuando estés en ese entorno.

## Módulos de configuración

El sistema utiliza un enfoque centralizado para la configuración a través de los siguientes archivos:

1. **src/lib/config/env.ts**: Carga todas las variables de entorno con valores por defecto.
2. **src/utils/constants.ts**: Exporta las configuraciones para uso global.
3. **src/lib/config/db-config.ts**: Proporciona utilidades para manejar configuraciones en base de datos.

### Utilidades de formato

Para mantener la consistencia en toda la aplicación, utiliza las siguientes funciones:

```typescript
// Importar utilidades de formato
import { formatCurrency, formatDate, formatDateTime, formatPercent } from "@/utils/format";

// Formatear moneda
formatCurrency(100.50); // "$100.50" (usa la configuración global)

// Formatear fecha
formatDate(new Date()); // "01/01/2023" (formato según configuración)

// Formatear fecha y hora
formatDateTime(new Date()); // "01/01/2023, 12:30:45" (formato según configuración)

// Formatear porcentaje
formatPercent(0.16); // "16.00%" (formato según configuración)
```

### Acceso a configuración en base de datos

Para trabajar con la configuración almacenada en la base de datos:

```typescript
// Importar utilidades
import { getConfigValue, setConfigValue, getConfigValues } from "@/lib/config/db-config";

// Obtener un valor
const taxRate = await getConfigValue("tax_rate", "16");

// Establecer un valor
await setConfigValue("invoice_prefix", "INV-");

// Obtener múltiples valores
const configs = await getConfigValues(["tax_rate", "invoice_prefix"]);
``` 