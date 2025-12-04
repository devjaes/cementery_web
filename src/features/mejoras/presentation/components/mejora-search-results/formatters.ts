import { MejoraBloqueInfo, MejoraFallecidoInfo } from "../../../domain/entities/mejora-search.entity";

/**
 * Utility functions for formatting data in mejora search results
 */

const toLocalDateOnly = (value?: string): Date | null => {
  if (!value) return null;

  // Si viene como YYYY-MM-DD, crear fecha local sin aplicar zona horaria UTC
  const dateOnlyMatch = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(value.trim());
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Si viene con hora/offset, normalizar usando componentes UTC para evitar corrimientos
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
};

export const formatDate = (value?: string): string => {
  const date = toLocalDateOnly(value);
  return date ? date.toLocaleDateString("es-EC") : "No disponible";
};

export const fullName = (person?: { nombres?: string; apellidos?: string }): string => {
  if (!person) return "Sin información";
  const parts = [person.nombres, person.apellidos].filter(Boolean);
  return parts.length ? parts.join(" ") : "Sin información";
};

export const formatNichoLocation = (nicho?: { 
  sector?: string | null; 
  fila?: number | string; 
  columna?: number | string;
  numero?: string | null;
  tipo?: string;
  bloque?: MejoraBloqueInfo;
  idCementerio?: { nombre?: string } 
}): string => {
  if (!nicho) return "Sin información";
  const parts = [];
  
  // Agregar bloque si está disponible
  if (nicho.bloque?.nombre) {
    parts.push(`Bloque ${nicho.bloque.nombre}`);
  }
  
  // Agregar sector si está disponible
  if (nicho.sector) parts.push(`Sector ${nicho.sector}`);
  
  // Agregar fila
  if (nicho.fila) parts.push(`Fila ${nicho.fila}`);
  
  // Agregar columna
  if (nicho.columna) parts.push(`Col. ${nicho.columna}`);
  
  // Agregar tipo si está disponible
  if (nicho.tipo) parts.push(`(${nicho.tipo})`);
  
  // Agregar número de nicho si está disponible
  if (nicho.numero) parts.push(`#${nicho.numero}`);
  
  return parts.length > 0 ? parts.join(" • ") : "Sin ubicación";
};

/**
 * Formatea la información de fallecidos en un nicho
 */
export const formatFallecidos = (fallecidos?: MejoraFallecidoInfo[]): string => {
  if (!fallecidos || fallecidos.length === 0) return "Sin fallecidos";
  
  return fallecidos
    .map((f) => {
      const nombre = [f.nombres, f.apellidos].filter(Boolean).join(" ") || "Sin nombre";
      return nombre;
    })
    .join(", ");
};

/**
 * Obtiene el primer fallecido del nicho (para mostrar en la tabla)
 */
export const getFirstFallecido = (fallecidos?: MejoraFallecidoInfo[]): MejoraFallecidoInfo | null => {
  if (!fallecidos || fallecidos.length === 0) return null;
  return fallecidos[0];
};
