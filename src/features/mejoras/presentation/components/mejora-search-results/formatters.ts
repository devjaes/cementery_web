import { MejoraBloqueInfo, MejoraFallecidoInfo } from "../../../domain/entities/mejora-search.entity";

/**
 * Utility functions for formatting data in mejora search results
 */

export const formatDate = (value?: string): string => {
  if (!value) return "No disponible";

  const trimmed = value.trim();

  // Si trae hora (formato ISO), parsear a Date para convertir a local y evitar +1 día
  if (trimmed.includes("T")) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? "No disponible" : parsed.toLocaleDateString("es-EC");
  }

  // Si es solo fecha YYYY-MM-DD, renderizarla directamente en local sin corrimientos
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch;
    const asDate = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(asDate.getTime()) ? "No disponible" : asDate.toLocaleDateString("es-EC");
  }

  // Fallback genérico
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? "No disponible" : fallback.toLocaleDateString("es-EC");
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
