import { getGuestApplication } from "@/lib/supabase-queries/guestApplications";
import { notFound } from "next/navigation";
import { ApplicationDetail } from "./ApplicationDetail";

export const dynamic = "force-dynamic";

export default async function AdminInvitadaDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const application = await getGuestApplication(id);

  if (!application) notFound();

  return <ApplicationDetail application={application} />;
}
