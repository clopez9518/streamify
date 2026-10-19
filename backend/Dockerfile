# Multi-stage build for .NET 10 Web API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files for layer caching
COPY Movies.Domain/Movies.Domain.csproj Movies.Domain/
COPY Movies.Application/Movies.Application.csproj Movies.Application/
COPY Movies.Infrastructure/Movies.Infrastructure.csproj Movies.Infrastructure/
COPY Backend-Movies/Movies.Api.csproj Backend-Movies/

RUN dotnet restore Backend-Movies/Movies.Api.csproj

# Copy source code
COPY Movies.Domain/ Movies.Domain/
COPY Movies.Application/ Movies.Application/
COPY Movies.Infrastructure/ Movies.Infrastructure/
COPY Backend-Movies/ Backend-Movies/

WORKDIR /src/Backend-Movies
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Movies.Api.dll"]