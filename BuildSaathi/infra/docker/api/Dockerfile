# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first (layer cache optimization)
COPY BuildSaathi.sln ./
COPY src/Domain/BuildSaathi.Domain.csproj src/Domain/
COPY src/Application/BuildSaathi.Application.csproj src/Application/
COPY src/Infrastructure/BuildSaathi.Infrastructure.csproj src/Infrastructure/
COPY src/API/BuildSaathi.API.csproj src/API/

# Restore dependencies (cached if .csproj files unchanged)
RUN dotnet restore

# Copy all source files and build
COPY . .
RUN dotnet build src/API/BuildSaathi.API.csproj -c Release -o /app/build

# Publish
RUN dotnet publish src/API/BuildSaathi.API.csproj -c Release -o /app/publish --no-restore

# ─── Runtime Stage ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

COPY --from=build /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "BuildSaathi.API.dll"]
