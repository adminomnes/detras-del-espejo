export const NAV_LINKS = [
  { name: "Inicio", href: "/" },
  { name: "Episodios", href: "/episodios" },
  { name: "Invitados", href: "/invitados" },
  { name: "Invitadas", href: "/invitadas" },
  { name: "Galería", href: "/galeria" },
  { name: "Noticias", href: "/noticias" },
  { name: "Contacto", href: "/contacto" },
] as const;

export const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { name: "Episodios", href: "/admin/episodios", icon: "Mic" },
  { name: "Invitados", href: "/admin/invitados", icon: "Users" },
  { name: "Galería", href: "/admin/galeria", icon: "ImageIcon" },
  { name: "Noticias", href: "/admin/noticias", icon: "FileText" },
  { name: "Mensajes", href: "/admin/mensajes", icon: "MessageSquare" },
] as const;

export const SITE_NAME = "Detrás del Espejo";
export const SITE_DESCRIPTION = "Historias reales. Verdades sin filtro. Podcast premium enfocado en entrevistas y contenido audiovisual de alta calidad.";
