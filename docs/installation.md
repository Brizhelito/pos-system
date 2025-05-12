# Guía de Instalación - Sistema POS

Esta guía detalla el proceso de instalación y configuración del Sistema POS en diferentes entornos.

## Contenido

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación para Desarrollo](#instalación-para-desarrollo)
3. [Instalación para Producción](#instalación-para-producción)
4. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
5. [Variables de Entorno](#variables-de-entorno)
6. [Despliegue en Distintas Plataformas](#despliegue-en-distintas-plataformas)
7. [Solución de Problemas](#solución-de-problemas)

## Requisitos Previos

Para instalar y ejecutar el Sistema POS, necesitarás:

### Software Necesario

- **Node.js**: Versión 18.x o superior
  - [Descargar Node.js](https://nodejs.org/)
  - Verifica la instalación: `node --version`
  
- **npm** (viene con Node.js) o **Yarn**
  - Para Yarn: `npm install -g yarn`
  - Verifica la instalación: `npm --version` o `yarn --version`
  
- **PostgreSQL**: Versión 14.x o superior
  - [Descargar PostgreSQL](https://www.postgresql.org/download/)
  - Verifica la instalación: `psql --version`
  
- **Git**: Última versión estable
  - [Descargar Git](https://git-scm.com/downloads)
  - Verifica la instalación: `git --version`

### Requisitos de Hardware (Recomendados)

- **Desarrollo**:
  - Procesador: 2 núcleos o más
  - RAM: 4GB o más
  - Espacio en disco: Al menos 2GB disponibles
  
- **Producción** (dependiendo del volumen esperado):
  - Procesador: 4 núcleos o más
  - RAM: 8GB o más
  - Espacio en disco: Al menos 10GB disponibles (más para almacenamiento de datos a largo plazo)

## Instalación para Desarrollo

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/pos-system.git
cd pos-system
```

### 2. Instalar Dependencias

```bash
# Con npm
npm install

# Con Yarn
yarn install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las variables necesarias (ver sección [Variables de Entorno](#variables-de-entorno)).

### 4. Configurar la Base de Datos

Asegúrate de que PostgreSQL esté ejecutándose y crea una base de datos:

```bash
# Acceder a PostgreSQL
psql -U postgres

# En la consola de PostgreSQL
CREATE DATABASE pos_system;
CREATE USER pos_user WITH ENCRYPTED PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE pos_system TO pos_user;
\q
```

Actualiza la variable `DATABASE_URL` en tu archivo `.env` con los datos de conexión.

### 5. Ejecutar Migraciones de la Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

### 6. (Opcional) Cargar Datos de Ejemplo

```bash
npm run prisma:seed
# o
yarn prisma:seed
```

### 7. Iniciar el Servidor de Desarrollo

```bash
npm run dev
# o
yarn dev
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000)

## Instalación para Producción

### 1. Clonar el Repositorio (opcional si ya lo has hecho)

```bash
git clone --depth 1 -b main https://github.com/tu-usuario/pos-system.git
cd pos-system
```

### 2. Instalar Dependencias de Producción

```bash
# Con npm
npm ci --only=production

# Con Yarn
yarn install --production
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.production`:

```bash
cp .env.example .env.production
```

Edita `.env.production` con los valores adecuados para producción. Asegúrate de establecer:
- `NODE_ENV=production`
- Configura URLs y credenciales seguras
- Ajusta cualquier otro parámetro específico de producción

### 4. Compilar la Aplicación

```bash
# Con npm
npm run build

# Con Yarn
yarn build
```

### 5. Ejecutar Migraciones de Base de Datos

```bash
# Asegúrate de que NODE_ENV esté configurado correctamente
NODE_ENV=production npx prisma migrate deploy
```

### 6. Iniciar el Servidor de Producción

```bash
# Con npm
npm start

# Con Yarn
yarn start
```

## Configuración de la Base de Datos

El Sistema POS utiliza PostgreSQL como base de datos relacional a través de Prisma ORM.

### Estructura del Esquema

El esquema de la base de datos está definido en `prisma/schema.prisma`. Incluye:

- Tablas para usuarios, productos, categorías, clientes, ventas, etc.
- Relaciones entre tablas
- Índices para optimizar consultas frecuentes

### Migraciones

Prisma gestiona las migraciones para mantener la estructura de la base de datos actualizada:

```bash
# Crear una nueva migración después de cambiar schema.prisma
npx prisma migrate dev --name descripcion_del_cambio

# Aplicar migraciones existentes (producción)
npx prisma migrate deploy
```

### Respaldos

Es crucial mantener respaldos regulares de la base de datos:

```bash
# Crear un respaldo manual
pg_dump -U usuario -d pos_system > backup_fecha.sql

# Restaurar desde un respaldo
psql -U usuario -d pos_system < backup_fecha.sql
```

Para automatizar respaldos, considera usar herramientas como `cron` en Linux o el Programador de Tareas en Windows.

## Variables de Entorno

El sistema utiliza variables de entorno para configuración. Aquí las más importantes:

### Variables Esenciales

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URI de conexión a PostgreSQL | `postgresql://usuario:contraseña@localhost:5432/pos_system` |
| `NODE_ENV` | Entorno de ejecución | `development`, `production`, `test` |
| `SECRET_KEY` | Clave para cookies y JWT | Cadena aleatoria de 32+ caracteres |
| `PORT` | Puerto para el servidor | `3000` |

### Variables Opcionales

| Variable | Descripción | Valor Predeterminado |
|----------|-------------|---------------------|
| `LOG_LEVEL` | Nivel de detalle de logs | `info` |
| `ENABLE_ANALYTICS` | Activar análisis de uso | `false` |
| `CURRENCY_SYMBOL` | Símbolo de moneda | `$` |
| `TAX_RATE` | Tasa de impuesto predeterminada | `0.16` |

## Despliegue en Distintas Plataformas

### Vercel (Recomendado)

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Despliega:
   ```bash
   vercel
   ```

3. Para producción:
   ```bash
   vercel --prod
   ```

4. Configura las variables de entorno en el panel de Vercel.

### Docker

1. Construye la imagen:
   ```bash
   docker build -t pos-system .
   ```

2. Ejecuta el contenedor:
   ```bash
   docker run -p 3000:3000 --env-file .env.production pos-system
   ```

### VPS / Servidor Propio

1. Configura un servidor con Node.js y PostgreSQL instalados.

2. Clona el repositorio y sigue los pasos de instalación para producción.

3. Configura un proxy inverso con Nginx:
   ```nginx
   server {
       listen 80;
       server_name tudominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. Configura SSL con Certbot:
   ```bash
   certbot --nginx -d tudominio.com
   ```

5. Usa PM2 para mantener la aplicación en ejecución:
   ```bash
   npm install -g pm2
   pm2 start npm --name "pos-system" -- start
   pm2 startup
   pm2 save
   ```

## Solución de Problemas

### Problemas Comunes de Instalación

#### Error: "Prisma Schema validation error"
- **Solución**: Verifica que tu versión de Prisma CLI coincida con la versión de `@prisma/client` en `package.json`.

#### Error de conexión a PostgreSQL
- **Solución**: 
  1. Verifica que PostgreSQL esté en ejecución: `sudo service postgresql status`
  2. Comprueba las credenciales en `.env`
  3. Asegúrate de que la base de datos existe: `psql -U postgres -c "\l"`

#### Next.js build falla
- **Solución**:
  1. Verifica que estás usando la versión correcta de Node.js: `node --version`
  2. Limpia la caché: `npm run clean` o elimina la carpeta `.next`
  3. Reinstala dependencias: `rm -rf node_modules && npm install`

### Obtener Ayuda

Si encuentras problemas durante la instalación:

1. Consulta la [documentación oficial](/docs)
2. Revisa los [issues en GitHub](https://github.com/tu-usuario/pos-system/issues)
3. Contacta al equipo de soporte: support@sistema-pos.com

---

Este documento se actualiza regularmente. Última actualización: [Fecha actual]. 