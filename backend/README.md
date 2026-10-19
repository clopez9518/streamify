# 🎬 Streamify - Backend API (.NET 10)

API RESTful para la plataforma de streaming Streamify, construida con Clean Architecture y .NET 10.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Características Implementadas](#características-implementadas)
- [Endpoints](#endpoints)

## Descripción

Backend completo para la plataforma de streaming Streamify con sistema de perfiles de usuario, gestión de listas personales ("Mi Lista"), autenticación JWT con refresh tokens en cookies HttpOnly, integración con TMDb API y panel de administración.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Runtime | .NET 10 |
| Framework | ASP.NET Core |
| Base de datos | PostgreSQL 16+ |
| ORM | Entity Framework Core 10 |
| Validación | FluentValidation |
| Mapeo | AutoMapper |
| Autenticación | JWT + Refresh Tokens (HttpOnly Cookie) |
| Testing | xUnit + Moq (100% pasando) |

## Arquitectura

```
backend/
├── Backend-Movies/          # Capa Presentation (Controllers, Filters, Endpoints)
├── Movies.Application/      # Capa Application (Casos de uso, DTOs, Mappers)
├── Movies.Infrastructure/   # Capa Infrastructure (EF Core, Repositorios, TMDb Client)
├── Movies.Domain/           # Capa Domain (Entidades, Enums, Interfaces)
└── Backend-Movies.Test/     # Capa Testing (Pruebas unitarias)
```

**Patrón de Arquitectura:** Clean Architecture con separación de responsabilidades y DI desacoplada.

## Instalación y Ejecución

### Requisitos

- .NET 10 SDK
- PostgreSQL 16 o superior

### Pasos

1. **Clonar el repositorio monorepo**
   ```bash
   git clone https://github.com/<tu-usuario>/streamify.git
   cd streamify/backend
   ```

2. **Configurar archivo de configuración**

   Copia la plantilla [`Backend-Movies/appsettings.Example.json`](file:///c:/workspace/.NET/streamify/backend/Backend-Movies/appsettings.Example.json) a `Backend-Movies/appsettings.Development.json`:
   ```bash
   cp Backend-Movies/appsettings.Example.json Backend-Movies/appsettings.Development.json
   ```

   Estructura de configuración:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=moviesdb;Username=postgres;Password=tu_password"
     },
     "Jwt": {
       "Key": "tu_clave_secreta_jwt_de_al_menos_32_caracteres_de_longitud",
       "Issuer": "Movies.Api",
       "Audience": "Movies.Api",
       "RefreshTokenDays": 7
     },
     "TMDb": {
       "ApiKey": "tu_api_key_de_tmdb",
       "BaseUrl": "https://api.themoviedb.org/3/"
     },
     "CorsSettings": {
       "FrontendUrl": "http://localhost:5173"
     }
   }
   ```

3. **Restaurar dependencias**
   ```bash
   dotnet restore
   ```

4. **Ejecutar migraciones**
   ```bash
   dotnet ef database update --project Movies.Infrastructure
   ```

5. **Ejecutar la aplicación**
   ```bash
   dotnet run --project Backend-Movies
   ```

## Características Implementadas

### Autenticación y Autorización
- Registro e inicio de sesión
- JWT Access Tokens (60 min) + Refresh Tokens (7 días)
- Sistema de roles (user/admin)
- Renovación automática de tokens

### Gestión de Perfiles
- Múltiples perfiles por usuario (máx. 5)
- Perfiles con modo infantil (Kids)
- Listas personales de películas

### Catálogo de Películas
- Listado paginado con ordenamiento
- Filtrado por género
- Películas trending
- Película destacada (Hero) con algoritmo de scoring
- Películas similares
- Integración con TMDb API

### Panel de Administración
- CRUD completo de películas
- Gestión de géneros
- Suspensión de usuarios

### Validación
- DTOs validados con FluentValidation
- Middleware centralizado de excepciones

## Endpoints

### Autenticación
| Método | Ruta | Descripción |
|-------|-----|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| POST | `/api/auth/refresh` | Renovar tokens |
| POST | `/api/auth/logout` | Cerrar sesión |
| POST | `/api/auth/select-profile` | Seleccionar perfil activo |

### Películas
| Método | Ruta | Descripción |
|-------|-----|-------------|
| GET | `/api/movies` | Listar películas (paginación) |
| GET | `/api/movies/{id}` | Detalle de película |
| GET | `/api/movies/genre/{genreId}` | Por género |
| GET | `/api/movies/trending` | Tendencias |
| GET | `/api/movies/similar/{id}` | Similares |
| GET | `/api/movies/hero` | Película destacada |

### Perfiles
| Método | Ruta | Descripción |
|-------|-----|-------------|
| GET | `/api/profiles` | Perfiles del usuario |
| POST | `/api/profiles` | Crear perfil |
| GET | `/api/profiles/{id}` | Detalle de perfil |
| DELETE | `/api/profiles/{id}` | Eliminar perfil |
| GET | `/api/profiles/{id}/mylist` | Mi lista |
| POST | `/api/profiles/{id}/mylist` | Agregar a mi lista |
| DELETE | `/api/profiles/{id}/mylist/{movieId}` | Quitar de mi lista |

### Géneros
| Método | Ruta | Descripción |
|-------|-----|-------------|
| GET | `/api/genres` | Listar géneros |
| GET | `/api/genres/{id}` | Detalle de género |

### Administración
| Método | Ruta | Descripción |
|-------|-----|-------------|
| GET | `/api/admin/movies` | Listar películas |
| POST | `/api/admin/movies` | Crear película |
| PUT | `/api/admin/movies/{id}` | Actualizar película |
| PUT | `/api/admin/movies/{id}/genres` | Actualizar géneros |
| GET | `/api/admin/users` | Listar usuarios |
| PUT | `/api/admin/users/{id}/status` | Cambiar estado |
| POST | `/api/admin/genres` | Crear género |
| PUT | `/api/admin/genres/{id}` | Actualizar género |
| GET | `/api/admin/tmdb/search` | Buscar en TMDb |
| GET | `/api/admin/tmdb/{id}` | Detalle desde TMDb |