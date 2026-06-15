import { getGuestApplications } from "@/lib/supabase-queries/guestApplications";
import { InvitadasAdminList } from "./InvitadasAdminList";

export const dynamic = "force-dynamic";

export default async function AdminInvitadasPage() {
  const applications = await getGuestApplications();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Solicitudes de Invitadas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona las solicitudes de personas que quieren participar en el podcast.
        </p>
      </div>
      <InvitadasAdminList applications={applications} />
    </div>
  );
}
