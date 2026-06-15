"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Music2,
  Mail,
  Phone,
  ExternalLink,
  Save,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { GuestApplication } from "@/lib/supabase-queries/guestApplications";
import { timeAgo } from "@/lib/utils/date";

const statusConfig = {
  pendiente: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", label: "Pendiente" },
  aprobada: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30", label: "Aprobada" },
  rechazada: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", label: "Rechazada" },
  programada: { icon: Calendar, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", label: "Programada" },
};

export function ApplicationDetail({ application }: { application: GuestApplication }) {
  const router = useRouter();
  const supabase = createClient();
  const [notaInterna, setNotaInterna] = useState(application.nota_interna ?? "");
  const [fechaEntrevista, setFechaEntrevista] = useState(application.fecha_entrevista?.slice(0, 16) ?? "");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const status = statusConfig[application.estado];

  const updateStatus = async (estado: GuestApplication["estado"]) => {
    setActionLoading(estado);
    setStatusMsg(null);

    const updates: Record<string, unknown> = {
      estado,
      nota_interna: notaInterna || null,
      updated_at: new Date().toISOString(),
    };
    if (estado === "programada" && fechaEntrevista) {
      updates.fecha_entrevista = new Date(fechaEntrevista).toISOString();
    }

    const { error } = await supabase
      .from("guest_applications")
      .update(updates)
      .eq("id", application.id);

    if (error) {
      setStatusMsg({ type: "error", text: error.message });
    } else {
      setStatusMsg({ type: "success", text: `Solicitud marcada como "${estado}"` });
      router.refresh();
    }
    setActionLoading(null);
  };

  const saveNote = async () => {
    setSaving(true);
    setStatusMsg(null);

    const { error } = await supabase
      .from("guest_applications")
      .update({
        nota_interna: notaInterna || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", application.id);

    if (error) {
      setStatusMsg({ type: "error", text: error.message });
    } else {
      setStatusMsg({ type: "success", text: "Nota guardada" });
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/invitadas"
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{application.nombre}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
                <status.icon size={14} />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Recibida {timeAgo(application.created_at)}</p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className={`flex items-center gap-2 text-sm rounded-xl p-4 mb-6 ${
          statusMsg.type === "success" ? "text-green-400 bg-green-400/5 border border-green-400/20" : "text-red-400 bg-red-400/5 border border-red-400/20"
        }`}>
          {statusMsg.type === "success" ? <CheckCheck size={18} /> : <AlertCircle size={18} />}
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Información Personal">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Nombre" value={application.nombre} />
              <InfoItem label="Email" value={application.email} icon={<Mail size={14} />} />
              <InfoItem label="Teléfono" value={application.telefono ?? "—"} icon={<Phone size={14} />} />
            </div>
          </Section>

          <Section title="Redes Sociales">
            <div className="grid grid-cols-2 gap-4">
              <SocialInfo icon={<InstaIcon />} label="Instagram" value={application.instagram} />
              <SocialInfo icon={<FBIcon />} label="Facebook" value={application.facebook} />
              <SocialInfo icon={<Music2 size={16} />} label="TikTok" value={application.tiktok} />
              <SocialInfo icon={<YTIcon />} label="YouTube" value={application.youtube} />
              <SocialInfo icon={<XIcon1 />} label="X (Twitter)" value={application.twitter} />
            </div>
          </Section>

          <Section title="Sobre la Candidata">
            <TextBlock label="Biografía" value={application.biografia} />
            <TextBlock label="Motivación" value={application.motivacion} />
            <TextBlock label="Temas sugeridos" value={application.temas_sugeridos} />
            <TextBlock label="Experiencia en medios" value={application.experiencia_medios} />
            <TextBlock label="Preguntas previas" value={application.preguntas_previas} />
          </Section>

          <Section title="Fotografías">
            {application.foto_principal && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Foto Principal</p>
                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={application.foto_principal}
                    alt="Foto principal"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {application.fotos_adicionales.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Fotos Adicionales</p>
                <div className="flex flex-wrap gap-3">
                  {application.fotos_adicionales.map((url, i) => (
                    <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                      <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!application.foto_principal && application.fotos_adicionales.length === 0 && (
              <p className="text-gray-500 text-sm">No se subieron fotografías.</p>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Acciones">
            <div className="flex flex-col gap-3">
              {application.estado === "pendiente" && (
                <>
                  <button
                    onClick={() => updateStatus("aprobada")}
                    disabled={actionLoading === "aprobada"}
                    className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 rounded-xl px-5 py-3 font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading === "aprobada" ? "Actualizando..." : <><CheckCircle size={18} /> Aprobar Solicitud</>}
                  </button>
                  <button
                    onClick={() => updateStatus("rechazada")}
                    disabled={actionLoading === "rechazada"}
                    className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl px-5 py-3 font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading === "rechazada" ? "Actualizando..." : <><XCircle size={18} /> Rechazar Solicitud</>}
                  </button>
                </>
              )}
              {application.estado === "aprobada" && (
                <>
                  <div className="flex flex-col gap-2 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Fecha de entrevista</label>
                    <input
                      type="datetime-local"
                      value={fechaEntrevista}
                      onChange={(e) => setFechaEntrevista(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => updateStatus("programada")}
                    disabled={actionLoading === "programada" || !fechaEntrevista}
                    className="flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-xl px-5 py-3 font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading === "programada" ? "Actualizando..." : <><Calendar size={18} /> Programar Entrevista</>}
                  </button>
                </>
              )}
              {(application.estado === "rechazada" || application.estado === "programada") && (
                <button
                  onClick={() => updateStatus("pendiente")}
                  disabled={actionLoading === "pendiente"}
                  className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 rounded-xl px-5 py-3 font-medium transition-all disabled:opacity-50"
                >
                  <Clock size={18} /> Volver a Pendiente
                </button>
              )}
            </div>
          </Section>

          <Section title="Consentimiento de Imagen">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              application.consentimiento_imagen
                ? "bg-green-500/5 border-green-500/20 text-green-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}>
              {application.consentimiento_imagen ? (
                <><CheckCircle size={20} /> <span className="text-sm font-medium">Aceptado</span></>
              ) : (
                <><XCircle size={20} /> <span className="text-sm font-medium">No aceptado</span></>
              )}
            </div>
          </Section>

          <Section title="Nota Interna">
            <textarea
              rows={4}
              value={notaInterna}
              onChange={(e) => setNotaInterna(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent transition-colors resize-none"
              placeholder="Notas privadas del equipo..."
            />
            <button
              onClick={saveNote}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded-xl px-5 py-3 font-medium transition-all mt-3 disabled:opacity-50 text-sm"
            >
              <Save size={16} />
              {saving ? "Guardando..." : "Guardar Nota"}
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5 pb-3 border-b border-white/5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        {value}
      </p>
    </div>
  );
}

function InstaIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
}

function FBIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
}

function YTIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6c-1.7 0-3.1-1.4-3.1-3.1V7.1z" /><path d="m10 15 5-3-5-3v6z" /></svg>;
}

function XIcon1() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" /></svg>;
}

function SocialInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
        {icon} {label}
      </p>
      {value ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          {value} <ExternalLink size={12} />
        </a>
      ) : (
        <p className="text-gray-600 text-sm">—</p>
      )}
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-gray-300 text-sm whitespace-pre-wrap">{value}</p>
    </div>
  );
}
