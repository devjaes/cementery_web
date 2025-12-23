# Módulo de Visualización del Mapa del Cementerio

Este módulo proporciona una interfaz visual interactiva para visualizar y gestionar los bloques y nichos del cementerio de forma jerárquica.

## Características

### 🏗️ Visualización Jerárquica: Bloques → Nichos
- **Vista de bloques**: Muestra todos los bloques del cementerio seleccionado en una cuadrícula visual
- **Navegación por bloques**: Click en cualquier bloque para ver sus nichos específicos
- **Buscador de bloques**: Permite buscar bloques por nombre, número o descripción
-- **Asociación automática**: Los nichos se agrupan automáticamente en bloques según su bloque (relación `idBloque`)

### 📊 Información Detallada de Bloques
Cada tarjeta de bloque muestra:
- Nombre del bloque
- Número del bloque (si está disponible)
- Dimensiones (filas × columnas)
- Total de nichos del bloque
- Estado (Activo/Inactivo)
- Estadísticas de nichos:
  - Disponibles
  - Reservados
  - Vendidos

### 🗺️ Visualización de Nichos por Bloque
Al seleccionar un bloque, se muestra:
- **Mapa de nichos**: Visualización en cuadrícula de todos los nichos del bloque
- **Estados visuales**: Código de colores para estados:
  - 🟢 Verde: Disponible
  - 🟡 Amarillo: Reservado
  - 🔴 Rojo: Vendido
- **Información de huecos**: Muestra los huecos ocupados en cada nicho
- **Acciones rápidas**: Vender, ver reserva, o ver detalles desde el tooltip
- **Botón de retorno**: Volver a la vista de bloques fácilmente

### 📈 Estadísticas en Tiempo Real
- **Total de bloques** en el cementerio
- **Total de nichos** (suma de todos los bloques)
- **Nichos disponibles**
- **Nichos reservados**
- **Nichos vendidos**

## Componentes

### `CemeteryMapVisualization`
Componente principal que integra la visualización jerárquica del cementerio.

**Props**: Ninguna

**Uso**:
```tsx
import { CemeteryMapVisualization } from '@/features/map/presentation/components/cemetery-map.component';

function MapPage() {
  return <CemeteryMapVisualization />;
}
```

### `BlocksWithNichesMap`
Componente que maneja la vista de bloques y la transición a nichos específicos del bloque.

**Props**:
- `cemetery: CementeryEntity` - Entidad del cementerio seleccionado
- `onStatisticsChange?: (stats) => void` - Callback para actualizar estadísticas

**Características**:
- Vista de bloques en cuadrícula
- Buscador integrado para bloques
- Navegación a nichos del bloque seleccionado
- Tarjetas visuales con código de colores por estado
- Tooltips informativos con estadísticas
- Vista detallada de nichos con grid interactivo

### `BlocksMap` (Deprecado)
Componente anterior para visualizar solo bloques. Ahora reemplazado por `BlocksWithNichesMap`.

### `NichesGrid` (Deprecado)
Componente anterior para visualizar solo nichos. Ahora integrado en `BlocksWithNichesMap`.

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

### BloqueWithNichos
```typescript
interface BloqueWithNichos extends BloqueEntity {
  nichos: NichoWithHuecos[];
  totalNichos: number;
  disponibles: number;
  reservados: number;
  vendidos: number;
}
```

## Hooks Utilizados

### `useCemetery()`
Hook personalizado para gestionar el estado del cementerio seleccionado.

### `useBloquesWithNichos(idCementerio)`
Hook principal que combina bloques y nichos:
- Obtiene los bloques del cementerio
- Obtiene todos los nichos del cementerio
- Asocia automáticamente nichos a bloques por bloque (por `idBloque`)
- Calcula estadísticas por bloque
- Maneja la selección/deselección de bloques

```typescript
const {
  bloques,           // Array de bloques con sus nichos
  selectedBloque,    // Bloque actualmente seleccionado
  selectBloque,      // Función para seleccionar un bloque
  deselectBloque,    // Función para volver a vista de bloques
  loading,           // Estado de carga
  error,             // Errores
  refetch           // Refrescar datos
} = useBloquesWithNichos(cementerioId);
```

### `useFindBloquesByCementeryQuery(idCementerio)`
Hook de React Query para obtener los bloques de un cementerio específico.

### `useNichesWithHuecos(idCementerio)`
Hook para obtener los nichos con información de huecos.

## Lógica de Asociación Bloque-Nicho

Los nichos se asocian automáticamente a bloques mediante su relación con el bloque (`idBloque`) o, si no existe relación directa, mediante la comparación del identificador del bloque con datos del nicho:

```typescript
// Ejemplo de asociación preferente por id
const bloqueNichos = niches.filter((nicho) => {
  if (nicho.idBloque) return String(nicho.idBloque) === String(bloque.idBloque);
  const bloqueIdentifier = bloque.numero?.toString() || bloque.nombre;
  // Fallback a comparación por texto si no existe idBloque
  return (nicho.bloqueNombre || "").toLowerCase().includes(bloqueIdentifier.toLowerCase()) ||
         bloqueIdentifier.toLowerCase().includes((nicho.bloqueNombre || "").toLowerCase());
});
```

Esta estrategia permite una asociación flexible sin requerir cambios en la base de datos.

## Navegación

- **Vista de Bloques**: Muestra todos los bloques del cementerio
- **Vista de Nichos**: `/nichos/{idNicho}` - Click en "Detalles" de un nicho
- **Transición**: Click en cualquier bloque → Vista de nichos del bloque seleccionado
- **Retorno**: Botón "Volver a bloques" en la vista de nichos

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

- [ ] Permitir configurar manualmente la relación bloque-nicho
- [ ] Filtros avanzados para bloques (por estado, capacidad, etc.)
- [ ] Filtros avanzados para nichos dentro de un bloque
- [ ] Exportación de datos del mapa
- [ ] Vista de plano arquitectónico
- [ ] Modo de impresión optimizado
- [ ] Gestión de bloques directamente desde el mapa
- [ ] Drag and drop para reorganizar nichos entre bloques


### Notas Técnicas

### Asociación Automática
La asociación entre bloques y nichos se realiza preferentemente por la relación `idBloque` del nicho. Si el nicho no tiene `idBloque` asociado, se puede realizar una comparación textual entre:
- El `numero` o `nombre` del bloque
- Un campo textual del nicho que identifique el bloque (`bloqueNombre`)

Esta estrategia funciona bien cuando:
- Los nichos están asociados a bloques mediante `idBloque`
- O, en su defecto, se mantiene una nomenclatura consistente para emparejar por texto

### Performance
- Los datos se cargan una sola vez mediante React Query
- Las búsquedas se realizan en el cliente mediante `useMemo`
- Las estadísticas se calculan de forma reactiva
- Los tooltips se renderizan bajo demanda

### Responsive Design
El componente está optimizado para diferentes tamaños de pantalla:
- **Mobile**: Grid adaptativo de bloques y nichos
- **Tablet**: Vista optimizada con más columnas
- **Desktop**: Experiencia completa con todos los detalles
