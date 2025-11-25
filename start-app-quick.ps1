# Script rápido para ejecutar la aplicación frontend (asume que todo está configurado)
# Usa este script después de haber ejecutado start-app.ps1 por primera vez

param(
    [string]$Mode = "dev"
)

$ErrorActionPreference = "Stop"

Write-Host "Iniciando aplicación frontend..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host "ERROR: Archivo .env no encontrado." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\start-app.ps1" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: Dependencias no instaladas." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\start-app.ps1" -ForegroundColor Yellow
    exit 1
}

if ($Mode -eq "prod") {
    if (-not (Test-Path ".next")) {
        Write-Host "Compilando aplicación..." -ForegroundColor Yellow
        yarn run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Falló la compilación." -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "Iniciando servidor en modo producción..." -ForegroundColor Green
    yarn run start
} else {
    Write-Host "Iniciando servidor en modo desarrollo..." -ForegroundColor Green
    yarn run dev
}

