-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT DEFAULT 'user' CHECK (rol IN ('superadmin', 'admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Invitados
CREATE TABLE public.invitados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE,
    biografia TEXT,
    foto TEXT,
    instagram TEXT,
    facebook TEXT,
    tiktok TEXT,
    youtube TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Episodios
CREATE TABLE public.episodios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE,
    descripcion TEXT,
    meta_descripcion TEXT,
    imagen TEXT,
    invitado_id UUID REFERENCES public.invitados(id) ON DELETE SET NULL,
    spotify_url TEXT,
    youtube_url TEXT,
    fecha DATE,
    destacado BOOLEAN DEFAULT FALSE,
    estado TEXT DEFAULT 'borrador' CHECK (estado IN ('publicado', 'borrador', 'programado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Galeria
CREATE TABLE public.galeria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    imagen TEXT NOT NULL,
    categoria TEXT,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Noticias
CREATE TABLE public.noticias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE,
    contenido TEXT NOT NULL,
    meta_descripcion TEXT,
    imagen TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Contactos
CREATE TABLE public.contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    asunto TEXT,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para datos mostrados en el front-end
CREATE POLICY "Datos de invitados visibles para todos" ON public.invitados FOR SELECT USING (true);
CREATE POLICY "Todos los episodios visibles para usuarios autenticados" ON public.episodios FOR SELECT USING (true);
CREATE POLICY "Galería visible para todos" ON public.galeria FOR SELECT USING (true);
CREATE POLICY "Noticias visibles para todos" ON public.noticias FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de contactos para todos" ON public.contactos FOR INSERT WITH CHECK (true);

-- Políticas de administración (requieren autenticación con rol admin/superadmin)
CREATE POLICY "Solo admins pueden insertar episodios" ON public.episodios FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden actualizar episodios" ON public.episodios FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden eliminar episodios" ON public.episodios FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);

CREATE POLICY "Solo admins pueden insertar invitados" ON public.invitados FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden actualizar invitados" ON public.invitados FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden eliminar invitados" ON public.invitados FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);

CREATE POLICY "Solo admins pueden insertar en galería" ON public.galeria FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden actualizar galería" ON public.galeria FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden eliminar galería" ON public.galeria FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);

CREATE POLICY "Solo admins pueden insertar noticias" ON public.noticias FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden actualizar noticias" ON public.noticias FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden eliminar noticias" ON public.noticias FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);

CREATE POLICY "Solo admins pueden leer contactos" ON public.contactos FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden actualizar contactos" ON public.contactos FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden eliminar contactos" ON public.contactos FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);

-- ============================================================
-- Tabla: guest_applications (solicitudes de aspirantes a invitadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guest_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  foto_principal TEXT,
  fotos_adicionales TEXT[] DEFAULT '{}',
  biografia TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  youtube TEXT,
  twitter TEXT,
  motivacion TEXT,
  temas_sugeridos TEXT,
  experiencia_medios TEXT,
  preguntas_previas TEXT,
  consentimiento_imagen BOOLEAN DEFAULT FALSE,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'programada')),
  nota_interna TEXT,
  fecha_entrevista TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.guest_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción de aplicaciones para todos" ON public.guest_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Solo admins pueden leer aplicaciones" ON public.guest_applications FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden actualizar aplicaciones" ON public.guest_applications FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
CREATE POLICY "Solo admins pueden eliminar aplicaciones" ON public.guest_applications FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.usuarios WHERE rol IN ('admin', 'superadmin'))
);
