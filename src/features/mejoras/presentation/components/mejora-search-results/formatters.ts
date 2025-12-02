/**
 * Utility functions for formatting data in mejora search results
 */

export const formatDate = (value?: string): string => {
  if (!value) return "No disponible";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No disponible" : date.toLocaleDateString("es-EC");
};

export const fullName = (person?: { nombres?: string; apellidos?: string }): string => {
  if (!person) return "Sin información";
  const parts = [person.nombres, person.apellidos].filter(Boolean);
  return parts.length ? parts.join(" ") : "Sin información";
};

export const formatNichoLocation = (nicho?: {
  fila?: string;
  columna?: string;
  idCementerio?: { nombre?: string };
}): string => {
  if (!nicho) return "Sin información";
  const parts: string[] = [];
  if (nicho.fila) parts.push(`Fila ${nicho.fila}`);
  if (nicho.columna) parts.push(`Columna ${nicho.columna}`);
  return parts.length > 0 ? parts.join(" • ") : "Sin ubicación";
};
