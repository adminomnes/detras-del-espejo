import { getNoticias } from "@/lib/supabase-queries/noticias";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

const columns = [
  { key: "titulo", label: "Título" },
  { key: "created_at", label: "Fecha", render: (value: unknown) => value ? formatDate(String(value)) : "-" },
];

export default async function AdminNoticiasPage() {
  const noticias = await getNoticias();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <Link href="/admin/noticias/nuevo" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} /> Nueva Noticia
        </Link>
      </div>

      <AdminTableWrapper
        columns={columns}
        data={noticias as unknown as Record<string, unknown>[]}
        basePath="/admin/noticias"
        tableName="noticias"
      />
    </div>
  );
}
