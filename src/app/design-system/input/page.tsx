// app/design-system/input/page.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock } from "@/components/design-system/code-block";

export default function InputPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inputs</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tipos Básicos</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Texto</Label>
            <Input placeholder="Ingrese su nombre" />
          </div>
          <div className="space-y-2">
            <Label>Contraseña</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>Búsqueda</Label>
            <Input type="search" placeholder="Buscar..." />
          </div>
        </div>
        <CodeBlock>
          {`<Input placeholder="Texto normal" />
<Input type="password" placeholder="Contraseña" />
<Input type="search" placeholder="Buscar..." />`}
        </CodeBlock>
      </section>
    </div>
  );
}
