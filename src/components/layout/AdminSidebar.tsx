"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Mic, Users, ImageIcon, FileText, MessageSquare, LogOut, UserPlus, Calendar, Library, Gamepad2,
} from "lucide-react";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Episodios", href: "/admin/episodios", icon: Mic },
  { name: "Invitados", href: "/admin/invitados", icon: Users },
  { name: "Invitadas", href: "/admin/invitadas", icon: UserPlus },
  { name: "Juegos", href: "/admin/invitadas/juegos", icon: Gamepad2 },
  { name: "Calendario", href: "/admin/calendario", icon: Calendar },
  { name: "Biblioteca", href: "/admin/biblioteca", icon: Library },
  { name: "Galería", href: "/admin/galeria", icon: ImageIcon },
  { name: "Noticias", href: "/admin/noticias", icon: FileText },
  { name: "Mensajes", href: "/admin/mensajes", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-[#050508] border-r border-white/5 flex flex-col flex-shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link href="/admin">
          <span className="font-outfit text-xl font-light tracking-widest uppercase">
            Admin <span className="text-accent font-semibold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Panel</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-transparent text-primary shadow-[inset_3px_0_0_rgba(179,0,255,0.6)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} /> <span className="text-sm font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 text-sm"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
