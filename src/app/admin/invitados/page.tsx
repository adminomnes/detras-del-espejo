import { getInvitados } from "@/lib/supabase-queries/invitados";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "biografia", label: "Biografía", render: (value: unknown) => value ? String(value).slice(0, 60) + "..." : "-" },
];

export default async function AdminInvitadosPage() {
  const invitados = await getInvitados();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invitados</h1>
        <Link href="/admin/invitados/nuevo" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} /> Nuevo Invitado
        </Link>
      </div>

      <AdminTableWrapper
        columns={columns}
        data={invitados as unknown as Record<string, unknown>[]}
        basePath="/admin/invitados"
        tableName="invitados"
      />
    </div>
  );
}
