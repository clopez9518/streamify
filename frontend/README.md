# 🎬 Streaming Platform

Una plataforma de streaming moderna, rápida y dinámica construida con React 19, TypeScript y Vite. Diseñada con una arquitectura modular, que incluye gestión de perfiles de usuario, listas de reproducción ("Mi Lista"), previsualizaciones interactivas de contenido y un panel de administración.

## ✨ Características Principales

- **Gestión de Perfiles de Usuario:** Pantalla de "Quién está viendo", creación de múltiples perfiles y selección de perfil activo persistente.
- **Exploración de Contenido:** Filas de contenido dinámicas con paginación integrada y diseño envolvente.
- **Previsualización Interactiva:** Componente de tarjeta de película (`MovieCard`) que muestra una previsualización detallada al mantener el cursor sobre la tarjeta.
- **Mi Lista:** Funcionalidad para agregar y eliminar películas y series de la lista personal del usuario, con actualizaciones de interfaz reactivas en tiempo real.
- **Panel de Administración:** Sección separada e independiente para gestionar el contenido de la plataforma.
- **Diseño Moderno y Responsivo:** Interfaz gráfica construida con Tailwind CSS v4, animaciones fluidas con Motion, y un sistema de componentes sólido basado en Shadcn UI.
- **Gestión de Estado Robusta:** Utilización de Zustand para el estado global (como la persistencia de perfiles activos) y TanStack React Query para la gestión del estado del servidor, peticiones y caché.

## 🛠️ Tecnologías Utilizadas

- **Core:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Estilos & UI:**
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Shadcn UI](https://ui.shadcn.com/) (Basado en Radix UI)
  - [Motion](https://motion.dev/) (Animaciones fluidas)
  - [Lucide React](https://lucide.dev/) (Iconografía)
- **Gestión de Datos & Estado:**
  - [Zustand](https://zustand-demo.pmnd.rs/) (Estado Global)
  - [TanStack React Query](https://tanstack.com/query/latest) (Data Fetching & Caché)
  - [Axios](https://axios-http.com/) (Cliente HTTP)
- **Formularios & Validaciones:** [React Hook Form](https://react-hook-form.com/)

## 📂 Estructura del Proyecto

El código fuente del proyecto se organiza bajo el directorio `src/` aplicando una arquitectura modular por dominios:

```text
src/
├── admin/            # Panel de Administración (vistas, componentes, hooks)
├── api/              # Configuración base del cliente HTTP (Axios interceptors, etc)
├── assets/           # Recursos estáticos (imágenes, fuentes, iconos)
├── components/       # Componentes UI globales (Shadcn, botones, inputs)
├── hooks/            # Custom hooks globales compartidos
├── interfaces/       # Modelos y tipados genéricos de TypeScript
├── store/            # Stores de Zustand (ej. store de perfiles)
├── routes/           # Configuración general de rutas de la aplicación
└── streaming-app/    # Dominio Principal de la Aplicación de Streaming
    ├── components/   # Componentes específicos (MovieCard, ContentRow, etc)
    ├── hooks/        # Hooks de dominio (useMovies, useAddToMyList, etc)
    ├── pages/        # Vistas de página completa (WhosWatchingPage, Home)
    ├── layouts/      # Plantillas de estructura general
    └── actions/      # Acciones y mutaciones específicas del dominio
```

## 🚀 Requisitos Previos

Para ejecutar este proyecto localmente, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (Versión LTS recomendada, v20 o superior)
- Un gestor de paquetes como `npm`, `yarn` o `pnpm`.

## 📦 Instalación y Ejecución Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/clopez9518/react-frontend-movies.git
   cd streaming-platform
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador y navega a:
   `http://localhost:5173/` (o el puerto que indique Vite en la consola).

## 📜 Scripts Disponibles

En el directorio raíz del proyecto, puedes ejecutar los siguientes comandos:

- `npm run dev`: Ejecuta la aplicación en modo de desarrollo con Hot Module Replacement (HMR).
- `npm run build`: Compila TypeScript y construye la aplicación para producción en el directorio `dist`.
- `npm run lint`: Ejecuta ESLint para analizar el código y encontrar posibles problemas de formato o sintaxis.
- `npm run preview`: Sirve localmente la versión compilada de producción para probarla de manera segura antes del despliegue.
