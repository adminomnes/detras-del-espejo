import { Sparkles, Camera, Heart, Shield } from "lucide-react";
import { InvitadasForm } from "@/components/invitadas/InvitadasForm";

export default function InvitadasPage() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-6">
          Área de <span className="text-secondary">Invitadas</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          ¿Te gustaría compartir tu historia en Detrás del Espejo? Completa el formulario y
          nuestro equipo evaluará tu participación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <div className="glass p-6 rounded-2xl text-center hover:border-secondary/30 transition-colors border border-transparent">
          <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-secondary" size={28} />
          </div>
          <h3 className="text-white font-bold mb-2">Comparte tu Historia</h3>
          <p className="text-gray-400 text-sm">Tu experiencia puede inspirar a miles de personas que buscan una perspectiva única.</p>
        </div>
        <div className="glass p-6 rounded-2xl text-center hover:border-secondary/30 transition-colors border border-transparent">
          <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="text-secondary" size={28} />
          </div>
          <h3 className="text-white font-bold mb-2">Grabación Profesional</h3>
          <p className="text-gray-400 text-sm">Contamos con un estudio de grabación profesional y un equipo dedicado a crear contenido de alta calidad.</p>
        </div>
        <div className="glass p-6 rounded-2xl text-center hover:border-secondary/30 transition-colors border border-transparent">
          <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-secondary" size={28} />
          </div>
          <h3 className="text-white font-bold mb-2">Sin Filtros</h3>
          <p className="text-gray-400 text-sm">Creemos en conversaciones auténticas donde puedas expresarte libremente y sin guiones.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/5">
          <InvitadasForm />
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-sm">
          <Shield size={16} />
          <span>Tus datos están protegidos y solo serán usados para evaluar tu participación en el podcast.</span>
        </div>
      </div>
    </div>
  );
}
