"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  basePath: string;
  onDelete?: (id: string) => void;
}

export function DataTable({ columns, data, basePath, onDelete }: DataTableProps) {
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">
                  {col.label}
                </th>
              ))}
              <th className="text-right px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, i) => (
              <tr key={String(row.id ?? i)} className="hover:bg-white/5 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`${basePath}/${row.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(String(row.id))}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">No hay datos disponibles.</div>
      )}
    </div>
  );
}
