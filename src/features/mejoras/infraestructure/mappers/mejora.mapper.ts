import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { CreateMejoraModel, MejoraModel } from "../models/mejora.model";

export class MejoraMapper {
  static toEntity(model: MejoraModel): MejoraEntity {
    const cementeryModel = model.id_cementerio ?? model.nicho?.id_cementerio;
    if (!cementeryModel) {
      throw new Error("La respuesta de mejoras no incluye el cementerio asociado");
    }

    return {
      idMejora: model.id_mejora,
      fechaCreacion: model.fechaCreacion ?? model.fecha_creacion ?? model.fechaSolicitud,
      fechaSolicitud: model.fechaSolicitud ?? model.fechaCreacion ?? model.fecha_creacion,
      codigoAutorizacion: model.codigoAutorizacion,
      idCementerio: CementeryMapper.toEntity(cementeryModel),
      idNicho: model.nicho?.id_nicho,
      panteoneroACargo: model.panteoneroACargo ?? model.pantoneroACargo ?? "",
      metodoSolicitud: model.metodoSolicitud,
      estado: model.estado,
      solicitante: PersonMapper.toEntity(model.solicitante),
      direccionSolicitante: model.direccionSolicitante,
      solicitanteTelefono: model.solicitanteTelefono ?? model.celularSolicitante,
      correoSolicitante: model.correoSolicitante,
      observacionSolicitante: model.observacionSolicitante,
      entidad: model.entidad,
      fallecido: model.fallecido ? PersonMapper.toEntity(model.fallecido) : undefined,
      fechaFallecimiento: model.fechaFallecimiento,
      propietarioNicho: model.propietarioNicho,
      propietarioNombre: model.propietarioNombre,
      propietarioFechaAdquisicion: model.propietarioFechaAdquisicion,
      propietarioTipoTenencia: model.propietarioTipoTenencia,
      numeroNichos: model.numeroNichos,
      lugarNicho: model.lugarNicho,
      codigoSitio: model.codigoSitio,
      administradorNicho: model.administradorNicho,
      esPropio: model.esPropio,
      observacionNicho: model.observacionNicho,
      tipoServicio: model.tipoServicio,
      observacionServicio: model.observacionServicio ?? model.observacionAccion,
      fechaInicio: model.fechaInicio,
      fechaFin: model.fechaFin,
      horarioTrabajo: model.horarioTrabajo ?? model.horario,
      condicion: model.condicion,
      autorizacionTexto: model.autorizacionTexto,
      normativaAplicable: model.normativaAplicable,
      obligacionesPostObra: model.obligacionesPostObra,
      escombreraMunicipal: model.escombreraMunicipal,
      direccionEntidad: model.direccionEntidad,
      documentos: model.documentos,
    };
  }

  static toModel(entity: CreateMejoraEntity): CreateMejoraModel {
    return {
      id_cementerio: entity.idCementerio,
      id_nicho: entity.id_nicho,
      panteoneroACargo: entity.panteoneroACargo,
      metodoSolicitud: entity.metodoSolicitud,
      id_solicitante: entity.id_solicitante,
      solicitanteDireccion: entity.solicitanteDireccion,
      solicitanteTelefono: entity.solicitanteTelefono,
      solicitanteCorreo: entity.solicitanteCorreo,
      observacionSolicitante: entity.observacionSolicitante,
      id_fallecido: entity.id_fallecido,
      fechaFallecimiento: entity.fechaFallecimiento,
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
    tipoServicio: entity.tipoServicio,
    observacionServicio: entity.observacionServicio,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin,
    horarioTrabajo: entity.horarioTrabajo,
    entidad: entity.entidad,
      codigoAutorizacion: entity.codigoAutorizacion,
      condicion: entity.condicion,
      autorizacionTexto: entity.autorizacionTexto,
      normativaAplicable: entity.normativaAplicable,
      obligacionesPostObra: entity.obligacionesPostObra,
      escombreraMunicipal: entity.escombreraMunicipal,
      direccionEntidad: entity.direccionEntidad,
    };
  }
}


