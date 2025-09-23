import {
  NichoModel,
  CreateNichoModel,
  UpdateNichoModel,
} from "../models/nicho.model";
import {
  NichoEntity,
  CreateNichoEntity,
  UpdateNichoEntity,
} from "../../domain/entities/nicho.entity";
import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { HuecoMapper } from "@/features/huecos/infrastructure/mappers/hueco.mapper";
import { PropietarioNichoMapper } from "@/features/propietarios-nichos/infrastructure/mappers/propietario-nicho.mapper";

export class NichoMapper {
  static toEntity(model: NichoModel): NichoEntity {
    return {
      idNicho: model.id_nicho ? model.id_nicho : undefined,
      idCementerio: model.id_cementerio
        ? CementeryMapper.toEntity(model.id_cementerio)
        : undefined,
      sector: model.sector,
      fila: model.fila,
      numero: model.numero,
      tipo: model.tipo,
      estado: model.estado,
      fechaConstruccion: model.fecha_construccion,
      observaciones: model.observaciones,
      numHuecos: model.num_huecos,
      fechaCreacion: model.fecha_creacion,
      fechaActualizacion: model.fecha_actualizacion,
      huecos: model.huecos
        ? model.huecos?.map(HuecoMapper.toEntity)
        : undefined,
      propietarios: model.propietarios_nicho
        ? model.propietarios_nicho?.map(PropietarioNichoMapper.toEntity)
        : undefined,
      inhumaciones: model.inhumaciones ? model.inhumaciones : undefined,
    };
  }

  static toModel(entity: CreateNichoEntity): CreateNichoModel {
    return {
      id_cementerio: entity.idCementerio,
      sector: entity.sector,
      fila: entity.fila,
      numero: entity.numero,
      tipo: entity.tipo,
      fecha_construccion: entity.fechaConstruccion,
      observaciones: entity.observaciones,
      num_huecos: entity.numHuecos,
    };
  }

  static toUpdateModel(entity: UpdateNichoEntity): UpdateNichoModel {
    return {
      id_nicho: entity.idNicho,
      sector: entity.sector,
      fila: entity.fila,
      numero: entity.numero,
      tipo: entity.tipo,
      fecha_construccion: entity.fechaConstruccion,
      observaciones: entity.observaciones,
      num_huecos: entity.numHuecos,
    };
  }
}
