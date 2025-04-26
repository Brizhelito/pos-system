// components/design-system/code-block.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function CodeBlock({ children }: { children: string }) {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        <TabsTrigger value="code">Código</TabsTrigger>
      </TabsList>

      <TabsContent value="preview"></TabsContent>

      <TabsContent value="code">
        <pre className="bg-muted p-4 rounded-md overflow-auto">
          <code className="text-sm">{children}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
