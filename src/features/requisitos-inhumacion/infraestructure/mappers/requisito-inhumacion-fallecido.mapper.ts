import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { RequisitoInhumacionFallecidosEntity, SearchFallecidosRequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { RequisitoInhumacionFallecidosModel, SearchFallecidosRequisitoInhumacionModel } from "../models/requisito-inhumacion.model";
import { RequisitoInhumacionMapper } from "./requisito-inhumacion.mapper";
import { NichoMapper } from "@/features/nichos/infrastructure/mappers/nicho.mapper";
import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";




export class RequisitoInhumacionFallecidoMapper {
    static toEntity(model: RequisitoInhumacionFallecidosModel): RequisitoInhumacionFallecidosEntity {
        return {
            fallecido: PersonMapper.toEntity(model.fallecido),
            requisitos: model.requisitos.map(RequisitoInhumacionMapper.toEntity),
            nichos: model.nichos.map(NichoMapper.toEntity),
            cementerios: model.cementerios.map(CementeryMapper.toEntity)
        };
    }
}


export class SearchFallecidosRequisitoInhumacionMapper {

    static toEntity(model: SearchFallecidosRequisitoInhumacionModel): SearchFallecidosRequisitoInhumacionEntity {
        return {
            terminoBusqueda: model.termino_busqueda,
            totalEncontrados: model.total_encontrados,
            fallecidos: model.fallecidos.map(RequisitoInhumacionFallecidoMapper.toEntity)
        };
    }
}