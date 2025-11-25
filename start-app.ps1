# Script de PowerShell para ejecutar la aplicación Cementerio Pillaro - Frontend
# Optimizado para Windows 10 con 4GB de RAM
# Requiere: Node.js 20.14.0, Yarn

param(
    [string]$Port = "3001",
    [string]$BackendUrl = "http://localhost:3000/",
    [string]$Mode = "dev"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cementerio Pillaro - Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

Write-Host "[1/5] Verificando requisitos previos..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js no está instalado." -ForegroundColor Red
    Write-Host "Por favor instala Node.js 20.14.0 desde: https://nodejs.org/" -ForegroundColor Red
    Write-Host "O usa nvm-windows: https://github.com/coreybutler/nvm-windows" -ForegroundColor Red
    exit 1
}

$nodeVersion = node --version
Write-Host "  ✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green

if (-not (Test-Command "yarn")) {
    Write-Host "  ⚠ Yarn no encontrado. Instalando yarn globalmente..." -ForegroundColor Yellow
    npm install -g yarn
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo instalar yarn." -ForegroundColor Red
        exit 1
    }
}

Write-Host "  ✓ Yarn encontrado" -ForegroundColor Green
Write-Host ""

Write-Host "[2/5] Configurando variables de entorno..." -ForegroundColor Yellow

$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "  ⚠ Archivo .env no encontrado. Creándolo desde env.example..." -ForegroundColor Yellow
    
    if (Test-Path "env.example") {
        Copy-Item "env.example" $envFile
        Write-Host "  ✓ Archivo .env creado desde env.example" -ForegroundColor Green
        
        (Get-Content $envFile) | ForEach-Object {
            $_ -replace 'NEXT_PUBLIC_BACKEND_API_URL=.*', "NEXT_PUBLIC_BACKEND_API_URL=$BackendUrl" `
               -replace 'NEXTAUTH_URL=.*', "NEXTAUTH_URL=http://localhost:$Port"
        } | Set-Content $envFile
        
        Write-Host "  ✓ Configuración actualizada con valores proporcionados" -ForegroundColor Green
    } else {
        $authSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        $envContent = @"
NEXT_PUBLIC_BACKEND_API_URL=$BackendUrl

AUTH_SECRET="$authSecret"
NEXTAUTH_URL="http://localhost:$Port"
"@
        $envContent | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "  ✓ Archivo .env creado con valores por defecto" -ForegroundColor Green
    }
    Write-Host "  ⚠ IMPORTANTE: Revisa y actualiza el archivo .env con tus valores de producción" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Archivo .env encontrado" -ForegroundColor Green
}
Write-Host ""

Write-Host "[3/5] Instalando dependencias..." -ForegroundColor Yellow
yarn install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la instalación de dependencias." -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

if ($Mode -eq "prod") {
    Write-Host "[4/5] Compilando aplicación..." -ForegroundColor Yellow
    yarn run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Falló la compilación." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Aplicación compilada exitosamente" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[5/5] Iniciando aplicación en modo producción..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Frontend iniciado - Modo Producción" -ForegroundColor Green
    Write-Host "  URL: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Presiona Ctrl+C para detener la aplicación" -ForegroundColor Yellow
    Write-Host ""
    
    $env:PORT = $Port
    yarn run start
} else {
    Write-Host "[4/5] Omitiendo compilación en modo desarrollo..." -ForegroundColor Yellow
    Write-Host "  ✓ Listo para desarrollo" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[5/5] Iniciando aplicación en modo desarrollo..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Frontend iniciado - Modo Desarrollo" -ForegroundColor Green
    Write-Host "  URL: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host "  Hot Reload: Activado" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Presiona Ctrl+C para detener la aplicación" -ForegroundColor Yellow
    Write-Host ""
    
    $env:PORT = $Port
    yarn run dev
}

