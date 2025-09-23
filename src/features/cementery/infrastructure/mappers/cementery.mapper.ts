import { CementeryEntity, CementeryCreateEntity, CementeryUpdateEntity } from "../../domain/entities/cementery.entity";
import { CementeryModel, CementeryCreateModel, CementeryUpdateModel } from "../models/cementery.model";

export class CementeryMapper {
    static toEntity(model: CementeryModel): CementeryEntity {
        return {
            idCementerio: model.id_cementerio,
            nombre: model.nombre,
            direccion: model.direccion,
            telefono: model.telefono,
            responsable: model.responsable,
            estado: model.estado,
            fechaCreacion: model.fecha_creacion,
            fechaModificacion: model.fecha_modificacion,
        };
    }

    static toModel(entity: CementeryCreateEntity): CementeryCreateModel {
        return {
            nombre: entity.nombre,
            direccion: entity.direccion,
            telefono: entity.telefono,
            responsable: entity.responsable,
        };
    }

    static toUpdateModel(entity: CementeryUpdateEntity): CementeryUpdateModel {
        return {
            id_cementerio: entity.idCementerio,
            nombre: entity.nombre,
            direccion: entity.direccion,
            telefono: entity.telefono,
            responsable: entity.responsable,
        };
    }
} 