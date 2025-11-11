import { MejoraEntity } from "../../domain/entities/mejora.entity";
import { CreateMejoraDTO } from "../../domain/schemas/mejora.schema";

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
    fechaFallecimiento: entity.fechaFallecimiento,
    
    // Nicho
    propietarioNicho: entity.propietarioNicho,
    propietarioNombre: entity.propietarioNombre,
    propietarioFechaAdquisicion: entity.propietarioFechaAdquisicion,
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
    fechaInicio: entity.fechaInicio,
    fechaFin: entity.fechaFin,
    horarioTrabajo: entity.horarioTrabajo,
    
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
