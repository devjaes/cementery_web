import { PersonEntity } from "@/features/person/domain/entities/person.entity";
import { PropietarioNichoEntity } from "@/features/propietarios-nichos/domain/entities/propietario-nicho.entity";
import { SearchFallecidosRequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";

/**
 * Información del bloque para mostrar en resultados de búsqueda de mejoras
 * Esta interfaz es específica de mejoras para no modificar otras features
 */
export interface MejoraBloqueInfo {
  idBloque: string;
  nombre: string;
  descripcion?: string | null;
  numero?: number | null;
}

/**
 * Información básica del fallecido para mostrar en resultados de búsqueda
 */
export interface MejoraFallecidoInfo {
  idPersona: string;
  cedula?: string | null;
  nombres?: string;
  apellidos?: string;
  fechaDefuncion?: string | null;
  fechaInhumacion?: string | null;
}

/**
 * Extensión del NichoEntity con información adicional del bloque y fallecidos
 * para uso exclusivo en la búsqueda de mejoras
 */
export interface NichoConBloqueInfo {
  idNicho?: string;
  fila: number;
  columna: number;
  tipo: string;
  sector?: string | null;
  numero?: string | null;
  bloque?: MejoraBloqueInfo;
  idCementerio?: {
    idCementerio?: string;
    nombre?: string;
  };
  fallecidos?: MejoraFallecidoInfo[];
}

/**
 * Extensión de PropietarioNichoEntity con información del bloque
 */
export interface PropietarioNichoConBloqueEntity extends Omit<PropietarioNichoEntity, 'idNicho'> {
  idNicho?: NichoConBloqueInfo;
}

export interface PropietarioNichoSearchResult {
  propietario: PersonEntity;
  nichos: PropietarioNichoConBloqueEntity[];
}

export interface MejoraSearchAllResultsEntity {
  terminoBusqueda: string;
  fallecidos: SearchFallecidosRequisitoInhumacionEntity;
  propietarios: PropietarioNichoSearchResult[];
}
