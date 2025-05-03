"use client";

import * as React from "react"; // Import React
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState, // Import SortingState
  getSortedRowModel, // Import getSortedRowModel
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming you have a Shadcn UI table component

import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { ArrowUpDown } from "lucide-react"; // Assuming you have lucide-react installed
// Assuming CodeBlock is a component you have for displaying code
// import { CodeBlock } from "@/components/design-system/code-block";

// Define the Payment type
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Sample data
const data: Payment[] = [
  { id: "1", amount: 100, status: "pending", email: "m@example.com" },
  { id: "2", amount: 200, status: "success", email: "a@example.com" },
  { id: "3", amount: 150, status: "processing", email: "b@example.com" },
  { id: "4", amount: 50, status: "failed", email: "c@example.com" },
  { id: "5", amount: 250, status: "success", email: "d@example.com" },
];

// Define the columns with sorting enabled for 'amount'
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
      const variantMap: Record<
        Payment["status"],
        "success" | "warning" | "info" | "destructive"
      > = {
        pending: "warning",
        processing: "info",
        success: "success",
        failed: "destructive",
      };
      return <Badge variant={variantMap[status]}>{status.toString()}</Badge>;
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
      const amount = parseFloat((row.getValue("amount") as number).toString()); // Ensure value is string before parsing
      return <div className="font-medium">${amount.toFixed(2)}</div>; // Format to 2 decimal places
    },
  },
];

// Hypothetical DataTable component implementation with sorting
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // State to manage sorting
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Add sorting state and model
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Your DataTablePage component
export default function DataTablePage() {
  return (
    <div className="space-y-6 p-4">
      {" "}
      {/* Added padding */}
      <h1 className="text-3xl font-bold">Tabla de Datos Avanzada</h1>
      <section className="space-y-4">
        {/* Use the DataTable component */}
        <DataTable columns={columns} data={data} />

        {/* CodeBlock component (assuming it exists) */}
        {/* <CodeBlock>
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
        </CodeBlock> */}
      </section>
    </div>
  );
}
