"use client";

import { DataTable } from "./DataTable";

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface Props {
  columns: Column[];
  data: Record<string, unknown>[];
  basePath: string;
  tableName: string;
}

export function AdminTableWrapper({ columns, data, basePath, tableName }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableName, id }),
      });
      const json = await res.json();

      if (!json.success) {
        alert("Error: " + (json.error || "No se pudo eliminar"));
        return;
      }

      window.location.reload();
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    }
  };

  return <DataTable columns={columns} data={data} basePath={basePath} onDelete={handleDelete} />;
}
