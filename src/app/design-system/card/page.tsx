// app/design-system/card/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/design-system/code-block";

export default function CardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cards</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Ejemplo Básico</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Título de la Card</CardTitle>
            <CardDescription>Descripción de la card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenido principal de la card</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button>Guardar</Button>
          </CardFooter>
        </Card>
        <CodeBlock>
          {`<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
  <CardFooter>
    Footer
  </CardFooter>
</Card>`}
        </CodeBlock>
      </section>
    </div>
  );
}
