import { BloqueCreateEntity, BloqueEntity, BloqueUpdateEntity } from "../../domain/entities/bloque.entity";
import { BloqueCreateModel, BloqueModel, BloqueUpdateModel } from "../models/bloque.model";

export class BloqueMapper {
  static toEntity(model: BloqueModel): BloqueEntity {
    return {
      idBloque: model.id_bloque,
      idCementerio: model.id_cementerio,
      nombre: model.nombre,
      descripcion: model.descripcion,
      tipoBloque: (model as any).tipo_bloque ?? null,
      numero: model.numero ?? null,
      numeroFilas: model.numero_filas,
      numeroColumnas: model.numero_columnas,
      estado: model.estado,
      fechaCreacion: model.fecha_creacion,
      fechaModificacion: model.fecha_modificacion,
    };
  }

  static toCreateModel(entity: BloqueCreateEntity): BloqueCreateModel {
    return {
      id_cementerio: entity.idCementerio,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      numero: entity.numero,
      tipo_bloque: (entity as any).tipoBloque,
      numero_filas: entity.numeroFilas,
      numero_columnas: entity.numeroColumnas,
    };
  }

  static toUpdateModel(entity: BloqueUpdateEntity): BloqueUpdateModel {
    return {
      id_bloque: entity.idBloque,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      numero: entity.numero ?? null,
      numero_filas: entity.numeroFilas,
      numero_columnas: entity.numeroColumnas,
    };
  }
}
