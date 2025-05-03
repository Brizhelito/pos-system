# Sistema POS

Este es un Sistema de Punto de Venta (POS) desarrollado con [Next.js](https://nextjs.org) utilizando TypeScript y Prisma para la gestión de base de datos.

## Estructura del Proyecto

El proyecto ha sido organizado siguiendo buenas prácticas de desarrollo para facilitar su mantenimiento y escalabilidad:

```
pos-system/
├── prisma/                 # Configuración de base de datos y migraciones
├── public/                 # Archivos estáticos
├── src/
│   ├── app/                # Rutas y páginas de Next.js (App Router)
│   ├── lib/                # Utilidades y lógica compartida
│   │   ├── api/            # Funciones auxiliares para APIs
│   │   ├── auth/           # Lógica de autenticación
│   │   ├── db/             # Configuración y utilidades de base de datos
│   │   └── utils/          # Funciones de utilidad generales
│   ├── components/
│   │   ├── ui/             # Componentes de UI reutilizables
│   │   ├── forms/          # Componentes de formulario
│   │   ├── layout/         # Componentes de diseño (header, footer, etc.)
│   │   └── features/       # Componentes específicos de características
│   ├── types/              # Definiciones de tipos TypeScript
│   └── middleware.ts       # Middleware de Next.js
```

## Cómo Empezar

Primero, instala las dependencias y ejecuta el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
