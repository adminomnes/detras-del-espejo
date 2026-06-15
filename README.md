# Detrás del Espejo 🪞

Podcast premium de entrevistas donde las invitadas comparten historias reales, verdades sin filtro y conversaciones auténticas. Este proyecto incluye el sitio web público, panel de administración y juegos interactivos para transmisiones en vivo.

## Stack

- **Framework:** Next.js 16
- **UI:** Tailwind CSS v4 + Framer Motion + GSAP
- **3D:** React Three Fiber / Drei
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Íconos:** Lucide React
- **Estado:** Zustand

## Requisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com) (gratuita)

## Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/detras-del-espejo.git
   cd detras-del-espejo
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo `.env.local` basado en `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Completa las variables de Supabase en `.env.local` (consola de Supabase → Settings → API).

5. Ejecuta `database.sql` en tu proyecto de Supabase (SQL Editor) para crear las tablas.

6. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

7. Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando           | Descripción                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desarrollo             |
| `npm run build`   | Build de producción                |
| `npm run start`   | Iniciar servidor de producción     |
| `npm run lint`    | Ejecutar ESLint                    |

## Estructura

```
src/
├── app/                  # App Router (páginas y API routes)
│   ├── (public)/         # Rutas públicas del sitio
│   └── admin/            # Panel de administración
├── components/           # Componentes React
│   ├── admin/            # Componentes del panel admin
│   ├── games/            # Juegos interactivos
│   ├── home/             # Componentes de la página principal
│   └── layout/           # Navbar, Footer, Sidebar
├── lib/                  # Utilidades y configuración
│   ├── supabase/         # Clientes de Supabase
│   └── utils/            # Helpers y constantes
├── data/                 # Datos estáticos (juegos)
├── store/                # Estados globales (Zustand)
└── types/                # Tipos TypeScript
```

## Licencia

Todos los derechos reservados.
