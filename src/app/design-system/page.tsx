// app/design-system/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/design-system/code-block";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

export default function DesignSystemIntro() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">Design System</h1>
          <Badge variant="outline" className="text-sm">
            v1.0.0
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema de componentes modular y accesible para construir aplicaciones
          web modernas. Construido con Next.js, TypeScript y Tailwind CSS.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="#getting-started">Comenzar</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/documentacion">Documentación</Link>
          </Button>
          <ThemeToggle />
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">🚀 Productivo</h3>
          <p className="text-sm text-muted-foreground">
            Componentes listos para producción con documentación clara y
            ejemplos interactivos
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">🎨 Personalizable</h3>
          <p className="text-sm text-muted-foreground">
            Estilizado con Tailwind CSS y variables CSS para modificación en
            tiempo real
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">♿ Accesible</h3>
          <p className="text-sm text-muted-foreground">
            Componentes ARIA-compliant con navegación por teclado y screen
            readers
          </p>
        </Card>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="space-y-4">
        <h2 className="text-2xl font-bold">Primeros Pasos</h2>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Instalación</h3>
            <CodeBlock>npm install @/components</CodeBlock>

            <h3 className="font-semibold">Configuración Base</h3>
            <CodeBlock>
              {`import { ThemeProvider } from '@/components/theme-provider'
              
export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {/* Tu aplicación */}
    </ThemeProvider>
  )
}`}
            </CodeBlock>
          </div>
        </Card>
      </section>

      {/* Componentes Principales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Componentes Destacados</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" asChild>
            <Link href="/design-system/button">Botones</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/design-system/form">Formularios</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/design-system/card">Cards</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/design-system/table">Tablas</Link>
          </Button>
        </div>
      </section>

      {/* Principios de Diseño */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Principios de Diseño</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Consistencia</h3>
            <p className="text-sm text-muted-foreground">
              Mismos patrones de diseño en toda la aplicación para mejor
              experiencia de usuario
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Composición</h3>
            <p className="text-sm text-muted-foreground">
              Componentes modulares que se combinan para crear interfaces
              complejas
            </p>
          </Card>
        </div>
      </section>

      <Toaster position="bottom-right" />
    </div>
  );
}
