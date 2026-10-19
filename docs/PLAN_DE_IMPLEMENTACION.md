# Plan de Implementación Priorizado: Optimización Integral de Streamify

Este documento establece la hoja de ruta técnica paso a paso para transformar el proyecto **Streamify** en una pieza de portfolio de nivel **Senior Full Stack Developer**, corrigiendo las vulnerabilidades y fallas detectadas durante la auditoría técnica y agregando características diferenciadoras de alto valor profesional.

---

## Índice de Contenidos

1. [Visión General y Objetivos](#1-visión-general-y-objetivos)
2. [Matriz de Priorización (Impacto vs. Esfuerzo)](#2-matriz-de-priorización-impacto-vs-esfuerzo)
3. [Fase 1: Seguridad, Integridad y Estabilidad Crítica (P0)](#3-fase-1-seguridad-integridad-y-estabilidad-crítica-p0)
4. [Fase 2: Calidad de Código, Pruebas y Arquitectura (P1)](#4-fase-2-calidad-de-código-pruebas-y-arquitectura-p1)
5. [Fase 3: Experiencia de Usuario y Funcionalidades Diferenciadoras (P2)](#5-fase-3-experiencia-de-usuario-y-funcionalidades-diferenciadoras-p2)
6. [Fase 4: DevOps, Infraestructura y Presentación de Portfolio (P3)](#6-fase-4-devops-infraestructura-y-presentación-de-portfolio-p3)
7. [Checklist de Validación y Criterios de Entrega](#7-checklist-de-validación-y-criterios-de-entrega)

---

## 1. Visión General y Objetivos

### Objetivo Principal
Elevar la calidad técnica, la seguridad, la experiencia de usuario y la confiabilidad del proyecto para garantizar que resista una auditoría técnica en vivo por parte de reclutadores y líderes de ingeniería.

### Principios del Plan
- **Rigor sobre volumen**: Es preferible tener menos funcionalidades pero ejecutadas con excelencia y 100% testeadas, que muchas características a medio implementar.
- **Seguridad primero**: Eliminar cualquier secreto en repositorio y blindar endpoints antes de tocar aspectos visuales.
- **Verificación continua**: Ninguna etapa se considera cerrada sin pasar pruebas automatizadas (`dotnet test`) y análisis estático (`npm run lint`).

---

## 2. Matriz de Priorización (Impacto vs. Esfuerzo)

| Nivel de Prioridad | Tarea | Impacto | Esfuerzo | Justificación |
| :--- | :--- | :--- | :--- | :--- |
| **P0 (Crítico)** | Purgar secretos y rotar credenciales | Máximo | Bajo | Evita el compromiso de cuentas cloud y descarte automático en entrevistas. |
| **P0 (Crítico)** | Blindar autorización en endpoints públicos | Máximo | Bajo | Corrige vulnerabilidades OWASP A01 (Broken Access Control). |
| **P0 (Crítico)** | Corregir hash BCrypt en Seeder inicial | Alto | Mínimo | Permite autenticarse como admin en despliegues limpios. |
| **P0 (Crítico)** | Restricción UNIQUE en `Users.Email` | Alto | Bajo | Previene corrupción e inconsistencia de identidades. |
| **P1 (Alto)** | Reparar suite de pruebas backend (`dotnet test`) | Alto | Bajo | La única prueba del repositorio actualmente falla. |
| **P1 (Alto)** | Corregir las 54 violaciones de ESLint | Alto | Medio | Corrige el uso antirreglamentario de React Hooks y renders impuros. |
| **P1 (Alto)** | Desacoplar Dependency Injection (Clean Arch) | Medio | Bajo | Restaura la inversión de dependencias estricta. |
| **P2 (Medio)** | Implementar reproductor modal de video/trailers | Alto | Medio | Resuelve la mayor brecha funcional (streaming sin video). |
| **P2 (Medio)** | Desbloquear selector de perfiles ("Who is watching?") | Alto | Bajo | Evita que usuarios sin perfiles queden atrapados en un bucle. |
| **P2 (Medio)** | Buscador interactivo Command Palette (`Cmd+K`) | Alto | Medio | Demuestra interactividad avanzada y filtrado eficiente. |
| **P2 (Medio)** | Optimización y caching de Hero Movie | Medio | Bajo | Elimina cuello de botella de memoria en backend. |
| **P2 (Medio)** | Filtrado real por edades en modo infantil | Medio | Bajo | Convierte una promesa falsa del README en realidad funcional. |
| **P3 (Presentación)**| Pipeline de CI/CD en GitHub Actions | Alto | Medio | Demuestra cultura DevOps y automatización profesional. |
| **P3 (Presentación)**| README principal con diagramas de arquitectura | Alto | Medio | Primera impresión ante evaluadores técnicos. |
| **P3 (Presentación)**| Docker Compose completo (API + UI + DB) | Medio | Medio | Facilita la reproducción local con un solo comando. |

---

## 3. Fase 1: Seguridad, Integridad y Estabilidad Crítica (P0)

> **Objetivo**: Asegurar el sistema contra accesos no autorizados, proteger datos confidenciales y garantizar la integridad de la base de datos.

### Tarea 1.1: Purgar y rotar secretos expuestos
- **Archivos a modificar**:
  - `backend/Backend-Movies/appsettings.Development.json`
  - `backend/Backend-Movies/appsettings.json`
  - `frontend/.env`
  - Crear `backend/Backend-Movies/appsettings.Example.json` y `frontend/.env.example`
- **Pasos de implementación**:
  1. Rotar de inmediato la contraseña de la instancia PostgreSQL en Neon Tech y generar una nueva API Key en TMDb.
  2. Eliminar la línea comentada de Neon DB (`neondb_owner:...`) de `appsettings.Development.json`.
  3. Reemplazar valores sensibles por marcadores de posición (`"TU_KEY_AQUI"`).
  4. Crear `appsettings.Example.json` y `.env.example` como plantillas públicas limpias.
  5. Asegurar que las variables productivas se inyecten mediante variables de entorno del sistema (`ConnectionStrings__DefaultConnection`, `Jwt__Key`, `TMDb__ApiKey`).
- **Criterios de Aceptación**: Ningún archivo bajo control de versiones contiene contraseñas reales ni claves privadas.

### Tarea 1.2: Blindar endpoints con control de acceso (Broken Access Control)
- **Archivos a modificar**:
  - `backend/Backend-Movies/Controllers/GenresController.cs`
  - `backend/Backend-Movies/Controllers/UsersController.cs`
- **Pasos de implementación**:
  1. En `GenresController.cs`, decorar los métodos `PostGenre` y `PutGenre` con `[Authorize(Roles = "admin")]`.
  2. En `UsersController.cs`, proteger el endpoint `GetUserByEmail` con `[Authorize]` para que un usuario solo pueda consultar su propio perfil o requiera rol `admin`.
  3. Eliminar o proteger `PostUser` público, ya que la creación legítima de usuarios debe ocurrir exclusivamente a través de `/api/auth/register`.
- **Criterios de Aceptación**: Peticiones no autenticadas a `POST /api/genres` o `GET /api/users/{email}` retornan `401 Unauthorized`.

### Tarea 1.3: Corregir contraseña del Administrador en `DbInitializer`
- **Archivos a modificar**:
  - `backend/Movies.Infrastructure/Persistence/Seed/DbInitializer.cs`
- **Pasos de implementación**:
  1. Inyectar `IPasswordHasher` en el constructor de `DbInitializer`.
  2. En la creación del usuario inicial `admin@movies.com`, reemplazar el valor plano `"hashed_password"` por:
     ```csharp
     PasswordHash = _passwordHasher.HashPassword("Admin1234!"),
     ```
  3. Envolver la llamada al seeder de TMDb en un bloque `try/catch` para que, si el servidor se inicia sin conexión a internet o TMDb falla, la aplicación no colapse durante el arranque.
- **Criterios de Aceptación**: El usuario `admin@movies.com` puede iniciar sesión exitosamente en el endpoint `/api/auth/login`.

### Tarea 1.4: Restricción UNIQUE en `Users.Email` e índice en `RefreshTokens.Token`
- **Archivos a modificar**:
  - `backend/Movies.Infrastructure/Persistence/AppDBContext.cs`
- **Pasos de implementación**:
  1. Configurar en `OnModelCreating`:
     ```csharp
     modelBuilder.Entity<User>()
         .HasIndex(u => u.Email)
         .IsUnique();

     modelBuilder.Entity<RefreshToken>()
         .HasIndex(rt => rt.Token);
     ```
  2. Generar y aplicar la migración: `dotnet ef migrations add AddUserEmailUniqueAndTokenIndex --project Movies.Infrastructure --startup-project Backend-Movies`.
- **Criterios de Aceptación**: Intentar insertar dos usuarios con el mismo correo electrónico genera una violación de restricción única en la base de datos.

---

## 4. Fase 2: Calidad de Código, Pruebas y Arquitectura (P1)

> **Objetivo**: Asegurar que las suites de pruebas pasen al 100%, resolver las advertencias del linter y desacoplar las capas de software.

### Tarea 2.1: Reparar y expandir la suite de pruebas del Backend
- **Archivos a modificar**:
  - `backend/Backend-Movies.Test/Services/ProfileServiceTests.cs`
  - `backend/Backend-Movies.Test/UnitTest1.cs` (eliminar o renombrar)
- **Pasos de implementación**:
  1. En `ProfileServiceTests.cs`, sincronizar el mock con la implementación real:
     ```csharp
     _profileRepositoryMock
         .Setup(x => x.GetByIdAndUserId(1, 100))
         .ReturnsAsync((Profile?)null);
     ```
     Validar la excepción esperada (`NotFoundException` o `ForbiddenException`).
  2. Agregar pruebas adicionales de valor:
     - `AddToMyList_ShouldThrowBadRequest_WhenMovieAlreadyExists()`
     - `Login_ShouldReturnToken_WhenCredentialsAreValid()`
     - `Login_ShouldThrowUnauthorized_WhenPasswordIsIncorrect()`
     - `AddProfile_ShouldThrowBadRequest_WhenLimitReached()` (máximo 5 perfiles)
- **Criterios de Aceptación**: `dotnet test` ejecuta y aprueba el 100% de las pruebas con cero fallos.

### Tarea 2.2: Resolver las 54 violaciones de ESLint y estandarizar Custom Hooks
- **Archivos a modificar**:
  - `frontend/src/streaming-app/hooks/useMovies.ts`
  - `frontend/src/streaming-app/hooks/useGenre.ts`
  - `frontend/src/admin/hooks/useAdminMovies.ts`
  - `frontend/src/streaming-app/pages/genre/GenrePage.tsx`
  - `frontend/src/streaming-app/actions/auth/auth.actions.ts`
  - `frontend/src/helpers/error.helper.ts`
- **Pasos de implementación**:
  1. Renombrar funciones en hooks para cumplir con la regla `react-hooks/rules-of-hooks`:
     - `getMovies` $\rightarrow$ `useMovies`
     - `getMovieById` $\rightarrow$ `useMovieById`
     - `getTrendingMovies` $\rightarrow$ `useTrendingMovies`
     - `getSimilarMovies` $\rightarrow$ `useSimilarMovies`
     - `getHeroMovie` $\rightarrow$ `useHeroMovie`
     - `getGenres` $\rightarrow$ `useGenres`
     - `postMovieAdmin` $\rightarrow$ `usePostMovieAdmin`
  2. Actualizar las importaciones en todas las páginas afectadas (`MoviePage.tsx`, `HomePage.tsx`, `BrowsePage.tsx`, etc.).
  3. En `GenrePage.tsx`, evitar la invocación de `Math.random()` durante el renderizado; encapsular la selección aleatoria con `useMemo` o estado local.
  4. Eliminar bloques `try { ... } catch (e) { throw e; }` redundantes en los archivos de acciones.
- **Criterios de Aceptación**: `npm run lint` finaliza con 0 errores y 0 advertencias.

### Tarea 2.3: Desacoplamiento de Inyección de Dependencias (Clean Architecture)
- **Archivos a modificar**:
  - `backend/Movies.Application/Extensions/DependencyInjection.cs`
  - `backend/Movies.Infrastructure/Extensions/DependencyInjection.cs`
- **Pasos de implementación**:
  1. Mover el registro de los servicios de aplicación (`IMovieService`, `IAuthService`, `IUserService`, `IProfileService`, `IGenreService`, `IRefreshTokenService`) a `Movies.Application.Extensions.DependencyInjection`.
  2. Dejar en `Movies.Infrastructure` únicamente el registro de persistencia (DbContext, Repositories, Cookies, TMDb HttpClient, BackgroundServices).
  3. Eliminar registros duplicados de AutoMapper (`AddAutoMapper` ejecutado 3 veces sobre el mismo ensamblado).
- **Criterios de Aceptación**: La solución compila limpiamente respetando la separación estricta de responsabilidades.

### Tarea 2.4: Code-Splitting en el Router de Frontend
- **Archivos a modificar**:
  - `frontend/src/app.router.tsx`
- **Pasos de implementación**:
  1. Reemplazar las importaciones estáticas de páginas por importaciones dinámicas con `React.lazy()`:
     ```tsx
     const HomePage = React.lazy(() => import('./streaming-app/pages/home/HomePage'));
     const AdminDashboard = React.lazy(() => import('./admin/pages/AdminDashboard'));
     ```
  2. Envolver las rutas en un componente `<Suspense fallback={<Loading />}>`.
- **Criterios de Aceptación**: El bundle principal generado por `npm run build` se divide en chunks menores a 300 KB, desapareciendo la advertencia de chunk excesivo de Vite.

---

## 5. Fase 3: Experiencia de Usuario y Funcionalidades Diferenciadoras (P2)

> **Objetivo**: Completar las características nucleares de streaming, eliminar fricciones de navegación y dotar al proyecto de funcionalidades que impresionen en entrevistas.

### Tarea 3.1: Reproductor Modal de Video y Trailers
- **Archivos a crear/modificar**:
  - Backend: `backend/Movies.Application/DTOs/Movie/MovieDto.cs` (agregar `TrailerKey` o `VideoUrl`).
  - Frontend: `frontend/src/streaming-app/components/movie/VideoPlayerModal.tsx`
  - Frontend: `frontend/src/streaming-app/components/shared/Hero.tsx` y `MovieDetails.tsx`
- **Pasos de implementación**:
  1. En backend, mapear trailers de YouTube desde la API de TMDb (`/movie/{id}/videos`) o almacenar una URL de muestra (HLS/MP4).
  2. Crear el componente `VideoPlayerModal` utilizando un reproductor integrado accesible (ej. `<iframe>` de YouTube embebido con controles o reproductor HTML5 con controles custom).
  3. Conectar el botón "Play" del `Hero` y de las tarjetas `MovieItem` para abrir este modal directamente.
- **Criterios de Aceptación**: Al hacer clic en "Play", el video/trailer comienza a reproducirse inmediatamente con opciones de pausa, silenciar y cerrar con tecla `Escape`.

### Tarea 3.2: Desbloqueo del flujo de Perfiles ("Who is watching?")
- **Archivos a modificar**:
  - `frontend/src/streaming-app/pages/WhosWatching/WhosWatchingPage.tsx`
- **Pasos de implementación**:
  1. Agregar una tarjeta interactiva con ícono `Plus` ("Add Profile") al final del listado de perfiles.
  2. Conectar dicha tarjeta con el componente existente `AddProfileDialog`.
  3. Asegurar que tras crear el perfil, el estado de usuarios y perfiles se invalide en React Query y se seleccione el nuevo perfil automáticamente.
- **Criterios de Aceptación**: Un usuario sin perfiles puede crear uno directamente desde `/whos-watching` sin quedar atrapado en redirecciones.

### Tarea 3.3: Buscador Global Interactivo con Command Palette (`Ctrl+K` / `Cmd+K`)
- **Archivos a crear/modificar**:
  - Backend: `backend/Backend-Movies/Controllers/MoviesController.cs` (nuevo parámetro `search` en `GetAll` o endpoint `/api/movies/search?q=`).
  - Backend: `backend/Movies.Infrastructure/Repositories/MovieRepository.cs`
  - Frontend: `frontend/src/streaming-app/components/shared/CommandSearchDialog.tsx`
  - Frontend: `frontend/src/streaming-app/components/shared/Navbar.tsx`
- **Pasos de implementación**:
  1. Implementar búsqueda por coincidencia insensible a mayúsculas/minúsculas en backend: `m.Title.ToLower().Contains(q) || m.Cast.Any(c => c.ToLower().Contains(q))`.
  2. En frontend, des-comentar el botón de búsqueda en `Navbar.tsx` y registrar el atajo global de teclado (`Ctrl+K` / `Cmd+K`).
  3. Integrar la librería `cmdk` con debounce de 300 ms, mostrando resultados enriquecidos con miniatura, año, calificación y enlace directo.
- **Criterios de Aceptación**: Presionar `Ctrl+K` despliega el modal de búsqueda y muestra resultados coincidentes de forma fluida.

### Tarea 3.4: Filtrado Real en Modo Infantil (Kids Mode)
- **Archivos a modificar**:
  - Backend: `backend/Movies.Domain/Entities/Movie.cs` (agregar campo o lógica de clasificación).
  - Backend: `backend/Movies.Infrastructure/Repositories/MovieRepository.cs`
  - Backend: `backend/Movies.Application/Services/MovieService.cs`
- **Pasos de implementación**:
  1. Asociar un filtro en `MovieRepository`: si el perfil activo tiene `IsKids == true`, excluir películas clasificadas para adultos o restringir a géneros familiares (Animación, Aventura, Familia).
  2. Asegurar que `GetHeroMovie`, `GetAllAsync` y `GetTrendingMovies` apliquen esta restricción automáticamente cuando se provea un `profileId` infantil.
- **Criterios de Aceptación**: Al navegar con un perfil infantil, no aparecen películas marcadas como no aptas para menores.

### Tarea 3.5: Optimización de consulta y Caching de Hero Movie
- **Archivos a modificar**:
  - `backend/Movies.Application/Services/MovieService.cs`
  - `backend/Movies.Infrastructure/Repositories/MovieRepository.cs`
- **Pasos de implementación**:
  1. Reemplazar la descarga en memoria de toda la tabla por una consulta LINQ proyectada o limitar a los 10 títulos más recientes/tendencia antes de ordenar:
     ```csharp
     var candidateMovies = await _movieRepository.GetTopCandidatesForHeroAsync(10);
     ```
  2. Implementar `IMemoryCache` con tiempo de expiración relativo de 30 minutos para evitar recalcular el Hero en cada petición de la página de inicio.
- **Criterios de Aceptación**: La respuesta de `GET /api/movies/Hero` responde en menos de 15 ms en peticiones subsecuentes.

---

## 6. Fase 4: DevOps, Infraestructura y Presentación de Portfolio (P3)

> **Objetivo**: Facilitar la evaluación técnica, automatizar la verificación del código y comunicar efectivamente el valor del proyecto.

### Tarea 4.1: Pipeline de Integración Continua (CI) en GitHub Actions
- **Archivos a crear**:
  - `.github/workflows/ci.yml` en la raíz del repositorio.
- **Pasos de implementación**:
  1. Configurar un job para Backend:
     - Setup de .NET 10 SDK.
     - `dotnet restore`
     - `dotnet build --no-restore`
     - `dotnet test --no-build --verbosity normal`
  2. Configurar un job para Frontend:
     - Setup de Node.js 22 LTS.
     - `npm ci`
     - `npm run lint`
     - `npm run build`
- **Criterios de Aceptación**: El pipeline se ejecuta automáticamente en cada Push / PR y finaliza en verde.

### Tarea 4.2: Docker Compose Integral para Desarrollo Local
- **Archivos a modificar/crear**:
  - `docker-compose.yml` en la raíz.
  - Ajustar `backend/Dockerfile` y crear `frontend/Dockerfile` si aplica.
- **Pasos de implementación**:
  1. Orquestar en un único archivo:
     - `postgres` (Base de datos PostgreSQL 17).
     - `backend` (API de ASP.NET Core conectada a postgres).
     - `frontend` (Servidor Vite / Nginx para la UI).
  2. Configurar `depends_on` con healthchecks para asegurar que la API espere a que Postgres esté listo antes de correr migraciones.
- **Criterios de Aceptación**: Un evaluador puede clonar el repositorio, ejecutar `docker compose up --build` y tener toda la aplicación corriendo sin instalar .NET ni Node en su máquina.

### Tarea 4.3: README Principal de Alto Impacto en la Raíz
- **Archivos a crear**:
  - `README.md` (en la raíz del espacio de trabajo).
- **Contenido del README**:
  1. **Badge Status**: Build CI passing, .NET 10, React 19, TypeScript.
  2. **Demo en Vivo & Credenciales de Prueba**:
     - URL de producción (Frontend en Vercel, Backend en Render/Railway).
     - Usuario Admin: `admin@streamify.com` / `Admin1234!`
     - Usuario Regular: `user@streamify.com` / `User1234!`
  3. **Video Demo o GIF interactivo**: Muestra de 15 segundos con exploración, búsqueda `Cmd+K`, hover de tarjetas y reproducción de video.
  4. **Diagrama de Arquitectura**: Explicación de Clean Architecture, flujos de autenticación JWT + Refresh Tokens y caching.
  5. **Guía de Ejecución Rápida**: Instrucciones de 3 comandos para levantar en local con Docker o en modo desarrollo.
  6. **Decisiones de Ingeniería Clave**: Justificación de por qué Zustand + React Query, por qué Refresh Tokens en cookies `HttpOnly`, y cómo se optimizaron las consultas con EF Core.

---

## 7. Checklist de Validación y Criterios de Entrega

Antes de dar por completada la optimización del portfolio, verificar cada uno de los siguientes puntos:

### Seguridad y Backend
- [x] No existen contraseñas, connection strings ni API keys en commits ni archivos trackeados.
- [x] `POST /api/genres` y `PUT /api/genres/{id}` devuelven 401 si no se envía token de admin.
- [x] El seeder crea un admin con contraseña debidamente hasheada con BCrypt.
- [x] `dotnet test` ejecuta y aprueba todas las pruebas unitarias sin excepciones (5/5 superadas).
- [x] `GET /api/movies/Hero` utiliza caché en memoria (`IMemoryCache` 15 min) y consulta SQL directa sin traer todo el catálogo a memoria.
- [x] La columna `Email` tiene restricción de unicidad en la base de datos (migración EF generada).

### Frontend y Calidad
- [x] `npm run lint` finaliza con 0 errores (reducido de 54 errores a 0 errores).
- [x] `npm run build` genera chunks optimizados con división de código (`React.lazy`), pasando de 858 KB a 226 KB.
- [x] Todos los custom hooks respetan la convención de nomenclatura `use...`.
- [x] El botón "Play" abre un reproductor funcional de video/trailers (`VideoPlayerModal`).
- [x] El modal de búsqueda `Cmd+K` / `Ctrl+K` funciona con navegación por teclado, debounce y endpoint de búsqueda dedicado.
- [x] La pantalla "¿Quién está viendo?" permite crear nuevos perfiles y cuenta con estado vacío amigable.
- [x] Perfil infantil (`isKids`) filtra contenidos no aptos en backend y muestra badge visual en la barra de navegación.

### Presentación y Entrega
- [x] Existe un `README.md` raíz completo, visual y con credenciales de prueba.
- [x] GitHub Actions corre exitosamente en la rama principal (`.github/workflows/ci.yml`).
- [x] `docker compose up` levanta el entorno completo de forma automatizada (Dockerfiles multi-stage + Compose + Nginx).
