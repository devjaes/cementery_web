import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { CreateMejoraModel, MejoraModel } from "../models/mejora.model";

export class MejoraMapper {
  static toEntity(model: MejoraModel): MejoraEntity {
    return {
      idMejora: model.id_mejora,
      fechaSolicitud: model.fechaSolicitud,
      codigoAutorizacion: model.codigoAutorizacion,

      idCementerio: CementeryMapper.toEntity(model.id_cementerio),
      pantoneroACargo: model.pantoneroACargo,
      metodoSolicitud: model.metodoSolicitud,

      solicitante: PersonMapper.toEntity(model.solicitante),
      direccionSolicitante: model.direccionSolicitante,
      celularSolicitante: model.celularSolicitante,
      correoSolicitante: model.correoSolicitante,

      fallecido: model.fallecido ? PersonMapper.toEntity(model.fallecido) : undefined,
      fechaFallecimiento: model.fechaFallecimiento,

      propietarioNicho: model.propietarioNicho,
      numeroNichos: model.numeroNichos,
      lugarNicho: model.lugarNicho,
      codigoSitio: model.codigoSitio,
      administradorNicho: model.administradorNicho,
      esPropio: model.esPropio,
      observacionNicho: model.observacionNicho,

      tipoServicio: model.tipoServicio,
      observacionAccion: model.observacionAccion,
      fechaInicio: model.fechaInicio,
      fechaFin: model.fechaFin,
      horario: model.horario,
    };
  }

  static toModel(entity: CreateMejoraEntity): CreateMejoraModel {
    return {
      id_cementerio: entity.idCementerio,
      pantoneroACargo: entity.pantoneroACargo,
      metodoSolicitud: entity.metodoSolicitud,
      solicitanteId: entity.solicitanteId,
      direccionSolicitante: entity.direccionSolicitante,
      celularSolicitante: entity.celularSolicitante,
      correoSolicitante: entity.correoSolicitante,
      fallecidoId: entity.fallecidoId,
      fechaFallecimiento: entity.fechaFallecimiento,
      propietarioNicho: entity.propietarioNicho,
      numeroNichos: entity.numeroNichos,
      lugarNicho: entity.lugarNicho,
      codigoSitio: entity.codigoSitio,
      administradorNicho: entity.administradorNicho,
      esPropio: entity.esPropio,
      observacionNicho: entity.observacionNicho,
      tipoServicio: entity.tipoServicio,
      observacionAccion: entity.observacionAccion,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin,
      horario: entity.horario,
    };
  }
}


