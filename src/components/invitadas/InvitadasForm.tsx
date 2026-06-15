"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, CheckCircle, Music2, AlertCircle } from "lucide-react";
import { TurnstileWidget } from "@/components/invitadas/TurnstileWidget";
import Image from "next/image";

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  foto_principal: string;
  fotos_adicionales: string[];
  biografia: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  motivacion: string;
  temas_sugeridos: string;
  experiencia_medios: string;
  preguntas_previas: string;
  consentimiento_imagen: boolean;
};

const initialForm: FormData = {
  nombre: "",
  email: "",
  telefono: "",
  foto_principal: "",
  fotos_adicionales: [],
  biografia: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  twitter: "",
  motivacion: "",
  temas_sugeridos: "",
  experiencia_medios: "",
  preguntas_previas: "",
  consentimiento_imagen: false,
};

export function InvitadasForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mainPhotoRef = useRef<HTMLInputElement>(null);
  const extraPhotosRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      return data.url || null;
    } catch {
      return null;
    }
  };

  const handleMainPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadPhoto(file);
    if (url) updateField("foto_principal", url);
    setUploading(false);
  };

  const handleExtraPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadPhoto(file);
      if (url) urls.push(url);
    }
    updateField("fotos_adicionales", [...form.fotos_adicionales, ...urls]);
    setUploading(false);
  };

  const removeExtraPhoto = (index: number) => {
    updateField(
      "fotos_adicionales",
      form.fotos_adicionales.filter((_, i) => i !== index)
    );
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) errs.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email inválido";
    if (!form.consentimiento_imagen) errs.consentimiento_imagen = "Debes aceptar el consentimiento de imagen";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/send-guest-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm(initialForm);
        setTurnstileToken(null);
      } else {
        setErrors({ _form: data.error || "Error al enviar la solicitud" });
        setStatus("error");
      }
    } catch {
      setErrors({ _form: "Error de conexión. Intenta de nuevo." });
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-secondary" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">¡Solicitud Enviada!</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Gracias por tu interés en participar en Detrás del Espejo. Hemos recibido tu
          solicitud y nuestro equipo la evaluará. Te contactaremos pronto.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-accent hover:text-white transition-colors text-sm underline underline-offset-4"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>

      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-secondary rounded-full" />
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Nombre completo" error={errors.nombre}>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => updateField("nombre", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-secondary transition-all w-full"
              placeholder="Tu nombre"
            />
          </Field>
          <Field label="Correo electrónico" error={errors.email}>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-secondary transition-all w-full"
              placeholder="tu@email.com"
            />
          </Field>
          <Field label="Teléfono (opcional)">
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => updateField("telefono", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-secondary transition-all w-full"
              placeholder="+34 600 123 456"
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-accent rounded-full" />
          Redes Sociales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SocialField icon={<InstagramIcon />} label="Instagram" value={form.instagram} onChange={(v) => updateField("instagram", v)} placeholder="@usuario" />
          <SocialField icon={<FacebookIcon />} label="Facebook" value={form.facebook} onChange={(v) => updateField("facebook", v)} placeholder="facebook.com/usuario" />
          <SocialField icon={<Music2 size={18} />} label="TikTok" value={form.tiktok} onChange={(v) => updateField("tiktok", v)} placeholder="@usuario" />
          <SocialField icon={<YoutubeIcon />} label="YouTube" value={form.youtube} onChange={(v) => updateField("youtube", v)} placeholder="youtube.com/@usuario" />
          <SocialField icon={<XIcon />} label="X (Twitter)" value={form.twitter} onChange={(v) => updateField("twitter", v)} placeholder="@usuario" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full" />
          Sobre Ti
        </h3>
        <div className="flex flex-col gap-5">
          <Field label="Biografía / ¿Quién eres?">
            <textarea
              rows={4}
              value={form.biografia}
              onChange={(e) => updateField("biografia", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all w-full resize-none"
              placeholder="Cuéntanos sobre ti, tu trayectoria, experiencia y lo que te hace única..."
            />
          </Field>
          <Field label="¿Por qué te gustaría participar?">
            <textarea
              rows={3}
              value={form.motivacion}
              onChange={(e) => updateField("motivacion", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all w-full resize-none"
              placeholder="¿Qué te motiva a compartir tu historia en Detrás del Espejo?"
            />
          </Field>
          <Field label="Temas que te gustaría abordar">
            <textarea
              rows={3}
              value={form.temas_sugeridos}
              onChange={(e) => updateField("temas_sugeridos", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all w-full resize-none"
              placeholder="¿De qué temas te gustaría hablar? ¿Hay algún tema en particular que quieras compartir?"
            />
          </Field>
          <Field label="Experiencia con medios / entrevistas previas (opcional)">
            <textarea
              rows={3}
              value={form.experiencia_medios}
              onChange={(e) => updateField("experiencia_medios", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all w-full resize-none"
              placeholder="¿Has participado en otros podcasts, programas de radio, televisión o eventos?"
            />
          </Field>
          <Field label="Preguntas que te gustaría que te hicieran (opcional)">
            <textarea
              rows={3}
              value={form.preguntas_previas}
              onChange={(e) => updateField("preguntas_previas", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all w-full resize-none"
              placeholder="Si hay preguntas específicas que te gustaría que abordemos durante la entrevista, compártelas aquí."
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-secondary rounded-full" />
          Fotografías
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-sm text-gray-400 uppercase tracking-widest">Foto principal</label>
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-gray-900 group">
              {form.foto_principal ? (
                <>
                  <Image src={form.foto_principal} alt="Foto principal" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => updateField("foto_principal", "")}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => mainPhotoRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-secondary/50 transition-all border-2 border-dashed border-white/10 rounded-xl"
                >
                  {uploading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm">Subir foto</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <input ref={mainPhotoRef} type="file" accept="image/*" onChange={handleMainPhoto} className="hidden" />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm text-gray-400 uppercase tracking-widest">Fotos adicionales</label>
            <div className="flex flex-wrap gap-2">
              {form.fotos_adicionales.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                  <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExtraPhoto(i)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => extraPhotosRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary/50 transition-all"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              </button>
            </div>
            <input ref={extraPhotosRef} type="file" accept="image/*" multiple onChange={handleExtraPhotos} className="hidden" />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <input
          type="checkbox"
          id="consentimiento"
          checked={form.consentimiento_imagen}
          onChange={(e) => updateField("consentimiento_imagen", e.target.checked)}
          className="mt-1 w-4 h-4 accent-secondary flex-shrink-0"
        />
        <label htmlFor="consentimiento" className="text-sm text-gray-300 cursor-pointer">
          Acepto el <span className="text-secondary">consentimiento de imagen</span> y autorizo el uso de
          mi nombre, imagen y voz para la grabación, producción y difusión del podcast Detrás del Espejo
          en cualquier medio o plataforma.
          {errors.consentimiento_imagen && (
            <span className="block text-red-400 text-xs mt-1">{errors.consentimiento_imagen}</span>
          )}
        </label>
      </div>

      <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />

      {errors._form && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-xl p-4">
          <AlertCircle size={18} className="flex-shrink-0" />
          {errors._form}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity mt-4 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Enviando solicitud...
          </>
        ) : (
          "Enviar Solicitud"
        )}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400 uppercase tracking-widest">{label}</label>
      {children}
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}

function InstagramIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
}

function FacebookIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
}

function YoutubeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6c-1.7 0-3.1-1.4-3.1-3.1V7.1z" /><path d="m10 15 5-3-5-3v6z" /></svg>;
}

function XIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" /></svg>;
}

function SocialField({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-all w-full"
        placeholder={placeholder}
      />
    </div>
  );
}
