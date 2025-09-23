import {
  PropietarioNichoModel,
  CreatePropietarioNichoModel,
  UpdatePropietarioNichoModel,
} from "../models/propietario-nicho.model";
import {
  PropietarioNichoEntity,
  CreatePropietarioNichoEntity,
  UpdatePropietarioNichoEntity,
} from "../../domain/entities/propietario-nicho.entity";
import { NichoMapper } from "@/features/nichos/infrastructure/mappers/nicho.mapper";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";

export class PropietarioNichoMapper {
  static toEntity(model: PropietarioNichoModel): PropietarioNichoEntity {
    return {
      idPropietarioNicho: model.id_propietario_nicho,
      idPersona: model.id_persona ? PersonMapper.toEntity(model.id_persona) : undefined,
      idNicho: model.id_nicho ? NichoMapper.toEntity(model.id_nicho) : undefined,
      fechaAdquisicion: model.fecha_adquisicion,
      tipoDocumento: model.tipo_documento,
      numeroDocumento: model.numero_documento,
      activo: model.activo,
      razon: model.razon,
      fechaCreacion: model.fecha_creacion,
      fechaActualizacion: model.fecha_actualizacion,
      tipo: model.tipo,
    };
  }

  static toModel(
    entity: CreatePropietarioNichoEntity
  ): CreatePropietarioNichoModel {
    return {
      id_persona: entity.idPersona,
      id_nicho: entity.idNicho,
      fecha_adquisicion: entity.fechaAdquisicion,
      tipo_documento: entity.tipoDocumento,
      numero_documento: entity.numeroDocumento,
      razon: entity.razon,
      tipo: entity.tipo,
    };
  }

  static toUpdateModel(
    entity: UpdatePropietarioNichoEntity
  ): UpdatePropietarioNichoModel {
    return {
      id_propietario_nicho: entity.idPropietarioNicho,
      activo: entity.activo,
      razon: entity.razon,
      tipo_documento: entity.tipoDocumento,
      numero_documento: entity.numeroDocumento,
      tipo: entity.tipo,
    };
  }
}
