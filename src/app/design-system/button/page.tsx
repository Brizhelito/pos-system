// app/design-system/button/page.tsx
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/design-system/code-block'

export default function ButtonPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Botones</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Variantes</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <CodeBlock>
          {`<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tamaños</h2>
        <div className="flex items-center gap-4">
          <Button size="sm">Pequeño</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Grande</Button>
        </div>
        <CodeBlock>
          {`<Button size="sm">Pequeño</Button>
<Button size="default">Default</Button>
<Button size="lg">Grande</Button>`}
        </CodeBlock>
      </section>
    </div>
  )
}