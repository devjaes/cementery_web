import { MejoraEntity } from "../../domain/entities/mejora.entity";
import { CreateMejoraDTO } from "../../domain/schemas/mejora.schema";

/**
 * Normaliza una fecha al formato YYYY-MM-DD esperado por el backend.
 * Acepta fechas en formato ISO 8601 completo (con hora) o solo fecha.
 * @param dateValue - Fecha en cualquier formato ISO 8601 o undefined/null
 * @returns Fecha en formato YYYY-MM-DD o undefined si no hay valor
 */
export const normalizeDateToISO = (dateValue: string | null | undefined): string | undefined => {
  if (!dateValue) return undefined;
  
  // Si ya está en formato YYYY-MM-DD, retornarlo tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // Si es formato ISO completo con hora, extraer solo la fecha
  // Ejemplos: "2025-12-11T00:00:00.000Z", "2025-12-11T15:30:00"
  const isoMatch = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) {
    return isoMatch[1];
  }
  
  // Intentar parsear como fecha y formatear
  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Si falla el parseo, retornar undefined
  }
  
  return undefined;
};

/**
 * Normaliza el horario de trabajo al formato esperado por el componente RHFTimeRangeSelect.
 * Acepta formatos como "10h30 a 15h30", "10:30 a 15:30", "10:30-15:30", etc.
 * @param horario - Horario en cualquier formato o undefined/null
 * @returns Horario en formato "HHhMM a HHhMM" o undefined si no hay valor válido
 */
export const normalizeHorarioTrabajo = (horario: string | null | undefined): string | undefined => {
  if (!horario) return undefined;
  
  // Normalizar el string: reemplazar 'h' por ':' para unificar
  const normalized = String(horario).replace(/h/gi, ':');
  
  // Buscar patrón de dos horarios separados por 'a', '-', ' - ', etc.
  // Patrones soportados: "HH:MM a HH:MM", "HH:MM-HH:MM", "HH:MM - HH:MM"
  const match = normalized.match(/(\d{1,2}):(\d{2})\s*[-aA]\s*(\d{1,2}):(\d{2})/);
  
  if (match) {
    const startHour = match[1].padStart(2, '0');
    const startMin = match[2];
    const endHour = match[3].padStart(2, '0');
    const endMin = match[4];
    
    return `${startHour}h${startMin} a ${endHour}h${endMin}`;
  }
  
  // Si no coincide con el patrón esperado, devolver el valor original
  // para que el componente intente parsearlo
  return horario;
};

/**
 * Convierte una entidad de mejora existente a un DTO para edición
 * Mapea todos los campos necesarios del formulario incluyendo campos ocultos
 */
export const mapMejoraEntityToDTO = (entity: MejoraEntity): Partial<CreateMejoraDTO> => {
  const dto: Partial<CreateMejoraDTO> = {
    // General
    idCementerio: entity.idCementerio?.idCementerio,
    id_nicho: entity.idNicho,
    panteoneroACargo: entity.panteoneroACargo,
    metodoSolicitud: entity.metodoSolicitud as "escrito" | "verbal",
    entidad: entity.entidad ?? "GADM Santiago de Pillaro",
    
    // Solicitante
    id_solicitante: entity.solicitante?.id_persona,
    solicitanteDireccion: entity.direccionSolicitante,
    solicitanteTelefono: entity.solicitanteTelefono,
    solicitanteCorreo: entity.correoSolicitante,
    observacionSolicitante: entity.observacionSolicitante,
    
    // Fallecido
    id_fallecido: entity.fallecido?.id_persona,
    fechaFallecimiento: normalizeDateToISO(entity.fechaFallecimiento),
    
    // Nicho
    propietarioNicho: entity.propietarioNicho,
    propietarioNombre: entity.propietarioNombre,
    propietarioFechaAdquisicion: normalizeDateToISO(entity.propietarioFechaAdquisicion),
    propietarioTipoTenencia: entity.propietarioTipoTenencia,
    numeroNichos: entity.numeroNichos,
    lugarNicho: entity.lugarNicho,
    codigoSitio: entity.codigoSitio,
    administradorNicho: entity.administradorNicho,
    esPropio: entity.esPropio,
    observacionNicho: entity.observacionNicho,
    
    // Acción
    tipoServicio: entity.tipoServicio,
    observacionServicio: entity.observacionServicio,
    fechaInicio: normalizeDateToISO(entity.fechaInicio),
    fechaFin: normalizeDateToISO(entity.fechaFin),
    horarioTrabajo: normalizeHorarioTrabajo(entity.horarioTrabajo),
    
    // Campos adicionales (ocultos pero necesarios para el backend)
    codigoAutorizacion: entity.codigoAutorizacion,
    condicion: entity.condicion,
    autorizacionTexto: entity.autorizacionTexto,
    normativaAplicable: entity.normativaAplicable,
    obligacionesPostObra: entity.obligacionesPostObra,
    escombreraMunicipal: entity.escombreraMunicipal,
    direccionEntidad: entity.direccionEntidad,
  };

  return dto;
};
