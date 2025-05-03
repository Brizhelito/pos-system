// app/design-system/layout.tsx
import { Sidebar } from "@/components/design-system/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8 overflow-auto">
        {children}
        <Toaster />
      </main>
      <Sidebar />
    </div>
  );
}
