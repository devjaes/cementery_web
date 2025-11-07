import { NichoMapper } from "@/features/nichos/infrastructure/mappers/nicho.mapper";
import { InhumacionMapper } from "@/features/inhumaciones/infrastructure/mappers/inhumacion.mapper";
import { ExhumacionEntity, CreateExhumacionEntity, UpdateExhumacionEntity } from "../../domain/entities/exhumacion.entity";
import { ExhumacionModel, CreateExhumacionModel, UpdateExhumacionModel } from "../models/exhumacion.model";

export class ExhumacionMapper {
  static toEntity(model: ExhumacionModel): ExhumacionEntity {
    return {
      idExhumacion: model.id_exhumacion,
      fechaExhumacion: model.fecha_exhumacion,
      horaExhumacion: model.hora_exhumacion,
      duenioNicho: model.duenio_nicho,
      ubicacion: model.ubicacion,
      causa: model.causa,
      observacion: model.observacion,
      archivos: model.archivos,
      estadoPago: model.estado_pago,
      comprobantePago: model.comprobante_pago,
      codigo: model.codigo,
      nichoOriginalId: model.nicho_original_id,
      inhumacionId: model.inhumacion_id,
      fechaCreacion: model.fecha_creacion,
      fechaActualizacion: model.fecha_actualizacion,
      nichoOriginal: model.nicho_original ? NichoMapper.toEntity(model.nicho_original) : undefined,
      inhumacion: model.inhumacion ? InhumacionMapper.toEntity(model.inhumacion) : undefined,
    };
  }

  static toModel(entity: CreateExhumacionEntity): Omit<CreateExhumacionModel, 'archivos'> {
    return {
      fecha_exhumacion: entity.fechaExhumacion,
      hora_exhumacion: entity.horaExhumacion,
      duenio_nicho: entity.duenioNicho,
      ubicacion: entity.ubicacion,
      causa: entity.causa,
      observacion: entity.observacion,
      nicho_original_id: entity.nichoOriginalId,
      inhumacion_id: entity.inhumacionId,
    };
  }

  static toUpdateModel(entity: UpdateExhumacionEntity): UpdateExhumacionModel {
    return {
      id_exhumacion: entity.idExhumacion,
      fecha_exhumacion: entity.fechaExhumacion,
      hora_exhumacion: entity.horaExhumacion,
      duenio_nicho: entity.duenioNicho,
      ubicacion: entity.ubicacion,
      causa: entity.causa,
      observacion: entity.observacion,
      archivos: entity.archivos,
      comprobante_pago: entity.comprobantePago,
      estado_pago: entity.estadoPago,
    };
  }
}
