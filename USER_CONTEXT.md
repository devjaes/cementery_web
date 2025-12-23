# Contexto de Usuario - Documentación

## Descripción

Esta documentación explica cómo se implementó el contexto de usuario logeado en la aplicación y cómo utilizarlo.

## Cambios Realizados

### Backend

1. **JWT Strategy** (`Backend_Cementerio_Pillaro/src/auth/jwt.strategy.ts`)
   - Actualizado para devolver correctamente los datos del payload JWT
   - Incluye: `id_user`, `cedula`, `nombre`, `apellido`, `rol`

2. **Auth Controller** (`Backend_Cementerio_Pillaro/src/auth/auth.controller.ts`)
   - Activado el guard en el endpoint `/auth/profile`
   - Agregado nuevo endpoint `/auth/me` para obtener información completa del usuario

### Frontend

1. **Dependencias**
   - Instalado `jwt-decode` para decodificar tokens JWT en el cliente

2. **Auth Store** (`cementary-app/src/features/auth/presentation/context/auth.store.ts`)
   - Ya contenía la estructura necesaria para guardar el usuario
   - Incluye métodos: `login`, `logout`, `setUser`, `setToken`

3. **Hook de Login** (`cementary-app/src/features/auth/hooks/use-login.ts`)
   - Modificado para decodificar el JWT al hacer login
   - Extrae la información del usuario del token
   - Guarda el usuario en el store automáticamente

4. **Nuevo Hook: useCurrentUser** (`cementary-app/src/features/auth/hooks/use-current-user.ts`)
   - Hook principal para acceder al usuario logeado
   - Exporta tres funciones útiles:
     - `useCurrentUser()`: Retorna usuario y estado de autenticación
     - `useUser()`: Retorna solo el objeto de usuario
     - `useAuth()`: Retorna todo el contexto de autenticación

5. **App Sidebar** (`cementary-app/src/core/layout/app-sidebar.tsx`)
   - Actualizado para usar el usuario real del store
   - Elimina el usuario hardcodeado
   - Muestra nombre completo y email/cédula del usuario logeado

6. **Nav User** (`cementary-app/src/core/layout/nav-user.tsx`)
   - Actualizado el logout para usar el store en lugar de NextAuth
   - Cambiado el texto a español ("Cerrar sesión")

## Uso

### Obtener el usuario actual

```typescript
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

function MiComponente() {
  const { user, isAuthenticated } = useCurrentUser();

  if (!isAuthenticated) {
    return <div>No hay sesión activa</div>;
  }

  return (
    <div>
      <h1>Hola {user?.nombre} {user?.apellido}</h1>
      <p>Cédula: {user?.cedula}</p>
      <p>Rol: {user?.rol}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### Usar solo el objeto de usuario

```typescript
import { useUser } from "@/features/auth/hooks/use-current-user";

function MiComponente() {
  const user = useUser();

  return <div>{user?.nombre}</div>;
}
```

### Acceder al contexto completo de autenticación

```typescript
import { useAuth } from "@/features/auth/hooks/use-current-user";

function MiComponente() {
  const { user, token, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <>
          <p>Usuario: {user?.nombre}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}
    </div>
  );
}
```

> **Nota:** La función `logout()` del hook `useAuth()` automáticamente:
> - Limpia la sesión del usuario (token y datos)
> - Limpia el cementerio seleccionado
> - Redirige a la página de login (`/sign-in`)

## Estructura del Usuario

```typescript
interface User {
  id_user: string;
  cedula: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole; // 'administrator' | 'user'
  fecha_creacion: string;
  fecha_modificacion: string | null;
  estado: UserStatus;
}
```

## Flujo de Autenticación

### Login
1. El usuario ingresa sus credenciales en el formulario de login
2. El backend valida las credenciales y genera un JWT
3. El frontend decodifica el JWT usando `jwt-decode`
4. Se extrae la información del usuario del token
5. Se guarda el token y el usuario en el store (persiste en localStorage)
6. El usuario está disponible en toda la aplicación a través de los hooks
7. El usuario debe seleccionar un cementerio para trabajar

### Logout
1. El usuario hace clic en "Cerrar sesión"
2. Se ejecuta la función `logout()` que:
   - Limpia el usuario y token del store
   - Limpia el cementerio seleccionado
   - Redirige a `/sign-in`
3. Al hacer login nuevamente, debe seleccionar un cementerio

## Persistencia

El estado de autenticación se persiste automáticamente en `localStorage` gracias a Zustand:

### Auth Store
- **Clave:** `auth-store`
- **Contenido:** `{ user, token, isAuthenticated }`
- Se restaura automáticamente al recargar la página

### Cemetery Store
- **Clave:** `cemetery-context`
- **Contenido:** `{ activeCemetery }`
- Se limpia automáticamente al hacer logout
- Se restaura automáticamente al recargar la página (si existe)

## Seguridad

- El JWT tiene un tiempo de expiración configurado en el backend
- El token se envía en cada petición mediante interceptores HTTP
- El logout limpia completamente el estado del store
- Las rutas protegidas deben verificar `isAuthenticated`

## Endpoints del Backend

### POST /auth/login
Inicia sesión y retorna un JWT

**Request:**
```json
{
  "cedula": "1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/me
Obtiene la información completa del usuario actual (requiere autenticación)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id_user": "uuid",
  "cedula": "1234567890",
  "email": "usuario@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "user"
}
```

## Troubleshooting

### El usuario no se muestra en el sidebar
- Verificar que el usuario haya iniciado sesión correctamente
- Revisar que el token esté guardado en localStorage
- Verificar la consola del navegador por errores

### El logout no funciona
- Usar la función `logout()` del hook `useAuth()` que maneja todo automáticamente
- Esta función limpia tanto el usuario como el cementerio seleccionado
- Redirige automáticamente a `/sign-in`

### El token expira
- El backend maneja la expiración del token
- Implementar un interceptor para refrescar el token o redirigir al login

