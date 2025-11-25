# Guía de Instalación y Ejecución - Windows 10 (Frontend)

Esta guía te ayudará a configurar y ejecutar la aplicación **Frontend** de Cementerio Pillaro en una máquina Windows 10 con 4GB de RAM, **sin usar Docker**.

## Requisitos Previos

### 1. Node.js 20.14.0

**Opción A: Instalación directa**
- Descarga desde: https://nodejs.org/
- Instala la versión LTS (20.x)

**Opción B: Usando nvm-windows (recomendado)**
```powershell
# Instala nvm-windows desde: https://github.com/coreybutler/nvm-windows/releases
# Luego ejecuta:
nvm install 20.14.0
nvm use 20.14.0
```

### 2. Yarn (se instalará automáticamente si no está)

El script verificará e instalará yarn automáticamente si no está presente.

### 3. Backend API (Requerido)

Este es el frontend de la aplicación. Necesitas tener el backend corriendo en `http://localhost:3000` o configurar la URL del backend en el archivo `.env`.

## Ejecución de la Aplicación

### Primera vez (Setup completo)

**Modo Desarrollo (recomendado para desarrollo):**
```powershell
.\start-app.ps1
```

**Modo Producción:**
```powershell
.\start-app.ps1 -Mode prod
```

Este script:
- Verifica todos los requisitos (Node.js, Yarn)
- Crea el archivo `.env` desde `env.example` con valores por defecto
- Instala dependencias de Node.js
- Inicia el servidor en modo desarrollo o producción

**Parámetros opcionales:**
```powershell
# Modo desarrollo con puerto personalizado
.\start-app.ps1 -Port 3001 -BackendUrl "http://localhost:3000/"

# Modo producción con configuración personalizada
.\start-app.ps1 -Mode prod -Port 3001 -BackendUrl "http://api.ejemplo.com/"
```

### Ejecuciones posteriores (Rápido)

**Modo Desarrollo:**
```powershell
.\start-app-quick.ps1
```

**Modo Producción:**
```powershell
.\start-app-quick.ps1 -Mode prod
```

Este script asume que todo está configurado (dependencias instaladas) y solo inicia la aplicación.

## Configuración Manual del Archivo .env

Si prefieres configurar manualmente, crea un archivo `.env` en la raíz del proyecto:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3000/

AUTH_SECRET="tu-clave-secreta-generada-aleatoriamente"
NEXTAUTH_URL="http://localhost:3001"
```

**Notas importantes:**
- `NEXT_PUBLIC_BACKEND_API_URL`: URL del backend API (debe terminar con `/`)
- `AUTH_SECRET`: Clave secreta para NextAuth.js (genera una aleatoria segura)
- `NEXTAUTH_URL`: URL completa donde corre el frontend

## Verificación

Una vez iniciada la aplicación:

- **Frontend**: http://localhost:3001
- **Backend API** (debe estar corriendo): http://localhost:3000

## Solución de Problemas

### Error: "Node.js no está instalado"
- Instala Node.js 20.14.0 desde https://nodejs.org/
- Verifica con: `node --version`

### Error: "Yarn no encontrado"
- El script intentará instalar Yarn automáticamente
- Si falla, instala manualmente: `npm install -g yarn`
- Verifica con: `yarn --version`

### Error: "Backend API no responde"
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Verifica la URL en el archivo `.env` (`NEXT_PUBLIC_BACKEND_API_URL`)
- Revisa la conexión de red y firewall

### Error: "Puerto ya en uso"
- Cambia el puerto al iniciar: `.\start-app.ps1 -Port 3002`
- O detén el proceso que está usando el puerto:
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Error: "Module not found" o errores de compilación
- Elimina `node_modules` y reinstala:
```powershell
Remove-Item -Recurse -Force node_modules
yarn install
```
- Limpia el caché de Next.js:
```powershell
Remove-Item -Recurse -Force .next
yarn run build
```

### Optimización de Memoria

Si experimentas problemas de memoria con 4GB de RAM:

1. **Cierra otras aplicaciones** que consuman mucha RAM
2. **Usa modo producción** para menor consumo de memoria:
```powershell
.\start-app.ps1 -Mode prod
```
3. **Modo desarrollo** consume más RAM debido a hot reload y turbopack
4. **Considera aumentar memoria virtual** (swap) de Windows

## Comandos Útiles

```powershell
# Verificar versión de Node
node --version

# Verificar versión de Yarn
yarn --version

# Instalar dependencias manualmente
yarn install

# Compilar aplicación manualmente
yarn run build

# Iniciar en modo desarrollo
yarn run dev

# Iniciar en modo producción
yarn run start

# Limpiar caché y rebuild
Remove-Item -Recurse -Force .next
yarn run build

# Verificar puertos en uso
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Ver procesos de Node.js corriendo
Get-Process | Where-Object {$_.ProcessName -eq "node"}
```

## Modos de Ejecución

### Modo Desarrollo (`yarn run dev`)
- **Hot Reload**: Los cambios se reflejan automáticamente
- **Mayor consumo de memoria**: Usa Turbopack para compilación rápida
- **Mejor experiencia de desarrollo**: Errores detallados en pantalla
- **Puerto por defecto**: 3001

### Modo Producción (`yarn run start`)
- **Optimizado**: Código minificado y optimizado
- **Menor consumo de memoria**: Sin hot reload
- **Requiere compilación previa**: `yarn run build`
- **Mejor rendimiento**: Para pruebas de producción

## Notas Importantes

- Este es el **frontend** de la aplicación (Next.js 15.3.1)
- Requiere que el **backend** esté corriendo en `http://localhost:3000`
- El script configura automáticamente el archivo `.env` desde `env.example`
- **NO** uses Docker - este setup es para ejecución nativa en Windows
- El **modo desarrollo** es recomendado para desarrollo activo
- El **modo producción** es recomendado para pruebas de rendimiento

