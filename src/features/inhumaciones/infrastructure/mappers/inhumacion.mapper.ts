import { CreateInhumacionModel, InhumacionModel, UpdateInhumacionModel } from "../models/inhumacion.model";
import { CreateInhumacionEntity, InhumacionEntity, UpdateInhumacionEntity } from "../../domain/entities/inhumacion.entity";
import { NichoMapper } from "@/features/nichos/infrastructure/mappers/nicho.mapper";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";


export class InhumacionMapper {
    static toEntity(model: InhumacionModel): InhumacionEntity {
        return {
           idNicho: NichoMapper.toEntity(model.id_nicho),
           idFallecido: PersonMapper.toEntity(model.id_fallecido),
           idInhumacion: model.id_inhumacion,
            fechaInhumacion: model.fecha_inhumacion,
            horaInhumacion: model.hora_inhumacion,
            solicitante: model.solicitante,
            responsableInhumacion: model.responsable_inhumacion,
            observaciones: model.observaciones ?? undefined,
            estado: model.estado,
            codigoInhumacion: model.codigo_inhumacion,
            fechaCreacion: model.fecha_creacion,
            fechaActualizacion: model.fecha_modificacion ?? null,

        };
    }

    static toModel(entity: CreateInhumacionEntity): CreateInhumacionModel {
        return {
            id_nicho: entity.idNicho,
            id_fallecido: entity.idFallecido,
            fecha_inhumacion: entity.fechaInhumacion,
            hora_inhumacion: entity.horaInhumacion,
            observaciones: entity.observaciones ?? null,
            estado: entity.estado,
            solicitante: entity.solicitante,
            responsable_inhumacion: entity.responsableInhumacion,
            codigo_inhumacion: entity.codigoInhumacion,
        };
    }

    static toUpdateModel(entity: UpdateInhumacionEntity): UpdateInhumacionModel {
        return {
            id_inhumacion: entity.idInhumacion,
            id_nicho: entity.idNicho,
            id_fallecido: entity.idFallecido,
            fecha_inhumacion: entity.fechaInhumacion,
            hora_inhumacion: entity.horaInhumacion,
            observaciones: entity.observaciones ?? null,
            estado: entity.estado,
            solicitante: entity.solicitante,
            responsable_inhumacion: entity.responsableInhumacion,
            codigo_inhumacion: entity.codigoInhumacion,
        };
    }

}