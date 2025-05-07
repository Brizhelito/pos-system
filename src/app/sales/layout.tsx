import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Ventas",
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
