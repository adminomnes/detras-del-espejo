import { getContactos } from "@/lib/supabase-queries/contactos";
import { formatDate, timeAgo } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminMensajesPage() {
  const mensajes = await getContactos();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mensajes Recibidos</h1>

      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {mensajes.map((msg) => (
            <div key={msg.id} className="px-6 py-5 flex items-start gap-4 hover:bg-white/5 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${msg.leido ? "bg-gray-800 text-gray-500" : "bg-primary/20 text-primary"}`}>
                {msg.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{msg.nombre}</h4>
                    {!msg.leido && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0 ml-2 text-right">
                    <div>{formatDate(msg.created_at)}</div>
                    <div>{timeAgo(msg.created_at)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 font-medium">{msg.asunto}</p>
                <p className="text-sm text-gray-400 mt-1">{msg.mensaje}</p>
                <p className="text-xs text-gray-500 mt-2">{msg.email}</p>
              </div>
            </div>
          ))}

          {mensajes.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No hay mensajes recibidos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
