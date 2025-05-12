import { IronSessionData, getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
// Asegúrate que la ruta a sessionOptions es correcta según tu estructura
import { sessionOptions } from "./lib/auth/auth";

// --- Constantes para Roles y Rutas ---
const ADMIN_ROLE = "ADMIN";
const SELLER_ROLE = "SELLER";

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ["/api/login", "/api/signup", "/"];
// Ruta de inicio de sesión
const LOGIN_PATH = "/";
// Ruta a la que se redirige cuando el acceso es no autorizado o prohibido
const UNAUTHORIZED_PATH = "/unauthorized";
// Dashboards específicos por rol
const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const SELLER_DASHBOARD_PATH = "/seller/sales";
// Ruta genérica de dashboard que redirige al específico
const GENERIC_DASHBOARD_PATH = "/dashboard";

/**
 * Función auxiliar para crear respuestas JSON estandarizadas para errores de API.
 * @param status Código de estado HTTP (e.g., 401, 403).
 * @param code Código de error interno (e.g., "UNAUTHORIZED", "FORBIDDEN").
 * @param message Mensaje descriptivo del error.
 * @returns Objeto NextResponse con el JSON del error.
 */
function createJsonResponse(
  status: number,
  code: string,
  message: string
): NextResponse {
  return new NextResponse(JSON.stringify({ message, code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Middleware de Next.js para gestionar autenticación y autorización basada en roles.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.url; // URL completa para construir redirecciones absolutas
  const isApiRoute = pathname.startsWith("/api/");

  // --- 1. Permitir Rutas Públicas ---
  // Si la ruta está en la lista de públicas, permite el acceso sin verificar sesión.
  if (PUBLIC_PATHS.includes(pathname)) {
    // console.log(`Acceso público permitido a: ${pathname}`); // Log opcional
    return NextResponse.next();
  }

  // --- 2. Obtener la Sesión del Usuario ---
  // Se necesita 'response' aquí para que iron-session pueda potencialmente escribir la cookie.
  const response = NextResponse.next();
  let session: IronSessionData | undefined;
  try {
    session = await getIronSession<IronSessionData>(
      request,
      response,
      sessionOptions
    );
  } catch (error) {
    console.error("Error al obtener la sesión de Iron Session:", error);
    // Si falla la obtención de sesión, trata al usuario como no autenticado.
    if (isApiRoute) {
      return createJsonResponse(
        500,
        "SESSION_ERROR",
        "Error processing session"
      );
    } else {
      // Redirige a login en caso de error de sesión en ruta de página
      return NextResponse.redirect(new URL(LOGIN_PATH, url));
    }
  }

  // --- 3. Verificar Autenticación ---
  // Si no hay sesión, usuario, ID o rol, el usuario no está autenticado.
  if (!session?.user?.id || !session?.user?.role) {
    if (isApiRoute) {
      return createJsonResponse(401, "UNAUTHORIZED", "Authentication required");
    } else {
      // Evita bucles si ya está en /login pero sin sesión válida
      if (pathname !== LOGIN_PATH) {
        return NextResponse.redirect(new URL(LOGIN_PATH, url));
      }
      // Si ya está en /login sin sesión, permite que la página cargue para intentar loguearse
      return response;
    }
  }

  // Extraer rol e ID para facilitar el acceso
  const { role, id: userId } = session.user;

  // --- 4. Redirección desde el Dashboard Genérico ---
  // Si un usuario autenticado va a "/dashboard", redirigirlo a su dashboard específico.
  if (pathname === GENERIC_DASHBOARD_PATH) {
    if (role === ADMIN_ROLE) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, url));
    } else if (role === SELLER_ROLE) {
      return NextResponse.redirect(new URL(SELLER_DASHBOARD_PATH, url));
    } else {
      // Si el rol no es ni ADMIN ni SELLER, pero el usuario está autenticado.
      return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, url));
    }
  }

  // --- 5. Protección de Rutas de Administrador ---
  // Verifica si la ruta actual es una ruta de administrador (página o API).
  const isAdminPath =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin/");
  if (isAdminPath) {
    // Si es ruta de admin, PERO el rol del usuario NO es ADMIN...
    if (role !== ADMIN_ROLE) {
      // Log específico indicando el rol que intentó acceder.
      console.log(
        `Acceso PROHIBIDO a ruta ADMIN (${pathname}). Usuario ${userId} tiene rol ${role}.`
      );
      if (isApiRoute) {
        // Devuelve error 403 para rutas API.
        return createJsonResponse(
          403,
          "FORBIDDEN",
          "Insufficient permissions. Admin role required."
        );
      } else {
        // Redirige a la página de no autorizado para rutas de página.
        return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, url));
      }
    } else {
      // Si es ruta de admin y el rol SÍ es ADMIN, permite el acceso.
      // console.log(`Acceso PERMITIDO a ruta ADMIN (${pathname}) para usuario ${userId}.`); // Log opcional
    }
  }

  // --- 6. Protección de Rutas de Reportes ---
  // Verifica si la ruta actual es una ruta de reportes (página o API).
  const isReportsPath =
    pathname.startsWith("/reports") || pathname.startsWith("/api/reports/");
  if (isReportsPath) {
    // Los reportes solo son accesibles por administradores
    if (role !== ADMIN_ROLE) {
      console.log(
        `Acceso PROHIBIDO a ruta de reportes (${pathname}). Usuario ${userId} tiene rol ${role}.`
      );
      if (isApiRoute) {
        return createJsonResponse(
          403,
          "FORBIDDEN",
          "Insufficient permissions. Admin role required for reports."
        );
      } else {
        // Redirige a la página de no autorizado para rutas de página.
        return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, url));
      }
    } else {
      // Si es administrador, redirigir a la ruta de admin/reports
      if (!pathname.startsWith("/admin")) {
        return NextResponse.redirect(
          new URL(pathname.replace("/reports", "/admin/reports"), url)
        );
      }
    }
  }

  // --- 7. Protección de Rutas de Cajero (Seller) ---
  // Verifica si la ruta actual es una ruta de seller (página o API).
  const isSellerPath =
    pathname.startsWith("/seller") || pathname.startsWith("/api/seller/");
  if (isSellerPath) {
    // Si es ruta de seller, PERO el rol del usuario NO es SELLER...
    if (role !== SELLER_ROLE) {
      // Log específico indicando el rol que intentó acceder.
      console.log(
        `Acceso PROHIBIDO a ruta SELLER (${pathname}). Usuario ${userId} tiene rol ${role}.`
      );
      if (isApiRoute) {
        // Devuelve error 403 para rutas API.
        return createJsonResponse(
          403,
          "FORBIDDEN",
          "Insufficient permissions. Seller role required."
        );
      } else {
        // Redirige a la página de no autorizado para rutas de página.
        return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, url));
      }
    } else {
      // Si es ruta de seller y el rol SÍ es SELLER, permite el acceso.
      // console.log(`Acceso PERMITIDO a ruta SELLER (${pathname}) para usuario ${userId}.`); // Log opcional
    }
  }

  // --- 8. Acceso Permitido ---
  // Si el código llega hasta aquí, significa que el usuario está autenticado
  // y tiene permiso para acceder a la ruta solicitada (o es una ruta no protegida por rol específico).
  // Se devuelve la respuesta original para continuar con la solicitud y mantener la sesión.
  return response;
}

// --- Configuración del Matcher ---
// Define a qué rutas se aplicará este middleware.
// Excluye archivos estáticos, imágenes y el favicon para optimizar.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
