// app/design-system/data-table/page.tsx
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CodeBlock } from "@/components/design-system/code-block";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const data: Payment[] = [
  { id: "1", amount: 100, status: "pending", email: "m@example.com" },
  { id: "2", amount: 200, status: "success", email: "a@example.com" },
];

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment["status"];
      const variantMap: Record<Payment["status"], string> = {
        pending: "warning",
        processing: "info",
        success: "success",
        failed: "destructive",
      };
      return (
        <Badge
          variant={
            variantMap[status] as "success" | "warning" | "info" | "destructive"
          }
        >
          {status.toString()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Monto
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="font-medium">${amount}</div>;
    },
  },
];

export default function DataTablePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tabla de Datos Avanzada</h1>

      <section className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          // Implement pagination logic here if needed
          // searchKey="email" // Removed as it is not a valid property
          // initialSort={{ id: "amount", desc: true }} // Removed as it is not a valid property
        />

        <CodeBlock>
          {`// Definición de columnas
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.getValue('status')}>
        {row.getValue('status')}
      </Badge>
    )
  }
]`}
        </CodeBlock>
      </section>
    </div>
  );
}
