# Módulo de Visualización del Mapa del Cementerio

Este módulo proporciona una interfaz visual interactiva para visualizar y gestionar los bloques y nichos del cementerio.

## Características

### 🏗️ Visualización de Bloques
- **Visualización en cuadrícula**: Muestra todos los bloques del cementerio seleccionado en una cuadrícula visual
- **Buscador de bloques**: Permite buscar bloques por nombre, número o descripción
- **Información detallada**: Tooltip con información completa de cada bloque:
  - Nombre del bloque
  - Número del bloque
  - Dimensiones (filas × columnas)
  - Total de nichos
  - Descripción
  - Estado (Activo/Inactivo)
- **Navegación**: Click en cualquier bloque para ver sus detalles

### 📊 Visualización de Nichos
- **Mapa de nichos**: Visualización en cuadrícula de todos los nichos
- **Estados visuales**: Código de colores para estados:
  - 🟢 Verde: Disponible
  - 🟡 Amarillo: Reservado
  - 🔴 Rojo: Vendido
- **Información de huecos**: Muestra los huecos ocupados en cada nicho
- **Acciones rápidas**: Vender, ver reserva, o ver detalles desde el tooltip

### 📈 Estadísticas en Tiempo Real
- **Para Bloques**:
  - Total de bloques
  - Bloques activos
- **Para Nichos**:
  - Total de nichos
  - Nichos disponibles
  - Nichos reservados
  - Nichos vendidos

## Componentes

### `CemeteryMapVisualization`
Componente principal que integra la visualización de bloques y nichos con pestañas.

**Props**: Ninguna

**Uso**:
```tsx
import { CemeteryMapVisualization } from '@/features/map/presentation/components/cemetery-map.component';

function MapPage() {
  return <CemeteryMapVisualization />;
}
```

### `BlocksMap`
Componente para visualizar bloques del cementerio con funcionalidad de búsqueda.

**Props**:
- `cemetery: CementeryEntity` - Entidad del cementerio seleccionado
- `onStatisticsChange?: (stats) => void` - Callback para actualizar estadísticas

**Características**:
- Buscador integrado
- Tarjetas visuales con código de colores por estado
- Tooltips informativos
- Navegación a detalles del bloque

### `NichesGrid`
Componente para visualizar nichos en formato de cuadrícula.

**Props**:
- `cemetery: CementeryEntity` - Entidad del cementerio seleccionado
- `onStatisticsChange?: (stats) => void` - Callback para actualizar estadísticas

## Estructura de Datos

### BloqueEntity
```typescript
interface BloqueEntity {
  idBloque: string;
  idCementerio: string;
  nombre: string;
  descripcion: string | null;
  numero?: number | null;
  numeroFilas: number;
  numeroColumnas: number;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
}
```

## Hooks Utilizados

### `useCemetery()`
Hook personalizado para gestionar el estado del cementerio seleccionado.

### `useFindBloquesByCementeryQuery(idCementerio)`
Hook de React Query para obtener los bloques de un cementerio específico.

### `useNichesWithHuecos(idCementerio)`
Hook para obtener los nichos con información de huecos.

## Navegación

- **Vista de Bloques**: `/cementerio/{idCementerio}/bloques/{idBloque}`
- **Vista de Nichos**: `/nichos/{idNicho}`

## Estilos y Diseño

El módulo utiliza:
- **Tailwind CSS**: Para estilos utilitarios
- **shadcn/ui**: Componentes de UI (Card, Badge, Tooltip, Tabs, etc.)
- **Lucide Icons**: Iconos vectoriales
- **clsx**: Para manejo condicional de clases CSS

## Ejemplo de Uso Completo

```tsx
// En src/app/(app)/map/page.tsx
"use client";

import MapListView from "@/features/map/presentation/views/map-list.view";

export default function MapPage() {
  return <MapListView />;
}
```

```tsx
// En src/features/map/presentation/views/map-list.view.tsx
import ContainerApp from "@/core/layout/container-app";
import { CemeteryMapVisualization } from "../components/cemetery-map.component";

export default function MapListView() {
  return (
    <ContainerApp title="Cementerios">
      <h2 className="text-2xl font-bold">Cementerios y nichos</h2>
      <CemeteryMapVisualization />
    </ContainerApp>
  );
}
```

## Mejoras Futuras

- [ ] Filtros avanzados para bloques (por estado, capacidad, etc.)
- [ ] Exportación de datos del mapa
- [ ] Vista de plano arquitectónico
- [ ] Modo de impresión optimizado
- [ ] Gestión de bloques directamente desde el mapa
